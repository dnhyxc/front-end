## useRef 的作用

1. 获取 DOM 元素，用于操作 DOM。
2. 储存跨渲染周期的可变值。比如管理 `setTimeout`、`setInterval`，在实现秒表场景中使用。
3. 缓存上一次渲染的 props 或者 state。

## forwordRef 和 useImperativeHandle

forwardRef 将父组件中定义的 ref 传递到字组件中的某个元素上。

useImperativeHandle 用于在子组件中指定需要向父组件暴露的属性或方法。它接受三个参数，分别是：

1. 接受的父组件传递的 ref
2. 返回一个对象，这个对象会成为父组件 ref.current 的值
3. 依赖项

```js
useImperativeHandle(
	ref,
	() => ({
		focus: () => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		},
	}),
	[],
);
```

## useTransition 和 useDeferredValue

useTransition 用于标记哪些更新是低优先级的，通过这个标记可以告诉 React 这个操作可以放在后面进行操作。

```js
import { useState, useTransition } from "react";

function SearchPage() {
	const [isPending, startTransition] = useTransition();
	const [inputValue, setInputValue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleInputChange = (e) => {
		// 1. 高优先级更新：立即更新输入框的值
		setInputValue(e.target.value);

		// 2. 低优先级更新：用 startTransition 包裹
		startTransition(() => {
			setSearchQuery(e.target.value);
		});
	};

	return (
		<div>
			<input type="text" value={inputValue} onChange={handleInputChange} />
			{isPending && <div>Loading...</div>}
			<SearchResultList query={searchQuery} />
		</div>
	);
}
```

useDeferredValue 用于延迟更新一个值。它的作用与 useTransition 类似，但是与 useTransition 包裹一个更新函数不同的是，useDeferredValue 包裹的是一个值。

当组件重新渲染时，useDeferredValue 会先返回上一次更新的值，同时在后台进行一次低优先级的渲染，当后台渲染完成后，再更新到页面上。

使用方式：

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 500 });
```

输入搜索的使用案例：

```js
import { useState, useDeferredValue } from "react";

function SearchPage() {
	const [query, setQuery] = useState("");
	// 将 query 包装成一个延迟更新的值
	const deferredQuery = useDeferredValue(query);

	const handleInputChange = (e) => {
		setQuery(e.target.value);
	};

	// 通过比较原始值和延迟值，判断是否正在后台渲染
	const isStale = query !== deferredQuery;

	return (
		<div>
			<input type="text" value={query} onChange={handleInputChange} />
			<div style={{ opacity: isStale ? 0.5 : 1 }}>
				<SearchResultList query={deferredQuery} />
			</div>
		</div>
	);
}
```

使用 useTransition 和 useDeferredValue 的情况：

- useTransition 适合用于我们能控制其延迟更新的情况。

- useDeferredValue 适用于我们无法直接访问更新逻辑的情况，例如，当一个值作为 props 从父组件传递而来，或者来自一个我们无法修改的第三方 Hook 时，我们可以用 useDeferredValue 来“延迟”这个值，从而优化使用该值的慢渲染组件。

简单来说，useTransition 作用于“因”（更新操作），而 useDeferredValue 作用于“果”（产生的值）。

## 设置自定义 Hook 的原则

1. 必须使用 use 开头。
2. 单一原则，一个 hook 只做一件事。
3. 返回值或者方法，要注意通过 useMemo、useCallback 进行性能优化。
4. 要注意清理在其中产生的副作用。

## React Hooks 的两大核心原则

1. 调用顺序必须稳定：react hooks 内部可以想象成一个链表或者数组，其中要更新的状态和更新函数是一一对应的，顺序不一致，就会导致更新出错。
2. 依赖关系必须明确：通过依赖数组，可以精确控制副作用的执行时机，避免 bug 和性能问题。

## 虚拟 DOM 及其解决的问题

虚拟 DOM 本质上是一个轻量级的 JS 对象，它是真实 DOM 在内存中的一种抽象表示。

它同样是一棵树形结构，每个节点都对应着一个真实 DOM 节点，包含了该节点的所有属性，但与真实 DOM 不同的是：

- 它只是保存在内存中的一个 JS 对象，而不是渲染引擎里的。
- 操作成本极低：在内存中创建、对比、修改一个 JS 对象，速度要远远快于直接操作浏览器渲染引擎中的真实 DOM 对象。

操作虚拟 DOM 的核心就是 `diffing` 和 `Reconciliation`。当组件的状态（State）发生变化时，React 会启动一个称之为 “Reconciliation”（协调）的过程，这个过程的核心便是虚拟 DOM 的运作，大致可以分为这几个步骤，**触发更新、创建新树、对比差异、计算最小变更、批量更新真实 DOM**：

1. 当 `setState` 被调用，或者 `props` 变更时就会触发更新。
2. react 会根据最新的状态，在内存中创建一个新的虚拟 DOM 树，它代表的就是最终渲染到页面上的 DOM。
3. react 通过 diff 算法将本次最新的虚拟 DOM 与上一次渲染保留下来的旧虚拟 DOM 进行**逐层**比较。即：第一层跟第一层比，第二层跟第二层比，不会第一层同时对比第一第二层。
4. diff 算法的目标就是找出最小差异，它会识别哪些节点是新增的，哪些是被删除的，哪些仅仅只是属性或者内容发生了变化。
5. react 会将所有变更打包，一次性的更新到真实 DOM 上去。这一步是同步的，为了一致性。

虚拟 DOM 所解决的问题主要有三点：

1. 提升性能：通过 Diff 算法，减少了真实 DOM 的操作，同时将多次变更合并为一次，减少了页面的重绘重排。
2. 简化开发心智模型：让开发不必手动查询、监听、修改属性。
3. 实现跨平台兼容：虚拟 DOM 作为一层抽象，使得它不依赖渲染环境。能在不同的平台上运行。

## JSX

1. JSX 是一种语法扩展，为 `React.createElement()` 提供了一种更具可读性和表现力的声明式写法。
2. 它的最终产物是纯粹的 JS 对象，这是构成虚拟 DOM 的基础。
3. 它允许我们用 JS 的全部功能，比如：变量、函数、循环、条件语句等。
