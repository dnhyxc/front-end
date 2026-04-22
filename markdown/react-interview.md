1. 下面代码中，点击"+3”按钮后，age 的值是什么？
2. React Portals 有什么用？
3. react 和 react-dom 是什么关系？
4. React 中为 f 什么不直接使用 requestIdleCallback?
5. 为什么 react 需要 fiber 架构，而 Vue 却不需要？
6. 子组件是一个 Portal，发生点击事件能冒泡到父组件吗？
7. React 为什么要废弃 componentWillMount，componentWillReceiveProps、componentWillUpdate 这三个生命周期钩子？..
8. 说说 React render 方法的原理？在什么时候会被触发？
9. 说说 React 事件和原生事件的执行顺序
10. 说说对受控组件和非受控组件的理解，以及应用场景？
11. 你在 React 项目中是如何使用 Redux 的？项目结构是如何划分的？
12. 说说对 Redux 中间件的理解？常用的中间件有哪些？实现原理？
13. 说说你对 Redux 的理解？其工作原理？
14. 说说你对 immutable 的理解？如何应用在 react 项目中？
15. 说说 React Jsx 转换成真实 DOM 过程？
16. 说说你在 Reac 项目是如何捕关错误的？
17. 说说 React 服务端宣染怎么做？原理是什么？
18. ReactFiber 是如何实现更新过程可控？
19. Fiber 为什么是 React 性能的一个飞跃？
20. setState 是同步，还是异步的?
21. 简述下 React 的事件代理机制？
22. 简述下 React 的生命周期？每个生命周期都做了什么？
23. 为什么不能在循环、条件或嵌套函数中调用 Hooks？
24. 说说你对 useContext 的理解
25. 说说你对 useMemo 的理解
26. 说说你对自定义 hook 的理解
27. 如何让 useEffect 支持 async/await?
28. 我们应该在什么场景下使用 useMemo 和 useCallback？
29. 说说你对 ReactHook 的闭包陷阱的理解，有哪些解决方案？
30. React18 新特性
31. Reat 中，怎么实现父组件调用子组件中的方法？
32. 你常用的 React Hooks 有哪些？
33. 说说你对 useReducer 的理解
34. useMemo 和 useCallback 有什么区别?
35. 怎么在代码中判断一个 React 组件是 dass component 还是 function component?
36. useRef /ref /forwardsRef 的区别是什么?
37. useEffect 的第二个参数，传空数组和传依赖数组有什么区别
38. 如果在 useEffet 的第一个参数中 retum 了一个函数，那么第二个参数分别传空数组和传依赖数组，该函数分别是在什..
39. 讲讲 React.memo 和 JS 的 memorize 函数的区别
40. 怎么判断一个对象是否是 React 元素？
41. 说说对 React 中 Element,Component.Node、Instance 四个概念的理解
42. React 和 Vue 在技术层面有哪些区别？
43. 实现 useUpdate 方法，调用时强制组件重新渲染
44. taro 的实现原理是怎么样的？
45. taro 2.x 和 taro 3 最大区别是什么？
46. 单页应用如何提高加载速度？
47. React 中的 ref 有什么用？
48. react-router 里的标签和标签有什么区别？
49. 说说你对 React Router 的理解？常用的 Router 组件有哪些？
50. 说说 ReactRouter 有几种模式。以及实现原理？
51. 使用 useState(const[test, setTest]=useState([])时，为么连续调用 setTest({.test,newWalue})会出现值的丢..
52. 实现一个 useTimeout Hook
53. react 中怎么捕获异常？
54. 最大子序和
55. 说说 https 的握手过程
56. HTTP2 中，多路复用的原理是什么？
57. 说说你对”三次握手”、”四次挥手”的理解
58. 如何确保你的构造函数只能被 new 调用，而不能被普通调用？
59. 为什么推荐将静态资源放到 cdn 上？
60. 说说 React 事件和原生事件的执行顺序
61. Vue2.0 为什么不能检查数组的变化，该怎么解决？
62. 说说 Vue 页面渲染流程
63. 请简述 == 的机制
64. 怎么做移动端的样式适配？
65. 说说 sourcemap 的原理?
66. vue 中 computedOwatch 区别
67. 什么是 DNS 劫持？
68. ME 搂梯
69. 怎么实现图片懒载？
70. HTTP 报文结构是怎样的？
71. 如果使用 Vue3.0 实现一个 Modal，你会怎么进行设计？
72. js 中数组是如何在内存中存储的？
73. setTimeout 为什么不能保证能够及时执行？
74. 说说对 TypeScript 中命名空间与模块的理解？区别？
75. 说说对受控组件和非受控组件的理解，以及应用场景？
76. 你在 React 项目中是如何使用 Redux 的？项目结构是如何划分的？
77. 说说对 Redux 中间件的理解？常用的中间件有哪些？实现原理？
78. 说说你对 Redux 的理解？其工作原理？
79. 说说你对 immutable 的理解？如何应用在 react 项目中？
80. 说说 React Jsx 转换成真实 DOM 过程？
81. 说说你在 React 项目是如何捕获错误的？
82. 说说 React 服务端渲染怎么做？原理是什么？
83. 说说你对 typescript 的理解？与 javascript 的区别？

# React 与前端高级面试题详细解答全集

## 目录

- [React 核心机制](#react-核心机制)
- [Fiber 架构与性能](#fiber-架构与性能)
- [生命周期与组件](#生命周期与组件)
- [React Hooks 深度解析](#react-hooks-深度解析)
- [Redux 状态管理](#redux-状态管理)
- [React Router 路由](#react-router-路由)
- [React 工程化与原理](#react-工程化与原理)
- [Taro 框架](#taro-框架)
- [Vue 框架对比](#vue-框架对比)
- [计算机网络](#计算机网络)
- [JavaScript 基础与算法](#javascript-基础与算法)

---

## React 核心机制

### 2. React Portals 有什么用？

**作用：**
Portals 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方案。
**核心应用场景：**

1.  **溢出隐藏：** 父组件有 `overflow: hidden` 或 `z-index` 样式，导致子组件（如 Modal、Tooltip、Dropdown）被截断或遮挡。使用 Portal 可以将弹窗渲染到 `body` 下，突破容器限制。
2.  **统一管理：** 方便在全局层级管理浮层组件，避免复杂的 z-index 层叠上下文问题。

### 3. react 和 react-dom 是什么关系？

- **React：** 核心库，负责定义组件、生命周期、虚拟 DOM (Virtual DOM)、Diff 算法、Hooks 逻辑等。它是平台无关的。
- **React-DOM：** 是 React 在 Web 环境下的“渲染器”。它负责将 React 核心生成的虚拟 DOM 转换为真实的浏览器 DOM 节点，并处理 DOM 事件。
- **关系：** 这种分离设计使得 React 可以轻松移植到其他平台（如 React Native 渲染为移动端原生控件，React Three Fiber 渲染为 3D 对象）。

### 4. React 中为什么不直接使用 requestIdleCallback?

1.  **兼容性问题：** `requestIdleCallback` 是实验性 API，兼容性较差，尤其是 Safari 和 IE。
2.  **帧率限制：** 它受限于浏览器底层的调度策略，可能无法满足 React 对高优先级任务（如动画、用户输入）的快速响应需求。
3.  **替代方案：** React 团队自己实现了 Scheduler 包，利用 `MessageChannel` 和 `requestAnimationFrame` 模拟实现了类似但更高效的调度机制。

### 6. 子组件是一个 Portal，发生点击事件能冒泡到父组件吗？

**能。**
虽然 Portal 将节点渲染到了 DOM 树的其他位置，但在 **React 组件树** 中，该子组件仍然是父组件的后代。React 的事件委托机制是挂在根容器上的，不依赖于物理 DOM 结构，因此事件会按照 React 组件树的结构正常冒泡。

### 9 & 60. 说说 React 事件和原生事件的执行顺序？

**执行顺序：**

1.  **原生事件捕获阶段**（Native Capture）。
2.  **React 合成事件捕获阶段**（React Capture）。
3.  **原生事件冒泡阶段**（Native Bubble）。
4.  **React 合成事件冒泡阶段**（React Bubble）。

**注意：** 如果原生事件中使用了 `stopPropagation`，会阻止后续的原生和 React 事件传播；但在 React 事件中阻止冒泡，不会影响原生事件的捕获和冒泡（因为原生事件已经执行过了）。

### 21. 简述下 React 的事件代理机制？

React 并不会将事件绑定到真实 DOM，而是利用事件冒泡：

1.  所有事件冒泡到根容器（React 17 前是 document，后是 root 节点）。
2.  React 统一监听根容器。
3.  事件触发时，React 根据 target 找到对应 Fiber，模拟捕获和冒泡流程，执行合成事件。这样做减少了内存消耗，且能兼容不同浏览器。

### 40. 怎么判断一个对象是否是 React 元素？

利用 `React.isValidElement(object)` 方法。它通过检查对象是否包含 `$$typeof: Symbol(react.element)` 来判断。

### 41. 说说对 React 中 Element, Component, Node, Instance 四个概念的理解

- **Element：** 一个普通 JS 对象，描述了 DOM 节点或组件实例。它是不可变的。
- **Component：** 一个函数或类，接收 props 返回 Element。它是元素的“模具”。
- **Node：** 在 Fiber 架构中，Fiber 节点对应着一个 Element，包含了组件的状态、副作用等信息。
- **Instance：** 组件的实例。对于类组件，是 `this` 指向的对象；对于函数组件，没有实例，由 Fiber 节点充当实例的角色。

---

## Fiber 架构与性能

### 5. 为什么 react 需要 fiber 架构，而 Vue 却不需要？

**React 需要 Fiber 的原因：**
React 15 采用 Stack 架构，Diff 过程是同步递归的，一旦开始无法中断。如果组件树庞大，JS 执行会长时间阻塞主线程，导致页面卡顿。Fiber 将大的渲染任务拆解为小单元，实现了**任务的可中断、可恢复、可优先级调度**。

**Vue 不需要的原因：**
Vue 的响应式系统基于依赖收集，状态变更能精确知道哪些组件需要更新。Vue 的组件更新是细粒度的，通常不需要像 React 那样进行全量 Diff。且 Vue 的模板编译优化能跳过静态节点，渲染压力较小，同步更新在大多数场景下性能足够。

### 18. ReactFiber 是如何实现更新过程可控？

1.  **可中断：** Fiber 树的构建是基于循环的，React 会检查当前帧剩余时间，不够则暂停。
2.  **可恢复：** 暂停时保存进度，下次恢复继续。
3.  **优先级调度：** 任务带有优先级，高优先级任务（如输入）可打断低优先级任务（如渲染）。

### 19. Fiber 为什么是 React 性能的一个飞跃？

- **解决了主线程阻塞：** 将同步渲染改为异步可中断渲染，保证了高优先级任务的流畅性。
- **增量渲染：** 利用浏览器空闲时间，避免掉帧。
- **并发模式基础：** 为 React 18 的并发特性奠定了底层基础。

### 20. setState 是同步，还是异步的?

取决于执行上下文：

- **异步（批量更新）：** 在 React 合成事件、生命周期钩子中调用。
- **同步：** 在原生事件（`addEventListener`）、`setTimeout`、`Promise.then` 中调用。
- _React 18 引入 Automatic Batching，几乎所有场景都会自动批量更新，除非使用 `flushSync`。_

---

## 生命周期与组件

### 7. React 为什么要废弃 componentWillMount，componentWillReceiveProps、componentWillUpdate 这三个生命周期钩子？

主要原因是为了配合 **Fiber 架构**。
在 Fiber 架构下，Render 阶段（生命周期）可能被重复执行（因为任务可中断、可重启）。这三个生命周期属于 Render 阶段，如果开发者在其中执行副作用（如发请求、操作 DOM），可能会导致重复执行、性能浪费甚至无限循环。因此 React 将其标记为 `UNSAFE_`，并引入 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 作为替代。

### 8. 说说 React render 方法的原理？在什么时候会被触发？

**原理：**
Class 组件的 `render` 或 Function 组件的返回值会被调用，生成 React 元素树。React 会将其与旧的 Fiber 树进行 Diff 比较，计算出需要变更的最小操作。

**触发时机：**

1.  **组件自身 setState 调用**。
2.  **父组件重新渲染**（导致子组件 props 变化或未做优化）。
3.  **forceUpdate 调用**。
4.  **Hooks 中 dispatch 或 useState/setReducer 返回值变化**。

### 10 & 75. 说说对受控组件和非受控组件的理解，以及应用场景？

- **受控组件：**
  - **定义：** 表单元素的值由 React 的 `state` 控制，通过 `onChange` 更新。
  - **场景：** 需要实时校验、格式化输入、控制按钮禁用状态。
- **非受控组件：**
  - **定义：** 表单数据由 DOM 节点自身管理，使用 `ref` 获取值。
  - **场景：** 文件上传（`<input type="file">`）、集成非 React 代码、简单的表单无需频繁状态同步。

### 22. 简述下 React 的生命周期？每个生命周期都做了什么？

主要分为三个阶段：

1.  **挂载：**
    - `constructor`：初始化 state。
    - `static getDerivedStateFromProps`：从 props 派生 state。
    - `render`：渲染 UI。
    - `componentDidMount`：组件挂载完成，执行副作用（请求、订阅）。
2.  **更新：**
    - `getDerivedStateFromProps`。
    - `shouldComponentUpdate`：性能优化，决定是否更新。
    - `render`。
    - `getSnapshotBeforeUpdate`：获取更新前的 DOM 快照。
    - `componentDidUpdate`：DOM 更新完成。
3.  **卸载：**
    - `componentWillUnmount`：清理定时器、取消订阅。

---

## React Hooks 深度解析

### 23. 为什么不能在循环、条件或嵌套函数中调用 Hooks？

React 依赖 **调用顺序** 来将 Hook 的状态与组件对应起来。React 使用链表存储 Hook 状态。如果在条件语句中调用，顺序发生变化，会导致状态对应错乱。

### 24. 说说你对 useContext 的理解

用于函数组件中订阅 Context。它解决了 Prop Drilling 问题，允许组件直接获取祖先组件提供的上下文数据，而无需逐层传递 props。

### 25. 说说你对 useMemo 的理解

用于缓存计算结果。它接收一个函数和依赖数组，只有当依赖项变化时才重新计算值。常用于优化复杂计算或保持引用类型的稳定性。

### 26. 说说你对自定义 hook 的理解

自定义 Hook 是一个以 `use` 开头的函数，内部可以调用其他 Hooks。它用于将组件逻辑提取出来复用，而非复用 UI。

### 27. 如何让 useEffect 支持 async/await?

`useEffect` 回调不能返回 Promise。需在内部定义异步函数并调用：
