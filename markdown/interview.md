### 概念类

#### 事件队列是 V8 引擎创建的还是浏览器创建的

浏览器中的事件队列（Event Queue）是由浏览器引擎创建和管理的。浏览器引擎包括了渲染引擎和 JavaScript 引擎（如 V8 引擎）。这两个引擎通常是紧密集成在一起的。

JavaScript 引擎（例如 V8 引擎）负责解释和执行 JavaScript 代码，包括处理同步和异步任务。当遇到异步任务（如定时器、事件监听器、网络请求等）时，JavaScript 引擎并不会立即执行这些任务，而是将这些任务交给浏览器引擎来处理。

浏览器引擎将异步任务添加到事件队列中。当主线程空闲时，它会从事件队列中取出一个事件，并将其交给 JavaScript 引擎执行相应的回调函数。

V8 引擎是一款用于执行 JavaScript 代码的引擎，它主要用于将 JavaScript 代码转换为机器可执行的指令。V8 引擎本身并不负责处理浏览器环境中的事件和异步任务。

浏览器作为宿主环境，在加载和渲染网页时会创建一个事件循环(Event Loop)来管理 JavaScript 代码的执行。事件循环负责接收和分发各种事件，例如用户交互、网络请求的完成、计时器的触发等。当这些事件发生时，浏览器会将相应的事件放入事件队列中。

事件队列是一种先进先出（FIFO）的数据结构，用于按顺序存储待处理的事件。JavaScript 引擎通过不断地从事件队列中提取事件，并执行相应的事件处理程序来处理这些事件。这样可以确保事件按照它们被添加到队列中的顺序进行处理，从而实现异步执行和事件驱动的编程模型。

总结起来，V8 引擎负责执行 JavaScript 代码，而浏览器负责创建和管理事件队列，以及在适当的时机将事件推送给 V8 引擎进行处理。

浏览器引擎包括了渲染引擎和 JavaScript 引擎（如 V8 引擎）。这两个引擎通常是紧密集成在一起的。

#### 不同的任务是否有执行优先级？优先级是如何划分的？

不同的任务在事件队列中有不同的执行优先级。以下是一些常见任务的优先级划分：

1. 宏任务（Macrotasks）：宏任务包括用户交互事件（如点击、滚动）、计时器（setTimeout、setInterval）、网络请求等。宏任务通常有较低的优先级，会在微任务之后执行。

2. 微任务（Microtasks）：微任务包括 Promise 回调、MutationObserver 回调和队列被清空时触发的一些回调。微任务具有较高的优先级，在宏任务执行结束后，会优先执行微任务。

3. 动画帧回调（requestAnimationFrame）：该任务用于优化动画的渲染，通常会在每个浏览器绘制帧之前执行。

4. 渲染任务：渲染任务用于更新网页的布局和绘制，主要由浏览器引擎处理。它们通常具有最高的优先级，并在其他任务之前执行。

需要注意的是，虽然微任务在宏任务之前执行，但在单个任务执行过程中，微任务可能会被不断添加，而导致微任务的执行时间比较长，从而阻塞宏任务执行。因此，在编写代码时应注意避免出现过多且耗时的微任务，以免影响整体的任务执行顺序和性能。

总结：宏任务具有较低的优先级，微任务具有较高的优先级，动画帧回调和渲染任务具有最高的优先级。这种优先级划分确保了一致性和流畅性的用户体验，并提供了合适的异步编程模型。

#### 一共有多少种事件队列，它们是如何协作的？

1. 宏任务队列（Macrotask Queue）：宏任务队列包含了主线程上的所有宏任务，如用户交互事件、定时器等。当宏任务被触发时，它们会被添加到宏任务队列中等待执行。

2. 微任务队列（Microtask Queue）：微任务队列包含了微任务，如 Promise 回调、MutationObserver 回调等。当微任务被触发时，它们会被添加到微任务队列中等待执行。

3. 渲染队列：渲染队列用于处理页面的渲染和绘制操作，它包含了需要更新页面布局和渲染的任务。

这些事件队列之间的协作方式如下：

1. 当主线程执行完当前的宏任务后，会检查微任务队列是否为空。如果微任务队列非空，主线程会依次执行微任务队列中的所有微任务，直到微任务队列为空。

