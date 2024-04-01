### qiankun 基本实现原理

desc: 本文主要讲述 qiankun 微应用框架的基本实现原理，其中主要讲述主应用如何监听路由变化匹配对应的子应用、如何加载执行子应用的资源以及如何对应的生命周期等

#### 监听路由变化

监听 hash 路由可以直接使用 `window.onhashchange` 方法实现。

监听 history 路由需要分两种情况：

1. history.go、history.back、history.forward：需要通过 `popstate` 事件实现。

2. `pushState`、`replaceState` 则需要通过函数重写的方式进行劫持：

```js
let prevRoute = ""; // 上一个路由
let nextRoute = window.location.pathname; // 下一个路由

// 监听路由前进后退
window.addEventListener("popstate", () => {
  // popstate 事件触发时，路由已经完成导航了，因此需要通过如下方式进行设置。
  prevRoute = nextRoute;
  nextRoute = window.location.pathname;
  console.log("监听到 popstate 变化");
});

// 监听 push
const rawPushState = window.history.pushState;
window.history.pushState = (...args) => {
  prevRoute = window.location.pathname;
  // 执行完这句代码之后，就改变了路由的历史纪录
  rawPushState.apply(window.history, args);
  nextRoute = window.location.pathname;
  console.log("监听到 pushState 变化");
};

// 监听 replace
const rawReplaceState = window.history.replaceState;
window.history.replaceState = (...args) => {
  prevRoute = window.location.pathname;
  rawReplaceState.apply(window.history, args);
  nextRoute = window.location.pathname;
  console.log("监听到 replaceState 变化");
};
```

#### 匹配子路由

通过获取到当前的路由路径，再从 apps（子应用列表） 中查找对应路径的应用。

```js
// apps 就是在主项目中注册的子应用列表
const app = apps.find((i) => winddow.location.pathname === i.activeRule);
```

#### 加载子应用

请求获取子应用的资源：HTML、CSS、JS。请求方式可以使用 fetch、ajax、axios 等。

```js
const fetchResource = (url) => fetch(url).then((res) => res.text());
```

#### 渲染子应用

由于客户端渲染需要通过执行 JS 来生成内容，**而浏览器出于安全考虑，innerHTML 中的 script 不会加载执行**，要想执行其中的代码，需要通过 **evel()** 方法或者 **new Function** 执行。

```js
import { fetchResource } from "./fetchResource";

export const importHtml = async (url) => {
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  // 获取所有 script 标签的代码
  function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        // 判断是否是通过 src 引入的资源还是直接编写在 script 标签中的资源
        if (!src) {
          // 直接编写在 script 中的内容，则直接获取 script 标签中的内容
          return Promise.resolve(script.innerHTML);
        } else {
          // 如果是通过 src 导入的资源，则需要请求对应路径中的资源
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  }

  // 获取并执行所有的 script 脚本代码
  async function execScripts() {
    const scripts = await getExternalScripts();

    // 手动构造一个 CommonJS 模块执行环境，此时会将子应用挂载到 module.exports 上。这种方式就可以不依赖子应用的名字了。
    const module = { exports: {} };
    const exports = module.exports;

    scripts.forEach((code) => {
      // eslint-disable-next-line no-eval
      eval(code);
      // 这里能通过window["micro-react-main"]拿到子应用的内容是因为在子应用打包时通过 library 打出了 umd 格式的包，最终会将 micro-react-main 挂载到 window 上
      // console.log(window["micro-react-main"]);
      // 使用 window 获取子应用的方式需要知道每个子应用的打包出来的名字，比较麻烦，因此不推荐该写法。
      // return window["micro-react-main"];
    });

    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
```

#### 处理子应用资源加载失败问题

由于 webpack 或 vite 的 publicPath 默认配置是 `'/'`，所以在加载子应用静态资源时，会导致子应用的静态资源从主项目中查找，即子项目的静态资源域名或变成主项目的域名，所以会导致子项目静态资源加载失败。

解决这个问题，可以将子应用中打包配置文件（webpack.config.js/vite.config.js）中的 publicPath 改为子应用的域名，但是这种方式不够优雅，如果子应用的域名换了，那么 publicPath 又要重新配置，不够优雅。

要优雅的解决这个问题，就需要在主项目中设置一个存储对应子项目域名的一个变量 `__INJECTED_PUBLIC_PATH_BY_QIANKUN__`，并且将它挂载在 `window` 上，即 `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__`，该变量的值就是配置在子应用列表中对应子应用的 `entry` 属性（如：http://dnhyxc.cn）。

#### 完整代码

1. index.js：

```js
import { rewriteRouter } from "./rewriteRouter";
import { handleRouter } from "./handleRouter";

// 注册子应用方法
let _apps = [];

export const getApps = () => _apps;

export const registerMicroApps = (apps) => {
  _apps = apps;
};

export const start = () => {
  rewriteRouter();

  // 初始化时手动执行匹配
  handleRouter();
};
```

