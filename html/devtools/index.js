let iframeNode = null;
let codeResults = '';
const inputRef = document.getElementById("inputRef");
const runBtn = document.getElementById("runBtn");
const initBtn = document.getElementById("initBtn");
const iframeRef = document.getElementById("iframeRef");
const outputRef = document.getElementById("outputRef");

const scriptCode = `
  const consoleMethods = ['log', 'info', 'debug', 'warn', 'error', 'table', 'time', 'timeEnd'];
  
  let seen = new WeakSet();

  // 添加深度限制和大小限制的序列化函数
  function safeStringify(obj, depth = 5, maxSize = 1024 * 10) {
    const stack = [];

    function serialize(value, currentDepth = 0) {
      // 检查深度限制
      if (currentDepth > depth) return '[Max Depth Reached]';

      // 检查对象大小限制
      if (stack.length > maxSize) return '[Max Size Reached]';

      // 处理基本类型
      if (['string', 'number', 'boolean'].includes(typeof value)) return value;

      // 处理函数
      if (typeof value === 'function') return String(value);

      // 处理undefined
      if (typeof value === 'undefined') return 'undefined';

      // 处理null
      if (value === null) return value;

      // 处理循环引用
      if (typeof value === 'object') {
        if (seen.has(value)) return '[Circular]';

        seen.add(value);

        // 处理window.Error
        if (value === Error) return String(value);

        // 处理自定义new Error()
        if (value instanceof Error) return String(value);

        // 处理localStorage
        if (value instanceof Storage) return {}

        // 处理DOM元素
        if (value instanceof HTMLElement) return value.outerHTML;

        // 处理Map
        if (value instanceof Map) {
          const mapObj = {};
          value.forEach((v, k) => {
            mapObj[k] = serialize(v, currentDepth + 1);
          });
          return { type: 'Map', data: mapObj };
        }

        // 处理Set
        if (value instanceof Set) {
          const setArray = [];
          value.forEach(v => {
            setArray.push(serialize(v, currentDepth + 1));
          });
          return { type: 'Set', data: setArray };
        }

        // 处理WeakMap
        if (value instanceof WeakMap) {
          return '[WeakMap]';
        }
          
        // 处理正则
        if (value instanceof RegExp) {
          return value.toString();
        }

        // 处理日期
        if (value instanceof Date) {
          return value.toString();
        }

        // 处理数组和对象
        const isArray = Array.isArray(value);

        const result = isArray ? [] : {};

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            result[key] = serialize(value[key], currentDepth + 1);
          }
        }

        return result;
      }

      return String(value);
    }

    try {
      return JSON.stringify(serialize(obj), null, 2);
    } catch (e) {
      return '[Serialization Error]';
    }
  }

  consoleMethods.forEach(method => {
    const origin = console[method];
    console[method] = (...args) => {
      try {
        window.parent.postMessage({ 
          from: 'codeRunner', 
          type: method, 
          data: safeStringify(args)
        }, '*');
      } catch (e) {
        // 如果序列化失败，发送错误信息
        window.parent.postMessage({ 
          from: 'codeRunner', 
          type: 'error', 
          data: 'Serialization failed: ' + e.message 
        }, '*');
      }
      // 调用原始方法
      origin.apply(console, args);
      // 执行完成后，重置seen，防止无法多次正确的打印同一个数据
      seen = new WeakSet();
    };

    // 确保方法正确绑定
    console[method] = console[method].bind(console);
  });
`;

const codeTemplate = (value) => {
  const template = `
    <body>
      <script>
        ${scriptCode}

        try {
          // 这里使用eval是为了提前捕获在代码解析阶段抛出的错误，比如：重复定义变量
          eval(\`${value}\`);
        } catch(e) {
          window.parent.postMessage({ from: 'codeRunner', type: 'error', data: e }, '*')
        }
      </script>
    </body>
  `;
  return template;
};

runBtn.addEventListener("click", () => {
  createIframe({ code: codeTemplate(inputRef.value), display: 'none' });
});

initBtn.addEventListener("click", () => {
  inputRef.value = `
    let obj1 = { name: 'obj1' };
    let obj2 = { a: obj1 };
    obj1.obj1 = window.location.reload;
    obj2.obj2 = obj2;
    console.log(obj1);
    console.log(obj2.obj2, 'obj2');

    console.log(Error, 'null', new Error());

    console.log(undefined, null, 'null', 'undefined');

    console.log(window.location.reload);

    const fun = () => {
      console.log(111);
    };
    function fun1() {
      return 111;
    }
    const fun2 = function () {
      return 'fun2';
    };
    console.log(fun);
    console.log(fun());
    console.log(fun1);
    console.log(fun2);

    const data = {
      title: 'coderun 实现逻辑',
      content: '首先你要这样，再这样，最后再这样，就好了',
      author: 'dnhyxc',
      like: 999,
    };
    console.log(data, 11, '这是一个对象');

    const arr = [1, 2, 3, 4, 5, 6, 7, '888'];
    console.log(arr, 'arr');

    const div = document.createElement('div');
    div.id = 'dnhyxc';
    div.innerHTML = 'dnhyxc';
    console.log(div, 'div');

    console.log(new Date().valueOf(), new Date());
    
    console.log(new RegExp(/__ERROR__$/));
    window.a = new RegExp(/a/g);
    console.log(window.a);
  `
});

const createIframe = ({ code, display }) => {
  iframeNode && iframeRef.removeChild(iframeNode);
  const iframe = document.createElement("iframe");
  iframeNode = iframe;
  iframe.src = "about:blank";
  iframe.style.display = display;
  iframeRef.appendChild(iframe);
  const frameDocument = iframe.contentWindow.document;
  frameDocument.open();
  frameDocument.write(code);
  frameDocument.close();
};

// 格式化解析数据
const JSONParse = (objStr) => {
  return JSON.parse(objStr, (k, v) => {
    if (typeof v === 'string' && v.indexOf && (v.indexOf('function') > -1 || v.indexOf('=>') > -1)) {
      try {
        if (v.startsWith('function') || v.includes('=>')) {
          return new Function(`return ${v}`)();
        }
      } catch (error) {
        return v;
      }
    }
    return v;
  });
};

// 监听 iframe 中运行 code 后发送的消息
window.addEventListener('message', (e) => {
  if (e.data.from === 'codeRunner') {
    const { data, type } = e.data;
    if (type === 'error') {
      // 处理运行时错误信息
      console.log(data, 'error');
      outputRef.innerHTML = data;
    } else {
      const parseData = JSONParse(data);
      // 运行结果信息
      let code = parseData
        .map((item) => (typeof item === 'object' ? JSON.stringify(item) : item))
        .join('\n')
        .replace(/"([^"]+)":/g, '$1: ');
      codeResults += `${code}\n\n`;
      outputRef.innerHTML = codeResults;
    }
  }
});