2. 在执行微任务过程中，如果有新的微任务产生，会添加到微任务队列的末尾。这意味着微任务可能会被推迟到下一轮的事件循环中执行。

3. 在所有微任务执行完毕后，如果存在渲染任务，则会执行渲染队列中的任务，更新页面的布局和绘制。

4. 当微任务和渲染任务都执行完毕后，主线程会查看宏任务队列。如果宏任务队列非空，则取出下一个宏任务并执行。

通过这种事件队列的协作方式，浏览器能够合理地处理不同类型的任务，保持页面的响应性，并确保任务执行的顺序和优先级得到维护。这有助于提供良好的用户体验和避免阻塞主线程导致页面无响应。

#### 宏任务有哪些，微任务有哪些？

常见的宏任务（Macrotasks）包括：

1. 用户交互事件（如点击、滚动、输入等）。

2. 计时器任务（setTimeout、setInterval）。

3. 网络请求（Ajax、fetch）。

4. 文件读取或写入。

5. UI 渲染。

常见的微任务（Microtasks）包括：

1. Promise 的回调函数。

2. MutationObserver 的回调函数。

3. process.nextTick（Node.js 环境）。

#### requestAnimationFrame 是宏任务还是微任务，还是两者都不是，它的执行时机受哪些因素影响？

requestAnimationFrame 是一个比较特殊的任务，既不是宏任务也不是微任务。

requestAnimationFrame 是一种用于执行动画效果的方法，它会在浏览器的重绘之前调用指定的回调函数。它的执行时机受到浏览器的渲染机制和刷新频率的影响。

具体来说，当调用 requestAnimationFrame 方法时，浏览器会在下一次重绘之前调用指定的回调函数。这意味着 requestAnimationFrame 的执行时机与浏览器的刷新频率有关，通常为每秒 60 次（60Hz），即每 16.7 毫秒触发一次。然而，浏览器对于 requestAnimationFrame 的执行时间并没有严格的规定，因此实际执行的间隔时间可能会有所不同。

另外，如果页面处于非激活状态（例如当前标签页不在前台或浏览器最小化），浏览器通常会降低刷新频率，以节省资源。这可能会导致 requestAnimationFrame 的执行间隔变得更长。

要注意的是，虽然 requestAnimationFrame 的执行时机不确定，但它会在每次重绘之前执行一次回调函数，这样可以确保动画的流畅性，并避免产生卡顿或掉帧的现象。

综上所述，requestAnimationFrame 既不是宏任务也不是微任务，它的执行时机受浏览器的渲染机制、刷新频率以及页面的激活状态等因素的影响。

#### 异步任务如何保持执行上下文？

异步任务如何保持执行上下文取决于不同的机制和 API。以下是常见的几种异步任务的执行上下文保持方式：

1. 回调函数：在使用回调函数进行异步编程时，执行上下文是通过闭包来保持的。当定义回调函数时，它会捕获当前的执行上下文，包括变量和作用域链。当异步操作完成后，回调函数被调用，并在先前捕获的执行上下文中执行。

2. Promise：Promise 是一种处理异步操作的机制，它提供了一种更结构化的方式来处理异步任务。在 Promise 中，执行上下文是由 Promise 的状态管理。当创建一个 Promise 时，它会立即执行，并且会捕获当前的执行上下文。当异步操作完成时，Promise 的状态会改变，并且相关的回调函数（如 .then()、.catch()）会在之前的执行上下文中执行。

3. async/await：async/await 是 ECMAScript 2017 中引入的语法糖，用于更方便地处理异步操作。在 async 函数内部使用 await 关键字可以暂停函数的执行，直到异步操作完成。await 关键字会保持当前的执行上下文，并等待异步操作结果的返回。

无论使用哪种异步任务的机制，执行上下文都会被保持并在合适的时机恢复。这意味着异步任务可以访问之前的变量、函数和作用域链，保持了它们的上下文环境。这种方式使得异步编程更加灵活，并且可以确保异步任务能够正常引用和操作先前的上下文数据。

#### 如何创建 10000 个节点，保持不卡顿？