2. rewriteRouter.js 用于重写 `pushState` 和 `replaceState` 以监听路由的变化：

```js
import { handleRouter } from "./handleRouter";

/**
 * 1. 监视路由变化
 *  - hash 路由：使用 window.onhashchange 方法监视
 *  - history 路由：
 *    - history.go、history.back、history.forword 使用 popstate 事件进行监视。
 *    - pushState、replaceState 需要通过函数重写的方式进行劫持。
 */

let prevRoute = ""; // 上一个路由
let nextRoute = window.location.pathname; // 下一个路由

export const getPrevRoute = () => prevRoute;
export const getNextRoute = () => nextRoute;

export const rewriteRouter = () => {
  window.addEventListener("popstate", () => {
    // popstate 事件触发时，路由已经完成导航了，因此需要通过如下方式进行设置。
    prevRoute = nextRoute;
    nextRoute = window.location.pathname;
    handleRouter();
  });

  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname;
    rawPushState.apply(window.history, args); // 执行完这句代码之后，就改变了路由的历史纪录
    nextRoute = window.location.pathname;
    handleRouter();
  };

  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  };
};
```

3. importHtmlEntry.js 加载子应用资源：

```js
import { fetchResource } from "./fetchResource";

export const importHtml = async (url) => {
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  // 获取所有 script 标签的代码
  function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  }

  // 获取并执行所有的 script 脚本代码
  async function execScripts() {
    const scripts = await getExternalScripts();

    // 手动构造一个 CommonJS 模块执行环境，此时会将子应用挂载到 module.exports 上。这种方式就可以不依赖子应用的名字了。
    const module = { exports: {} };
    const exports = module.exports;

    scripts.forEach((code) => {
      // eslint-disable-next-line no-eval
      eval(code);
      // 这里能通过window["micro-react-main"]拿到子应用的内容是因为在子应用打包时通过 library 打出了 umd 格式的包，最终会将 micro-react-main 挂载到 window 上
      // console.log(window["micro-react-main"]);
      // 使用 window 获取子应用的方式需要知道每个子应用的打包出来的名字，比较麻烦，因此不推荐该写法。
      // return window["micro-react-main"];
    });

    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
```

4. handleRouter.js 匹配子应用，处理子应用渲染逻辑：

```js
import { getApps } from "./index";
import { getPrevRoute, getNextRoute } from "./rewriteRouter";
import { importHtml } from "./importHtmlEntry";

// 处理路由变化
export const handleRouter = async () => {
  /**
   * 2. 匹配子应用
   *  - 获取到当前的路由路径
   *  - 从 apps 中查找对应的路径
   */
  const apps = getApps();

  // 获取上一个应用
  const prevApp = apps.find((i) => getPrevRoute().startsWith(i.activeRule));

  if (prevApp) {
    await unmount(prevApp);
  }

  // 获取下一个应用
  const app = apps.find((i) => getNextRoute().startsWith(i.activeRule));

  if (!app) return;

  /**
   * 3. 加载子应用
   *  - 请求获取子应用的资源：HTML、CSS、JS。请求方式可以使用 fetch、ajax、axios 等。
   */
  // const html = await fetch(app.entry).then((res) => res.text());
  // const container = document.querySelector(app.container);
  /**
   * 1. 客户端渲染需要通过执行 JS 来生成内容
   * 2. 浏览器出于安全考虑，innerHTML 中的 script 不会加载执行，要想执行其中的代码，需要通过 evel() 方法或者 new Function 执行。
   */
  // container.innerHTML = html;
  const container = document.querySelector(app.container);

  // 4. 渲染子应用
  const { template, execScripts } = await importHtml(app.entry);

  container.appendChild(template);

  // 配置全局环境变量
  window.__POWERED_BY_QIANKUN__ = true;
  // 设置该全局变量用于解决子应用中图片无法加载出来的问题
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = `${app.entry}/`;

  const appExports = await execScripts();
  // 将从 module.exports 中获取到的 bootstrap、mount、unmount设置到 app 上。
  app.bootstrap = appExports.bootstrap;
  app.mount = appExports.mount;
  app.unmount = appExports.unmount;

  // 调用从 module.exports 中获取到的子应用中定义的 bootstrap 方法。
  await bootstrap(app);
  // 调用从 module.exports 中获取到的子应用中定义的 mount 方法。
  await mount(app);
};

async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

async function mount(app) {
  app.mount &&
    (await app.mount({
      container: document.querySelector(app.container),
    }));
}

async function unmount(app) {
  app.unmount &&
    (await app.unmount({
      container: document.querySelector(app.container),
    }));
}
```