1. 虚拟滚动：如果需要展示的节点较多，并且只有部分节点可见，可以考虑使用虚拟滚动技术。虚拟滚动只渲染当前可见区域的节点，随着滚动的进行，会动态地复用已存在的节点，并更新其内容。这种方式可以有效减少 DOM 节点数量，提高渲染性能。

2. 使用分页加载：将大量节点分批次加载，只加载当前页面需要展示的节点，而不是一次性加载所有节点。

3. 使用列表重用：只创建足够显示的节点，然后通过列表重用机制，当一个节点离开可见区域时，将其移出视图并重新用于展示新的节点。

4. 使用 Web Worker：将节点的创建和渲染工作放在 Web Worker 中进行，这样可以将计算密集型的操作在后台线程中执行，减少主线程的负荷，提高页面的响应性能。

5. 懒加载：只在节点进入视口时才进行创建和渲染，而不是一次性加载所有节点。这样可以降低初始加载时的负载，提高页面加载速度。

### 笔试类

#### compose 函数

compose 函数可以将需要嵌套执行的函数平铺，嵌套执行就是一个函数的返回值将作为另一个函数的参数。具体表现如下：

```js
fun1(fun2(fun3(fun4(fun5(value)))));
```

compose 的出现，可以解决上述多层嵌套带来的代码可读性差及不好维护的问题，compose 具体结构如下：

```js
compose(fun1, fun2, fun3, fun4, fun5)(value);
```

compose 的执行顺序是**从右往左**，也就是：fun5 => fun4 => fun3 => fun2 => fun1。

可以使用 reduceRight() 方法实现，该方法接受一个函数作为累加器（accumulator）和数组的每个值（从右到左）将其减少为单个值。reduceRight 与 reduce 极其相似，只是累加的顺序不一样而已，reduce 的累加顺序是从左往右。

```js
const arr = [1, 2, 3, 4, 5, 6];
const reduceRightRes = arr.reduceRight((total, cur, index, arr) => {
  // 5 '<cur index>' 4  ==>  4 '<cur index>' 3  ==>  3 '<cur index>' 2  ==>  2 '<cur index>' 1  ==>  1 '<cur index>' 0
  console.log(cur, "<cur index>", index);

  return total + cur;
});

console.log(reduceRightRes);
```

compose 具体实现方式如下：

```js
function compose(...funs) {
  return (value) => {
    return funs.reduceRight((total, prevFun) => prevFun(total), value);
  };
}

const add = (x) => x + 1;
const mul = (x) => x * 6;
const div = (x) => x / 2;

const composeRes = compose(div, mul, add)(2);

const result = div(mul(add(2)));

console.log(composeRes, "composeRes", result); // 9 'composeRes' 9
```

Redux 中使用 compose 的示例代码解析：

```js
function composeRedux(...funs) {
  if (funs.length === 0) {
    return (arg) => arg;
  }

  if (funs.length === 1) {
    return funs[0];
  }

  return funs.reduce((a, b) => {
    /**
     * a: div, b: mul
     * a: (...args) => a(b(...args)) 等价于：middleFun1, b: add
     * a: (...drgs) => div(mul(add(...args))) 等价于：middleFun2, b: sub
     */
    return (...args) => a(b(...args));
  });
}

function middleFun1(...args) {
  return div(mul(...args));
}

// 等价于：div(mul(add(...args)))
function middleFun2(...args) {
  return middleFun1(add(...args));
}

const middleFun1Res = middleFun1(add(2));
console.log(middleFun1Res, "middleFun1Res"); // 9

const middleFun2Res = middleFun2(sub(2));
console.log(middleFun2Res, "middleFun2Res"); // 3

const composeReduxRes = composeRedux(div, mul, add, sub)(2);
console.log(composeReduxRes, "composeReduxRes"); // 3
```

#### pipe 函数

pipe 函数与 compose 函数类似，只是执行顺序与 compose 相反而已，因此 pipe 可以使用 reduce 实现：

```js
function pipe(...funs) {
  return (value) => {
    return funs.reduce((total, nextFun) => nextFun(total), value);
  };
}

const add = (x) => x + 1;
const mul = (x) => x * 6;
const div = (x) => x / 2;

const pipeRes = pipe(div, mul, add)(2);

const result = add(mul(div(2)));

console.log(pipeRes, "pipeRes", result); // 7 'pipeRes' 7
```

#### 实现异步任务请求并发数

1. 基于任务队列的方式实现：

```js
class TaskQueue {
  constructor(limit) {
    this.max = limit;
    this.taskList = [];
    /*
    这里使用定时器是为了在同步任务 taskQueue.addTask(task) 
    将所有的任务添加进入任务池之后再触发 run 执行。
    */
    setTimeout(() => {
      this.run();
    });
  }

  addTask(task) {
    this.taskList.push(task);
  }

  run() {
    const length = this.taskList.length;
    if (!length) return;
    const min = Math.min(this.max, length);
    for (let i = 0; i < min; i++) {
      this.max--;
      const task = this.taskList.shift();
      this.getData(task);
    }
  }

  getData(task) {
    task()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.max++;
        this.run();
      });
  }
}

function createTask(i) {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(i);
      }, 5000);
    });
  };
}

const taskQueue = new TaskQueue(4);

for (let i = 0; i < 20; i++) {
  const task = createTask(i);
  taskQueue.addTask(task);
}
```

2. 基于 Promise.race 和 Promise.all 的方式实现：

```js
async function sleep(n, name = "test") {
  return new Promise((resolve) => {
    console.log(n, name, "start");
    setTimeout(() => {
      console.log(n, name, "end-------------");
      resolve({ n, name });
    }, n * 1000);
  });
}

// 限制并发数，item是异步函数队列
async function asyncPool({ limit, items }) {
  const promises = [];
  const pool = new Set();

  const auxiliaryFn = async (fn) => await fn();

  for (const item of items) {
    // 获取到每个 sleep 函数的 promise 返回值，即 Promise({n: xxx, name: 'xxx'})
    const promise = auxiliaryFn(item);

    promises.push(promise);
    pool.add(promise);

    promise.finally(() => {
      pool.delete(promise);
    });

    if (pool.size >= limit) {
      await Promise.race(pool);
    }
  }

  return Promise.all(promises);
}

async function start() {
  await asyncPool({
    limit: 2,
    items: [
      () => sleep(1, "睡觉"),
      () => sleep(3, "刷视频"),
      () => sleep(2, "看书"),
      () => sleep(3.5, "coding"),
      () => sleep(5, "健身"),
    ],
  });
  console.log("结束");
}

start();
```

#### 实现盒子的碰撞检测

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>元素碰撞检测</title>
    <script type="module" src="./index.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #box1 {
        position: absolute;
        top: 50px;
        left: 100px;
        height: 100px;
        width: 100px;
        background-color: skyblue;
      }

      #box2 {
        position: absolute;
        top: 200px;
        left: 200px;
        height: 100px;
        width: 200px;
        background-color: pink;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="box1"></div>
      <div id="box2"></div>
    </div>
  </body>
</html>
```

1. 通过两个盒子的中点坐标实现：

```js
const boxs = document.querySelector("#container");

boxs.addEventListener("mousedown", onMouseDown, false);

function onMouseDown(e) {
  const { target } = e;
  if (target.id.includes("box")) {
    target.style.zIndex = 1;
    target._x = e.clientX - target.offsetLeft;
    target._y = e.clientY - target.offsetTop;
    window.addEventListener("mousemove", onMouseMove, false);
    boxs.addEventListener("mouseup", onMouseUp, false);
  }
}

function onMouseUp(e) {
  window.removeEventListener("mousemove", onMouseMove, false);
  boxs.removeEventListener("onmouseup", onMouseUp, false);
  e.target.style.zIndex = 0;
}

function onMouseMove(e) {
  const { target } = e;
  const x = e.clientX - target._x;
  const y = e.clientY - target._y;

  target.style.left = x + "px";
  target.style.top = y + "px";

  const isCollision = collisionCheckWithMidpoint();
  console.log(isCollision, "isCollision");
}

function createBoxInfo(box) {
  return {
    x: box.offsetLeft,
    y: box.offsetTop,
    w: box.offsetWidth,
    h: box.offsetHeight,
  };
}

function collisionCheckWithMidpoint() {
  const box1 = document.querySelector("#box1");
  const box2 = document.querySelector("#box2");
  const box1Info = createBoxInfo(box1);
  const box2Info = createBoxInfo(box2);

  const box1Center = {
    x: box1Info.x + box1Info.w / 2,
    y: box1Info.y + box1Info.h / 2,
  };

  const box2Center = {
    x: box2Info.x + box2Info.w / 2,
    y: box2Info.y + box2Info.h / 2,
  };

  const diff = {
    x: Math.abs(box1Center.x - box2Center.x),
    y: Math.abs(box1Center.y - box2Center.y),
  };

  // 如果两个盒子中点坐标的差值小于等于 box1 + box2 宽高的一半，说明已经碰撞了
  if (
    diff.x <= (box1Info.w + box2Info.w) / 2 &&
    diff.y <= (box1Info.h + box2Info.h) / 2
  ) {
    return true;
  }

  return false;
}
```

2. 通过盒子的四个边的坐标实现：

```js
const boxs = document.querySelector("#container");

boxs.addEventListener("mousedown", onMouseDown, false);

function onMouseDown(e) {
  const { target } = e;
  if (target.id.includes("box")) {
    target.style.zIndex = 1;
    target._x = e.clientX - target.offsetLeft;
    target._y = e.clientY - target.offsetTop;
    window.addEventListener("mousemove", onMouseMove, false);
    boxs.addEventListener("mouseup", onMouseUp, false);
  }
}

function onMouseUp(e) {
  window.removeEventListener("mousemove", onMouseMove, false);
  boxs.removeEventListener("onmouseup", onMouseUp, false);
  e.target.style.zIndex = 0;
}

function onMouseMove(e) {
  const { target } = e;
  const x = e.clientX - target._x;
  const y = e.clientY - target._y;

  target.style.left = x + "px";
  target.style.top = y + "px";

  const isCollision = collisionCheckWithMidpoint();
  console.log(isCollision, "isCollision");
}

function createBoxInfo(box) {
  return {
    x: box.offsetLeft,
    y: box.offsetTop,
    w: box.offsetWidth,
    h: box.offsetHeight,
  };
}

function collisionCheckWithFourSides() {
  const box1 = document.querySelector("#box1");
  const box2 = document.querySelector("#box2");
  const box1Info = createBoxInfo(box1);
  const box2Info = createBoxInfo(box2);

  if (
    // 在左侧
    box1Info.x + box1Info.w < box2Info.x ||
    // 在上侧
    box1Info.y + box1Info.h < box2Info.y ||
    // 在右侧
    box1Info.x > box2Info.x + box2Info.w ||
    // 在下侧
    box1Info.y > box2Info.y + box2Info.h
  ) {
    return false;
  }

  return true;
}
```

#### 实现一个深拷贝

实现方式一：

```js
function deepClone(origin, target) {
  var toStr = Object.prototype.toString;
  var arrType = "[object Array]";
  var type = toStr.call(origin) === arrType ? [] : {};
  var tar = target || type;

  for (var k in origin) {
    if (origin.hasOwnProperty(k)) {
      if (typeof origin[k] === "object" && origin[k] !== null) {
        tar[k] = toStr.call(origin[k]) === arrType ? [] : {};
        deepClone(origin[k], tar[k]);
      } else {
        tar[k] = origin[k];
      }
    }
  }

  return tar;
}

const testObj = {
  name: "dnhyxc",
  info: {
    age: 18,
    hobby: ["basketball", "coding", "reading"],
  },
};

const testArr = [0, 1, [2, 3], 4, [5, 6, 7, [8, 9, 10]]];

const cloneObj = deepClone(testObj);
const cloneArr = deepClone(testArr);

cloneObj.info.age = 20;

console.log(cloneObj, "cloneObj");
console.log(testObj, "testObj");

testArr[2] = [22, 33];

console.log(cloneArr, "cloneArr");
console.log(testArr, "testArr");
```

实现方式二：

```js
function deepCloneWithWeekMap(origin, hashMap = new WeakMap()) {
  // 说明是基本数据类型
  if (origin === undefined || typeof origin !== "object") {
    return origin;
  }

  if (origin instanceof Date) {
    return new Date(origin);
  }

  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }

  const hashKey = hashMap.get(origin);

  if (hashKey) return hashKey;

  const target = new origin.constructor();

  hashMap.set(origin, target);

  for (let k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = deepClone(origin[k], hashMap);
    }
  }

  return target;
}

let test1 = {};
let test2 = {};

test2.test1 = test1;
test1.test2 = test2;

console.log(deepClone(test2));
```

### Vue 面试相关

#### 实现 reactive

source/reactive.js 文件主要用于实现数据的劫持：

```js
import Dep from "./dep";

const dep = new Dep();

export const reactive = (data) => {
  return new Proxy(data, {
    get(target, key) {
      const value = Reflect.get(target, key);
      // 收集依赖
      dep.collect(target, key);
      return value !== null && typeof value === "object"
        ? reactive(value)
        : value;
    },
    set(target, key, value) {
      const oldValue = target[key];
      const res = Reflect.set(target, key, value);
      // 更改属性值时触发依赖（callback）
      dep.notify(target, key, value, oldValue);
      return res;
    },
  });
};
```

source/dep.js 文件主要用于实现依赖的收集，以 `{a: 1, b: { c: 2 }}` 为例，实现思路如下：

1. 将劫持的每一个对象作为 key 存储在 `WeakMap` 中，因为存储在 WeakMap 中的对象不需要进行枚举，同时 WeakMap 的 key 可以是一个对象，而且 WeakMap 持有的是每个键对象的“弱引用”，所以可以将其存放在 WeakMap 中，使其没有其他引用存在时垃圾回收能及时回收。

2. 在 WeakMap 中，每个对象所对应的是一个 `Map` 对象，而 Map 对象中，是对象中每个 key（如：a）值所对应的 `Set` 对象，Set 对象中存储的就是对象中每个属性的监听回调（如：watchEffe3ct(() => { ... }) 传入的回调函数），到此就建立了每个 key 与监听它的回调的对应关系。具体结构如下：

```js
WeakMap: {
  {a: 1, b: {c: 2}}: Map: {
    a: Set: {
      0: () => state.a + state.b.c, // computed
      1: () => { console.log("watchEffect => state.a", state.a); }, // watchEffect
      2: (cur, prev) => { console.log(cur, prev); console.log("watch => state.a", state.a); } // watch
    }
    b: Set: {
      0: () => state.a + state.b.c, // computed
      1: () => { console.log("watchEffect => state.b.c", state.b.c); }, // watchEffect
      2: (cur, prev) => { console.log(cur, prev); console.log("watch => state.b.c", state.b.c); } // watch
    }
  },
  {c: 2}: Map: {
    c: Set: {
      0: () => state.a + state.b.c, // computed
      1: () => { console.log("watchEffect => state.b.c", state.b.c); }, // watchEffect
      2: (cur, prev) => { console.log(cur, prev); console.log("watch => state.b.c", state.b.c); } // watch
    }
  }
}
```

3. WeakMap、Map、Set 存储对象属性说明：

- WeakMap 与 Map 区别在于垃圾回收器是否回收的问题，WeakMap 对象对 key 是弱引用，如果 target 对象没有任何引用，可以被垃圾回收器回收，这就需要它了。相对于 WeakMap，不管 target 是否引用，Map 都不会被垃圾回收，容易造成内存泄露。

- 之所以把副作用函数都存到 Set 实例中，是因为 Set 可以过滤重复数据，然后在获取数据中收集副作用函数，在修改数据中遍历执行副作用函数，这样就简化了代码，不需要每次改变都要执行一次了，也就是修改一次数据及时更新 effect。

具体实现如下：

```js
export default class Dep {
  // effectCallback 是搜集的对象中每个 key 的监听回调
  static effectCallback = null;

  constructor() {
    this.effectMap = new WeakMap();
  }

  // 收集依赖
  collect(target, key) {
    const { effectCallback } = Dep;

    if (effectCallback) {
      let depMap = this.effectMap.get(target);

      if (!depMap) {
        depMap = new Map();
        this.effectMap.set(target, depMap);
      }

      /**
       * deps 就是每个属性所收集的所有回调：
       * Set(1){
       *   0: () => state.a + state.b.c,
       *   1: () => { console.log("watchEffect => state.a", state.a); }
       *   2: (cur, prev) => { console.log(cur, prev); console.log("watch => state.a", state.a);
       * }
       */
      let deps = depMap.get(key);

      if (!deps) {
        deps = new Set();
        depMap.set(key, deps);
      }

      // 将每一个 callback 加入对应 key 的 Set 中
      deps.add(effectCallback);
    }
  }

  // 当更改对象中的某个属性值时，即给某个属性重新赋值时，触发该属性所收集的依赖
  notify(target, key, value, oldValue) {
    const depMap = this.effectMap.get(target);

    if (!depMap) return;

    const deps = depMap.get(key);

    deps.forEach((dep) => {
      const newValue = dep(value, oldValue);

      // 判断 dep(callback) 上有没有挂 computedRef 属性，如果有，说明是计算属性，需要把得出的新值赋给它
      if (dep.computedRef) {
        dep.computedRef.value = newValue;
      }
    });
  }
}
```

source/computedRef.js 主要用于创建计算属性的实例：

```js
export default class ComputedRef {
  constructor(value) {
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
  }
}
```

source/effect.js 文件主要用于实现 watchEffect、watch、computed：

```js
import ComputedRef from "./computedRef";
import Dep from "./dep";

export const watchEffect = (callback) => {
  Dep.effectCallback = callback;
  // watchEffect 初始化时就会被触发一次，所以需要自动调用
  callback();
  Dep.effectCallback = null;
};

export const watch = (fn, callback) => {
  Dep.effectCallback = callback;
  fn();
  Dep.effectCallback = null;
};

export const computed = (callback) => {
  Dep.effectCallback = callback;
  const value = callback();
  const computedRef = new ComputedRef(value);
  /**
   * 将 computedRef 实例对象挂载到 callback 上，
   * 使在更改属性值触发收集的回调函数（callbacl）时，
   * 能在 notify 中获取到 computedRef 实例，
   * 并将计算出来的新值赋值给 computedRef 实例。
   */
  Object.defineProperty(callback, "computedRef", {
    value: computedRef,
  });
  Dep.effectCallback = null;
  /**
   * 由于 computed 需要支持 xxx.value，
   * 因此需要将 ComputedRef 的实例返回出去，
   * 使 computed 回调函数返回值能够支持通过 xxx.value
   * 获取到最新的计算属性值。
   */
  return computedRef;
};
```

source/index.js 用于统一导出 reactive, watchEffect, watch, computed：

```js
import { reactive } from "./reactive";
import { watchEffect, watch, computed } from "./effect";

export { reactive, watchEffect, watch, computed };
```

index.html 页面渲染模板：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>数据劫持与依赖收集</title>
  </head>
  <body>
    <button id="aBtn">100</button>
    <button id="bBtn">200</button>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

在 index.js 中使用实现的 reactive, watchEffect, watch, computed 这些方法：

```js
import { reactive, watchEffect, watch, computed } from "./source";

const btnA = document.querySelector("#aBtn");
const btnB = document.querySelector("#bBtn");

const state = reactive({
  a: 1,
  b: { c: 2 },
});

const res = computed(() => state.a + state.b.c);

btnA.addEventListener(
  "click",
  () => {
    state.a = 100;
    console.log(res.value, "res");
  },
  false
);

btnB.addEventListener(
  "click",
  () => {
    state.b.c = 200;
    console.log(res.value, "res");
  },
  false
);

watchEffect(() => {
  console.log("watchEffect => state.a", state.a);
});

watchEffect(() => {
  console.log("watchEffect => state.b.c", state.b.c);
});

watch(
  () => state.a,
  (cur, prev) => {
    console.log(cur, prev);
    console.log("watch => state.a", state.a);
  }
);

watch(
  () => state.b.c,
  (cur, prev) => {
    console.log(cur, prev);
    console.log("watch => state.b.c", state.b.c);
  }
);
```

[源码戳这里查看](https://github.com/dnhyxc/sample-code/tree/master/proxy)

#### 数据劫持及依赖收集笔试题

分析如下代码，实现示例中所需功能：

index.html 页面渲染模板：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>依赖收集</title>
  </head>
  <body>
    <div id="app">
      <h1>{{title}}</h1>
      <p>{{content}}</p>
      <h1>{{title}}</h1>
      <p>{{content}}</p>
      <button @click="setTitle">设置标题</button>
      <button @click="setContent">设置内容</button>
      <button @click="reset">重置</button>
    </div>

    <script type="module" src="./index.js"></script>
  </body>
</html>
```

index.js 是 js 入口文件：

```js
import { createApp } from "./source/collect";
import { ref } from "./source/hooks";

createApp("#app", {
  refs: {
    title: ref("this is title"),
    content: ref("this is content"),
  },
  methods: {
    setTitle() {
      this.title.value = "这是标题";
    },
    setContent() {
      this.content.value = "这是内容";
    },
    reset() {
      this.title.$reset();
      this.content.$reset();
    },
  },
});
```

> 本题主要考点：vue Options API、vue Reactive API / Composition API、如何实现响应式（一对多依赖收集）、绑定事件处理函数如何解决 this 指向问题等。

source/collect 用于实现 createApp：

```js
import { bindEvent } from "./event";
import { createRefs } from "./hooks";
import { render } from "./render";

export function createApp(el, { refs, methods }) {
  const $el = document.querySelector(el);
  const allNodes = $el.querySelectorAll("*");

  const refSet = createRefs(refs, allNodes);
  console.log(refSet, "refSet");
  render(refSet);
  // 绑定事件时，对 this 指向进行重置，改为指向 refs
  bindEvent.apply(refSet, [allNodes, methods]);
}
```

source/ref.js 用于实现 Ref 类：

```js
import { update } from "./render";

export default class Ref {
  constructor(defaultValue) {
    this.deps = new Set();
    this._defalutValue = defaultValue;
    this._value = defaultValue;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    // 每当在更新数据的时候，触发视图的更新
    update(this);
  }

  $reset() {
    this.value = this._defalutValue;
  }
}
```

source/hooks.js 用于创建 refs 集合，同时进行依赖的收集，即针对每一个 ref 收集它所有对应的所有 dom 元素：

- 使用类实现 ref：

```js
import Ref from "./ref";

// 使用类实现
export function ref(defalutValue) {
  return new Ref(defalutValue);
}

const reg_var = /\{\{(.+?)\}\}/;

export function createRefs(refs, nodes) {
  nodes.forEach((el) => {
    if (reg_var.test(el.textContent)) {
      const refKey = el.textContent.match(reg_var)[1].trim();
      console.log(refKey, "refKey");
      refs[refKey].deps.add(el);
    }
  });

  return refs;
}
```

- 使用对象实现 ref：

```js
import { update } from "./render";

export function ref(defalutValue) {
  const refWrapper = {
    deps: new Set(),
    _value: defalutValue,
    _defalutValue: defalutValue,
    $reset() {
      this.value = this._defalutValue;
    },
  };

  Object.defineProperty(refWrapper, "value", {
    get() {
      return refWrapper._value;
    },
    set(newValue) {
      refWrapper._value = newValue;
      update(refWrapper);
    },
  });

  console.log(refWrapper, "refWrapper");

  return refWrapper;
}

const reg_var = /\{\{(.+?)\}\}/;

export function createRefs(refs, nodes) {
  nodes.forEach((el) => {
    if (reg_var.test(el.textContent)) {
      const refKey = el.textContent.match(reg_var)[1].trim();
      console.log(refKey, "refKey");
      refs[refKey].deps.add(el);
    }
  });

  return refs;
}
```

source/render.js 用于视图的渲染：

```js
export function render(refs) {
  for (const key in refs) {
    const ref = refs[key];
    _render(ref);
  }
}

function _render({ deps, value }) {
  deps.forEach((dep) => {
    dep.textContent = value;
  });
}

export function update({ deps, value }) {
  _render({ deps, value });
}
```

event.js 用于事件的绑定，即将 createApp 第二个参数（methods）中的所有事件逐个进行绑定：

```js
export function bindEvent(nodes, methods) {
  nodes.forEach((el) => {
    const handlerName = el.getAttribute("@click");

    if (handlerName) {
      el.addEventListener("click", methods[handlerName].bind(this), false);
    }
  });
}
```

[戳这里查看源码](https://github.com/dnhyxc/sample-code/tree/master/interview)
