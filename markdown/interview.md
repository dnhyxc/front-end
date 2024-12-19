## 概念类

### vite 在开发环境和生产环境分别采用的是什么方式

#### 开发环境

在开发环境中，Vite 主要使用 原生的 ES 模块（ESM）和 即时热更新（HMR）来提升开发体验。

主要特点：

- 原生 ESM 支持：

  - Vite 利用浏览器原生支持的 ES 模块特性，直接通过浏览器请求模块，无需进行打包。

  - 只处理你实际使用的模块，当你修改一个文件时，Vite 只会重新加载修改过的模块，而不是重新构建整个应用。

- 即时热模块替换（HMR）：

  - Vite 支持非常快速的热模块替换（HMR），当你修改源代码时，Vite 会仅仅替换更新的部分，不会重新加载整个页面，确保开发时能获得接近即时的反馈。

- 基于 ESBuild 构建：

  - Vite 使用 ESBuild 来做开发环境中的快速编译。ESBuild 是用 Go 语言编写的，速度非常快，尤其是在处理 TypeScript、JSX 等文件时。

  - ESBuild 在开发环境中将源码转换为浏览器支持的 JavaScript（例如将 TypeScript 转换为 ES5 或 ES6），这比传统的 JavaScript 构建工具如 Babel 快得多。

#### 生产环境

在生产环境中，Vite 会进行 优化构建，主要的目标是将代码进行压缩、拆分、去除不必要的部分，以及确保更快的加载时间。

主要特点：

- 打包构建（使用 Rollup）：

  - Vite 在生产环境中使用 Rollup 作为打包工具。Rollup 是一个非常成熟的打包工具，提供了对 ES 模块的优质支持，能进行高效的模块合并、Tree Shaking（去除未使用的代码）以及代码分割。

  - Rollup 在生产环境中的配置比开发环境要复杂一些，可以支持许多优化功能，如动态导入、代码拆分、懒加载等。

- 代码优化：

  - 压缩代码：Vite 使用 Terser 或其他工具进行代码压缩，去除冗余的空格、注释等，以减小最终的文件大小。

  - 代码分割：根据需要进行按需加载，将 JavaScript 文件拆分成更小的块，只加载当前页面或模块所需要的部分，减少首次加载时间。

  - Tree Shaking：移除未使用的代码，减小包体积。

- 静态资源优化：

  - Vite 会对静态资源（如图片、字体等）进行处理，生成哈希值并进行指向优化。它会将静态资源通过 URL 重命名以便于缓存管理，并在构建时生成最终的生产环境配置。

#### 总结

在开发环境，Vite 利用原生 ESM 和 ESBuild 提供超快的热更新和即时反馈体验，无需打包，开发效率高。

在生产环境，Vite 则使用 Rollup 来打包和优化代码，进行压缩、代码分割等，生成最终的优化文件，以提高应用的加载性能和可维护性。

### vite 为什么开发和生产需要用两种不同的打包方式

**主要原因是两者的需求和目标不同**。开发环境注重的是**快速构建和调试**，而生产环境则需要优化代码以**提高性能和用户体验**。下面是一些关键的原因，解释为什么 Vite 会在生产环境和开发环境使用两种不同的打包方式。

#### 开发环境 - 快速构建与热更新

在开发环境中，Vite 重点关注开发体验，确保开发人员可以快速地编写和调试代码。为此，Vite 使用了以下几种技术和策略：

- 即时模块热更新（HMR）：Vite 利用浏览器支持的 ES 模块（ESM）特性，能够在不刷新页面的情况下只重新加载更改的模块，这大大加快了开发过程中的反馈速度。

- 快速启动：Vite 使用了原生 ES 模块导入，不像传统的打包工具（如 Webpack）需要先进行打包，这使得 Vite 在启动时非常快速。

- 开发时的服务：Vite 在开发模式下通常不会进行复杂的代码压缩或优化处理，而是直接将源代码通过本地开发服务器提供给浏览器，允许开发者实时查看更改效果。

这些特性确保了开发环境的快速响应和流畅体验，但也意味着开发模式的构建不会做过多的优化处理，以避免浪费时间在复杂的构建上。

#### 生产环境 - 代码优化与性能提升

生产环境的目标是生成高效、优化、且适合生产部署的代码。为了实现这一目标，Vite 会对代码进行以下处理：

- 代码压缩和混淆：在生产模式下，Vite 会使用 Terser（或类似工具）对 JavaScript 代码进行压缩，移除注释、空白符、无用的代码，并进行变量名混淆。这可以减小最终打包后的文件体积，提高加载速度。

- Tree Shaking：Vite 会利用现代 JavaScript 构建工具（如 Rollup）对模块进行 Tree Shaking，即移除未使用的代码，从而减少最终构建的文件体积。

- 按需加载（Code Splitting）：在生产环境中，Vite 会自动使用代码分割技术，将代码分割成多个小块（chunks），并根据需要按需加载。这可以减少首次加载时的文件体积，提高页面的加载速度。

- 资源优化：对于 CSS 和图片等资源，Vite 会进行优化，如压缩、合并文件，或者对图片进行适当的尺寸调整，以提升页面的加载和渲染速度。

- 环境变量：在生产环境中，Vite 会根据配置的环境变量（如 VITE_APP_ENV）将不同的环境变量注入到代码中，以确保生产环境与开发环境的行为一致性。例如，可以使用不同的 API 地址、开启/关闭调试模式等。

#### 性能与调试的平衡

开发环境：开发模式下，Vite 强调快速的构建和热更新，优化的是开发效率，关注的是能让开发者迅速看到代码变更的结果。因此，它不会进行代码压缩、混淆等操作，因为这些步骤会拖慢构建速度，并使得调试变得困难。

生产环境：生产模式下，Vite 强调代码的高效加载和优化。为了优化用户体验，它会进行各种性能优化，如压缩、代码分割、资源压缩等。这些优化措施会提高应用的加载速度和性能，**减少不必要的网络请求**。

#### 兼容性和兼容浏览器

开发环境中，Vite 会使用最新的浏览器特性（如 ES 模块），以便最大限度地利用现代浏览器的能力。而在生产环境中，Vite 会对输出的代码进行兼容性处理，确保支持较广泛的浏览器（如 IE 11 或更老的浏览器），可能会使用 Babel 来转换代码以支持旧版浏览器，或者使用 polyfill 来补充新特性的支持。

#### 开发与生产环境的构建模式区别

开发模式：通常不进行压缩或优化，构建速度快，能快速响应开发者的修改。

生产模式：进行压缩、代码分割、资源优化等操作，目的是减小最终输出的文件大小，提高加载性能。

#### 总结

Vite 在开发环境和生产环境使用两种不同的打包方式，主要是因为两者的目标和需求不同。开发环境强调速度和流畅的开发体验，生产环境则强调性能和用户体验的优化。通过这种分离，Vite 能够让开发者在开发过程中获得更快的反馈，同时生成适合生产环境的高效代码。

### vite 在生产环境下，为什么使用 rollup 打包，而不用 esbuild？

由于 Rollup 是一款 ES Module 打包器，从作用上来看，Rollup 与 Webpack 非常类似。不过相比于 Webpack，Rollup 要小巧的多，打包生成的文件更小。因为小巧，自然在这种特定的打包环境下，Rollup 的打包速度也要比 Webpack 快很多。

由于 vite 正是基于 es module 的特性实现的，所以使用 rollup 要更合适一些。

尽管 esbuild 的打包速度比 rollup 更快，但 Vite 目前的插件 API 与使用 esbuild 作为打包器并不兼容，rollup 插件 api 与基础建设更加完善，所以在生产环境 vite 使用 rollup 打包会更稳定一些。

### vite 和 webpack 的区别

#### 运行原理的区别

webpack 运行原理图：

![webpack.png](http://dnhyxc.cn/image/__ARTICLE_IMG__788f08fc8fa94055ffa1009116dc64f2_66efe5c8d80d0da837a3e600.webp)

由上图可以看出 webpack 会根据我们配置文件（webpack.config.js） 中的入口文件（entry），分析出项目项目所有依赖关系，然后打包成一个文件（bundle.js），交给浏览器去加载渲染。由此也可以看出项目越大，需要打包的东西越多，启动时间越长。

vite 运行原理图：

![vite.png](http://dnhyxc.cn/image/__ARTICLE_IMG__89bf8487e27137f1db8cace7a172db36_66efe5c8d80d0da837a3e600.webp)

vite 利用 ES module 这个特性，使用 vite 运行项目时，首先会用 esbuild 进行预构建，将所有模块转换为 es module，不需要对我们整个项目进行编译打包，而是在浏览器需要加载某个模块时，拦截浏览器发出的请求，根据请求进行按需编译，然后返回给浏览器。因此首次启动项目（冷启动）时，自然也就比 webpack 快很多了，并且项目大小对 vite 启动速度的影响也很小。

#### 构建方式的区别

webpack 是基于 nodejs 运行的，但 js 只能单线程运行，无法利用多核 CPU 的优势，当项目越来越大时，构建速度也就越来越慢了。

vite 预构建与按需编译的过程，都是使用 esbuild 完成的。而 esbuild 是用 go 语言编写的，可以充分利用多核 CPU 的优势，所以 vite 开发环境下的预构建与按需编译速度，都是非常快的。

同时 vite 充分利用了 http2 可以并发请求的优势，对项目资源进行了合理的拆分，访问项目时，同时加载多个模块，来提升项目访问速度。这也是 vite 速度快的一个主要原因。

#### 热更新的区别

模块热替换(hot module replacement - HMR)，该功能可以实现应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面，也就是我们常说的热更新。

webpack 项目中，每次修改文件，都会对整个项目重新进行打包，这对大项目来说，是非常不友好的。虽然 webpack 现在有了缓存机制，但还是无法从根本上解决这个问题。

vite 项目中，监听到文件变更后，会用 websocket 通知浏览器，重新发起新的请求，只对该模块进行重新编译，然后进行替换。

并且基于 es module 的特性，vite 利用浏览器的缓存策略，针对源码模块（我们自己写的代码）做了协商缓存处理，针对依赖模块（第三方库）做了强缓存处理，这样我们项目的访问的速度也就更快了。

#### 使用成本

如果我们使用 webpack 自己去搭建项目脚手架时，需要配置比较多的东西， 比如：跨域、代码压缩、代码分割、css 预处理器的代码转换、样式兼容性、vue/react 代码解析、图片压缩、代码热更新、es 降级、ts 转换等等，远不止这些。

概念和配置项太多，我们需要了解各种 loader、plugin 的使用，并且需要根据项目场景，对配置不断进行优化，心智负担太大。

所以就出现了一些基于 webpack 上层封装的脚手架，如：vue-cli、create-react-app、umi 等。

vite 对我们常用功能都做了内置，比如：css 预处理器、html 预处理器、hash 命名、异步加载、分包、压缩、HMR 等等，我们可以很轻松的通过配置项去配置。

并且 vite 官方也提供了一些官方模板、社区模板，我们可以快速地创建出一个带有最佳预设项目，不需要关心太多的配置项。

vite 的出现，降低了我们的学习成本、增加了开发体验，由此我们就可以把更多的时间放在业务开发上了。

### defer 和 async 的区别

一张图足以说明一切：

![async-defer.png](http://dnhyxc.cn/image/__ARTICLE_IMG__dfc932630028cb4519a20532185f09ed_66efe5c8d80d0da837a3e600.webp)

> 图出处：[https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)

`<script src="script.js">`：没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，即不等待后续载入的文档元素，读到就加载并执行。

`<script async src="script.js">`：有 async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。但是在执行 script.js 时，会暂停 html 的解析。

`<script defer src="myscript.js">`：有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。

### 如何避免重绘和重排

#### 什么是重绘和重排？

重排：当 DOM 的变化影响了元素的几何信息（DOM 对象的位置和尺寸大小），浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做重排。

重绘：当一个元素更改了非几何属性（e.g. 背景、文本或阴影），但没有改变布局，重新把元素外观绘制出来的过程，叫做重绘。

#### 浏览器的渲染队列

思考以下代码将会触发几次渲染？

```js
div.style.left = '10px';
div.style.top = '10px';
div.style.width = '20px';
div.style.height = '20px';
```

根据我们上文的定义，这段代码理论上会触发 4 次重排 + 重绘，因为每一次都改变了元素的几何属性。但实际上最后只触发了一次重排，这都得益于浏览器的渲染队列机制：即当我们修改了元素的几何属性，导致浏览器触发重排或重绘时。它会把该操作放进**渲染队列**，等到队列中的操作到了一定的数量或者到了一定的时间间隔时，浏览器就会批量执行这些操作。

以下代码又将会触发几次渲染呢？

```js
div.style.left = '10px';
console.log(div.offsetLeft);
div.style.top = '10px';
console.log(div.offsetTop);
div.style.width = '20px';
console.log(div.offsetWidth);
div.style.height = '20px';
console.log(div.offsetHeight);
```

这段代码会触发 4 次重排 + 重绘，因为在 `console` 中你请求的这几个样式信息，无论何时浏览器都会立即执行渲染队列的任务，即使该值与你操作中修改的值没关联。因为队列中，可能会有影响到这些值的操作，为了给我们最精确的值，浏览器会立即重排 + 重绘。

强制刷新队列的 style 样式请求有：

- offsetTop, offsetLeft, offsetWidth, offsetHeight。

- scrollTop, scrollLeft, scrollWidth, scrollHeight。

- clientTop, clientLeft, clientWidth, clientHeight。

- getComputedStyle(), 或者 IE 的 currentStyle。

所以我们在开发中，应该谨慎的使用这些 style 请求，注意上下文关系，避免一行代码一个重排，这对性能是个巨大的消耗。

#### 重排优化建议

1. 分离读写操作：

```js
div.style.left = '10px';
div.style.top = '10px';
div.style.width = '20px';
div.style.height = '20px';
console.log(div.offsetLeft);
console.log(div.offsetTop);
console.log(div.offsetWidth);
console.log(div.offsetHeight);
```

还是上面触发 4 次重排 + 重绘的代码，这次只触发了一次重排：在第一个 console 的时候，浏览器把之前上面四个写操作的渲染队列都给清空了。剩下的 console，因为渲染队列本来就是空的，所以并没有触发重排，仅仅拿值而已。

2. 样式集中改变：

```js
div.style.left = '10px';
div.style.top = '10px';
div.style.width = '20px';
div.style.height = '20px';
```

虽然现在大部分浏览器有渲染队列优化，不排除有些浏览器以及老版本的浏览器效率仍然低下。建议通过改变 class 或者 csstext 属性集中改变样式：

```js
// bad
var left = 10;
var top = 10;
el.style.left = left + 'px';
el.style.top = top + 'px';
// good
el.className += ' theclassname';
// good
el.style.cssText += '; left: ' + left + 'px; top: ' + top + 'px;';
```

3. 缓存布局信息：

```js
// bad 强制刷新 触发两次重排
div.style.left = div.offsetLeft + 1 + 'px';
div.style.top = div.offsetTop + 1 + 'px';
// good 缓存布局信息 相当于读写分离
var curLeft = div.offsetLeft;
var curTop = div.offsetTop;
div.style.left = curLeft + 1 + 'px';
div.style.top = curTop + 1 + 'px';
```

4. 离线改变 dom：

隐藏要操作的 dom 在要操作 dom 之前，通过 display 隐藏 dom ，当操作完成之后，才将元素的 display 属性为可见，因为不可见的元素不会触发重排和重绘。

```js
dom.display = 'none';
// 修改dom样式
dom.display = 'block';
```

通过使用 DocumentFragment 创建一个 dom 碎片，在它上面批量操作 dom，操作完成之后，再添加到文档中，这样只会触发一次重排。

复制节点，在副本上工作，然后替换它！

position 属性为 absolute 或 fixed，position 属性为 absolute 或 fixed 的元素，重排开销比较小，不用考虑它对其他元素的影响。

5. 优化动画：

可以把动画效果应用到 position 属性为 absolute 或 fixed 的元素上，这样对其他元素影响较小动画效果还应牺牲一些平滑，来换取速度，这中间的度自己衡量：比如实现一个动画，以 1 个像素为单位移动这样最平滑，但是 reflow 就会过于频繁，大量消耗 CPU 资源，如果以 3 个像素为单位移动则会好很多。

启用 GPU 加速此部分来自优化 CSS 重排重绘与浏览器性能 GPU（图像加速器）：GPU 硬件加速是指应用 GPU 的图形性能对浏览器中的一些图形操作交给 GPU 来完成，因为 GPU 是专门为处理图形而设计，所以它在速度和能耗上更有效率。GPU 加速通常包括以下几个部分：Canvas2D，布局合成, CSS3 转换（transitions），CSS3 3D 变换（transforms），WebGL 和视频(video)。

```js
/*
 * 根据上面的结论
 * 将 2d transform 换成 3d
 * 就可以强制开启 GPU 加速
 * 提高动画性能
 */
div {
  transform: translate3d(10px, 10px, 0);
}

/* 又或者使用 will-change 属性来创建新层 */
div {
   will-change: transform;
}
```

### Vue 和 React 的区别

参考：[Vue 和 React 的区别](https://juejin.cn/post/7238199999733088313)

### React 中点击一个按钮页面卡顿有哪些可能性

#### 重新渲染性能问题

**频繁的组件重新渲染**：每次点击按钮可能触发大量不必要的组件重新渲染，尤其是在父组件和子组件之间的状态传递不合理时。例如，如果每次点击按钮都会导致父组件重新渲染，而父组件又重新传递了状态给子组件。

优化方案：使用 React.memo 来避免不必要的子组件重新渲染，或者利用 useMemo 和 useCallback 来优化函数和计算值的缓存。

**大量的虚拟 DOM 更新**：React 使用虚拟 DOM 来优化 UI 更新，但是如果每次更新的内容过多，虚拟 DOM 比较的过程也会消耗大量时间。

优化方案：确保渲染的数据量尽量少，避免过多的复杂 DOM 操作，尽量减少不必要的 DOM 节点更新。

#### 异步操作阻塞主线程

**长时间的同步操作**：如果在点击按钮时执行了一个耗时的同步操作（如长时间的计算或大数据处理），这些操作会阻塞浏览器的主线程，从而导致 UI 卡顿。

优化方案：将长时间的操作移到 Web Worker 或 setTimeout / setInterval 等异步任务中，确保不会阻塞主线程。比如，利用 requestIdleCallback 来安排低优先级的任务。

**网络请求延迟**：如果按钮点击后会发起一个耗时的网络请求（如 API 请求），并且没有适当的 UI 优化，用户界面可能会出现卡顿，尤其是在等待网络响应时。

优化方案：通过显示加载指示器来优化用户体验。可以使用 React Suspense 和 React.lazy() 来延迟加载部分内容，避免卡顿。

#### 状态更新引发大量计算

**不合理的状态管理**：React 的状态更新是异步的，如果更新了大量的状态，React 可能会触发多次渲染，特别是在 useState 或 setState 中做了复杂的计算或更新。

优化方案：检查是否有不必要的状态更新。避免在每次点击时更新大量的状态。对于较复杂的状态，考虑将其分解成更小的、局部的状态。

**过度计算**：点击按钮时如果涉及到复杂的计算或数据处理，比如对大量数据进行排序、筛选、遍历等，也会导致页面卡顿。

优化方案：将计算放到 useMemo 或 useCallback 中进行缓存，避免每次渲染时都进行重复计算。

#### JavaScript 执行阻塞

**阻塞 JavaScript 代码**：React 中可能存在一些复杂的 JavaScript 操作，导致主线程被阻塞，无法及时处理渲染更新，造成 UI 卡顿。

优化方案：检查是否有长时间运行的 JavaScript 代码，考虑将计算分片（chunking）或使用异步操作来避免阻塞主线程。

#### CSS 渲染性能问题

**复杂的样式计算**：在点击按钮后，如果涉及到复杂的 CSS 动画、过渡或计算，可能会导致页面卡顿，特别是在浏览器的样式渲染和重绘过程中。

优化方案：避免在关键渲染路径上使用昂贵的 CSS 动画，尽量避免在高频率更新的元素上应用复杂的动画效果。如果需要动画，使用 requestAnimationFrame 来确保流畅度。

#### 页面布局问题

**页面布局重排（Reflow）**：每次按钮点击后，如果触发了大量的 DOM 变化，可能会导致浏览器重新计算布局（reflow），这会影响渲染的流畅度。

优化方案：尽量避免频繁的 DOM 操作和样式改变，尤其是对布局有影响的操作。使用 requestAnimationFrame 或 setTimeout 来分批次处理 DOM 更新，减少重排的频率。

#### 无效的渲染优化

**没有使用 key 属性**：在渲染列表或动态添加/删除元素时，如果没有使用合适的 key，React 可能会不合理地重新渲染整个列表。

优化方案：确保在列表渲染中使用合适的 key，这样 React 能高效地识别哪些元素需要更新，避免不必要的 DOM 操作。

#### 内存泄漏或资源浪费

**内存泄漏**：点击按钮可能导致组件状态或事件监听器泄漏，随着时间的推移，内存占用逐渐增大，最终导致卡顿。

优化方案：检查组件是否在卸载时正确清理了事件监听器和异步操作（如使用 useEffect 的清理函数）。避免过多的副作用积累。

#### React 内部的性能瓶颈

**React 版本问题**：某些老旧版本的 React 或者一些未优化的 React 插件可能在高频更新的情况下表现不佳。

优化方案：确保使用的是 React 的最新稳定版本，检查是否有 React 更新带来的性能提升，或者存在性能回归问题。

### 事件队列是 V8 引擎创建的还是浏览器创建的

浏览器中的事件队列（Event Queue）是由浏览器引擎创建和管理的。浏览器引擎包括了渲染引擎和 JavaScript 引擎（如 V8 引擎）。这两个引擎通常是紧密集成在一起的。

JavaScript 引擎（例如 V8 引擎）负责解释和执行 JavaScript 代码，包括处理同步和异步任务。当遇到异步任务（如定时器、事件监听器、网络请求等）时，JavaScript 引擎并不会立即执行这些任务，而是将这些任务交给浏览器引擎来处理。

浏览器引擎将异步任务添加到事件队列中。当主线程空闲时，它会从事件队列中取出一个事件，并将其交给 JavaScript 引擎执行相应的回调函数。

V8 引擎是一款用于执行 JavaScript 代码的引擎，它主要用于将 JavaScript 代码转换为机器可执行的指令。V8 引擎本身并不负责处理浏览器环境中的事件和异步任务。

浏览器作为宿主环境，在加载和渲染网页时会创建一个事件循环(Event Loop)来管理 JavaScript 代码的执行。事件循环负责接收和分发各种事件，例如用户交互、网络请求的完成、计时器的触发等。当这些事件发生时，浏览器会将相应的事件放入事件队列中。

事件队列是一种先进先出（FIFO）的数据结构，用于按顺序存储待处理的事件。JavaScript 引擎通过不断地从事件队列中提取事件，并执行相应的事件处理程序来处理这些事件。这样可以确保事件按照它们被添加到队列中的顺序进行处理，从而实现异步执行和事件驱动的编程模型。

总结起来，V8 引擎负责执行 JavaScript 代码，而浏览器负责创建和管理事件队列，以及在适当的时机将事件推送给 V8 引擎进行处理。

浏览器引擎包括了渲染引擎和 JavaScript 引擎（如 V8 引擎）。这两个引擎通常是紧密集成在一起的。

### 不同的任务是否有执行优先级？优先级是如何划分的？

不同的任务在事件队列中有不同的执行优先级。以下是一些常见任务的优先级划分：

1. 宏任务（Macrotasks）：宏任务包括用户交互事件（如点击、滚动）、计时器（setTimeout、setInterval）、网络请求等。宏任务通常有较低的优先级，会在微任务之后执行。

2. 微任务（Microtasks）：微任务包括 Promise 回调、MutationObserver 回调和队列被清空时触发的一些回调。微任务具有较高的优先级，在宏任务执行结束后，会优先执行微任务。

3. 动画帧回调（requestAnimationFrame）：该任务用于优化动画的渲染，通常会在每个浏览器绘制帧之前执行。

4. 渲染任务：渲染任务用于更新网页的布局和绘制，主要由浏览器引擎处理。它们通常具有最高的优先级，并在其他任务之前执行。

需要注意的是，虽然微任务在宏任务之前执行，但在单个任务执行过程中，微任务可能会被不断添加，而导致微任务的执行时间比较长，从而阻塞宏任务执行。因此，在编写代码时应注意避免出现过多且耗时的微任务，以免影响整体的任务执行顺序和性能。

总结：宏任务具有较低的优先级，微任务具有较高的优先级，动画帧回调和渲染任务具有最高的优先级。这种优先级划分确保了一致性和流畅性的用户体验，并提供了合适的异步编程模型。

### 一共有多少种事件队列，它们是如何协作的？

1. 宏任务队列（Macrotask Queue）：宏任务队列包含了主线程上的所有宏任务，如用户交互事件、定时器等。当宏任务被触发时，它们会被添加到宏任务队列中等待执行。

2. 微任务队列（Microtask Queue）：微任务队列包含了微任务，如 Promise 回调、MutationObserver 回调等。当微任务被触发时，它们会被添加到微任务队列中等待执行。

3. 渲染队列：渲染队列用于处理页面的渲染和绘制操作，它包含了需要更新页面布局和渲染的任务。

这些事件队列之间的协作方式如下：

1. 当主线程执行完当前的宏任务后，会检查微任务队列是否为空。如果微任务队列非空，主线程会依次执行微任务队列中的所有微任务，直到微任务队列为空。

2. 在执行微任务过程中，如果有新的微任务产生，会添加到微任务队列的末尾。这意味着微任务可能会被推迟到下一轮的事件循环中执行。

3. 在所有微任务执行完毕后，如果存在渲染任务，则会执行渲染队列中的任务，更新页面的布局和绘制。

4. 当微任务和渲染任务都执行完毕后，主线程会查看宏任务队列。如果宏任务队列非空，则取出下一个宏任务并执行。

通过这种事件队列的协作方式，浏览器能够合理地处理不同类型的任务，保持页面的响应性，并确保任务执行的顺序和优先级得到维护。这有助于提供良好的用户体验和避免阻塞主线程导致页面无响应。

### 宏任务有哪些，微任务有哪些？

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

### requestAnimationFrame 是宏任务还是微任务，还是两者都不是，它的执行时机受哪些因素影响？

requestAnimationFrame 是一个比较特殊的任务，既不是宏任务也不是微任务。

requestAnimationFrame 是一种用于执行动画效果的方法，它会在浏览器的重绘之前调用指定的回调函数。它的执行时机受到浏览器的渲染机制和刷新频率的影响。

具体来说，当调用 requestAnimationFrame 方法时，浏览器会在下一次重绘之前调用指定的回调函数。这意味着 requestAnimationFrame 的执行时机与浏览器的刷新频率有关，通常为每秒 60 次（60Hz），即每 16.7 毫秒触发一次。然而，浏览器对于 requestAnimationFrame 的执行时间并没有严格的规定，因此实际执行的间隔时间可能会有所不同。

另外，如果页面处于非激活状态（例如当前标签页不在前台或浏览器最小化），浏览器通常会降低刷新频率，以节省资源。这可能会导致 requestAnimationFrame 的执行间隔变得更长。

要注意的是，虽然 requestAnimationFrame 的执行时机不确定，但它会在每次重绘之前执行一次回调函数，这样可以确保动画的流畅性，并避免产生卡顿或掉帧的现象。

综上所述，requestAnimationFrame 既不是宏任务也不是微任务，它的执行时机受浏览器的渲染机制、刷新频率以及页面的激活状态等因素的影响。

### 异步任务如何保持执行上下文？

异步任务如何保持执行上下文取决于不同的机制和 API。以下是常见的几种异步任务的执行上下文保持方式：

1. 回调函数：在使用回调函数进行异步编程时，执行上下文是通过闭包来保持的。当定义回调函数时，它会捕获当前的执行上下文，包括变量和作用域链。当异步操作完成后，回调函数被调用，并在先前捕获的执行上下文中执行。

2. Promise：Promise 是一种处理异步操作的机制，它提供了一种更结构化的方式来处理异步任务。在 Promise 中，执行上下文是由 Promise 的状态管理。当创建一个 Promise 时，它会立即执行，并且会捕获当前的执行上下文。当异步操作完成时，Promise 的状态会改变，并且相关的回调函数（如 .then()、.catch()）会在之前的执行上下文中执行。

3. async/await：async/await 是 ECMAScript 2017 中引入的语法糖，用于更方便地处理异步操作。在 async 函数内部使用 await 关键字可以暂停函数的执行，直到异步操作完成。await 关键字会保持当前的执行上下文，并等待异步操作结果的返回。

无论使用哪种异步任务的机制，执行上下文都会被保持并在合适的时机恢复。这意味着异步任务可以访问之前的变量、函数和作用域链，保持了它们的上下文环境。这种方式使得异步编程更加灵活，并且可以确保异步任务能够正常引用和操作先前的上下文数据。

### 如何创建 10000 个节点，保持不卡顿？

1. 虚拟滚动：如果需要展示的节点较多，并且只有部分节点可见，可以考虑使用虚拟滚动技术。虚拟滚动只渲染当前可见区域的节点，随着滚动的进行，会动态地复用已存在的节点，并更新其内容。这种方式可以有效减少 DOM 节点数量，提高渲染性能。

2. 使用分页加载：将大量节点分批次加载，只加载当前页面需要展示的节点，而不是一次性加载所有节点。

3. 使用列表重用：只创建足够显示的节点，然后通过列表重用机制，当一个节点离开可见区域时，将其移出视图并重新用于展示新的节点。

4. 使用 Web Worker：将节点的创建和渲染工作放在 Web Worker 中进行，这样可以将计算密集型的操作在后台线程中执行，减少主线程的负荷，提高页面的响应性能。

5. 懒加载：只在节点进入视口时才进行创建和渲染，而不是一次性加载所有节点。这样可以降低初始加载时的负载，提高页面加载速度。

## 笔试类

### compose 函数

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
  console.log(cur, '<cur index>', index);

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

console.log(composeRes, 'composeRes', result); // 9 'composeRes' 9
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
console.log(middleFun1Res, 'middleFun1Res'); // 9

const middleFun2Res = middleFun2(sub(2));
console.log(middleFun2Res, 'middleFun2Res'); // 3

const composeReduxRes = composeRedux(div, mul, add, sub)(2);
console.log(composeReduxRes, 'composeReduxRes'); // 3
```

### pipe 函数

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

console.log(pipeRes, 'pipeRes', result); // 7 'pipeRes' 7
```

### 实现异步任务请求并发数

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
async function sleep(n, name = 'test') {
  return new Promise((resolve) => {
    console.log(n, name, 'start');
    setTimeout(() => {
      console.log(n, name, 'end-------------');
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
      () => sleep(1, '睡觉'),
      () => sleep(3, '刷视频'),
      () => sleep(2, '看书'),
      () => sleep(3.5, 'coding'),
      () => sleep(5, '健身'),
    ],
  });
  console.log('结束');
}

start();
```

### 实现盒子的碰撞检测

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>元素碰撞检测</title>
    <script type="module" src="./main.js"></script>
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
const boxs = document.querySelector('#container');

boxs.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(e) {
  const { target } = e;
  if (target.id.includes('box')) {
    target.style.zIndex = 1;
    target._x = e.clientX - target.offsetLeft;
    target._y = e.clientY - target.offsetTop;
    window.addEventListener('mousemove', onMouseMove, false);
    boxs.addEventListener('mouseup', onMouseUp, false);
  }
}

function onMouseUp(e) {
  window.removeEventListener('mousemove', onMouseMove, false);
  boxs.removeEventListener('onmouseup', onMouseUp, false);
  e.target.style.zIndex = 0;
}

function onMouseMove(e) {
  const { target } = e;
  const x = e.clientX - target._x;
  const y = e.clientY - target._y;

  target.style.left = x + 'px';
  target.style.top = y + 'px';

  const isCollision = collisionCheckWithMidpoint();
  console.log(isCollision, 'isCollision');
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
  const box1 = document.querySelector('#box1');
  const box2 = document.querySelector('#box2');
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
const boxs = document.querySelector('#container');

boxs.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(e) {
  const { target } = e;
  if (target.id.includes('box')) {
    target.style.zIndex = 1;
    target._x = e.clientX - target.offsetLeft;
    target._y = e.clientY - target.offsetTop;
    window.addEventListener('mousemove', onMouseMove, false);
    boxs.addEventListener('mouseup', onMouseUp, false);
  }
}

function onMouseUp(e) {
  window.removeEventListener('mousemove', onMouseMove, false);
  boxs.removeEventListener('onmouseup', onMouseUp, false);
  e.target.style.zIndex = 0;
}

function onMouseMove(e) {
  const { target } = e;
  const x = e.clientX - target._x;
  const y = e.clientY - target._y;

  target.style.left = x + 'px';
  target.style.top = y + 'px';

  const isCollision = collisionCheckWithMidpoint();
  console.log(isCollision, 'isCollision');
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
  const box1 = document.querySelector('#box1');
  const box2 = document.querySelector('#box2');
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

### 实现一个深拷贝

实现方式一：

```js
function deepClone(origin, target) {
  var toStr = Object.prototype.toString;
  var arrType = '[object Array]';
  var type = toStr.call(origin) === arrType ? [] : {};
  var tar = target || type;

  for (var k in origin) {
    if (origin.hasOwnProperty(k)) {
      if (typeof origin[k] === 'object' && origin[k] !== null) {
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
  name: 'dnhyxc',
  info: {
    age: 18,
    hobby: ['basketball', 'coding', 'reading'],
  },
};

const testArr = [0, 1, [2, 3], 4, [5, 6, 7, [8, 9, 10]]];

const cloneObj = deepClone(testObj);
const cloneArr = deepClone(testArr);

cloneObj.info.age = 20;

console.log(cloneObj, 'cloneObj');
console.log(testObj, 'testObj');

testArr[2] = [22, 33];

console.log(cloneArr, 'cloneArr');
console.log(testArr, 'testArr');
```

实现方式二：

```js
const testObj = {
  name: 'dnhyxc',
  info: {
    age: 18,
    hobby: ['basketball', 'coding', 'reading'],
  },
};

const testArr = [0, 1, [2, 3], 4, [5, 6, 7, [8, 9, 10]]];

function deepCloneWithWeekMap(origin, hashMap = new WeakMap()) {
  // 说明是基本数据类型
  if (origin === undefined || typeof origin !== 'object') {
    return origin;
  }

  if (origin instanceof Date) {
    return new Date(origin);
  }

  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }

  // 判断是否已经拷贝过，防止出现死循环
  const hashKey = hashMap.get(origin);

  if (hashKey) return hashKey;

  const target = new origin.constructor();

  hashMap.set(origin, target);

  for (let k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = deepCloneWithWeekMap(origin[k], hashMap);
    }
  }

  return target;
}

let test1 = {};
let test2 = {};

test2.test1 = test1;
test1.test2 = test2;

console.log(deepCloneWithWeekMap(test2));

const cloneObjWithWeekMap = deepCloneWithWeekMap(testObj);
const cloneArrWithWeekMap = deepCloneWithWeekMap(testArr);

cloneObjWithWeekMap.info.age = 20;

console.log(cloneObjWithWeekMap, 'cloneObjWithWeekMap');
console.log(testObj, 'testObj');

cloneArrWithWeekMap[2] = [222, 333];

console.log(cloneArrWithWeekMap, 'cloneArrWithWeekMap');
console.log(testArr, 'testArr');
```

### Vue 面试相关

### 实现 reactive

source/reactive.js 文件主要用于实现数据的劫持：

```js
import Dep from './dep';

const dep = new Dep();

export const reactive = (data) => {
  return new Proxy(data, {
    get(target, key) {
      const value = Reflect.get(target, key);
      // 收集依赖
      dep.collect(target, key);
      return value !== null && typeof value === 'object'
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
import ComputedRef from './computedRef';
import Dep from './dep';

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
  Object.defineProperty(callback, 'computedRef', {
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

source/main.js 用于统一导出 reactive, watchEffect, watch, computed：

```js
import { reactive } from './reactive';
import { watchEffect, watch, computed } from './effect';

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
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

在 main.js 中使用实现的 reactive, watchEffect, watch, computed 这些方法：

```js
import { reactive, watchEffect, watch, computed } from './source';

const btnA = document.querySelector('#aBtn');
const btnB = document.querySelector('#bBtn');

const state = reactive({
  a: 1,
  b: { c: 2 },
});

const res = computed(() => state.a + state.b.c);

btnA.addEventListener(
  'click',
  () => {
    state.a = 100;
    console.log(res.value, 'res');
  },
  false
);

btnB.addEventListener(
  'click',
  () => {
    state.b.c = 200;
    console.log(res.value, 'res');
  },
  false
);

watchEffect(() => {
  console.log('watchEffect => state.a', state.a);
});

watchEffect(() => {
  console.log('watchEffect => state.b.c', state.b.c);
});

watch(
  () => state.a,
  (cur, prev) => {
    console.log(cur, prev);
    console.log('watch => state.a', state.a);
  }
);

watch(
  () => state.b.c,
  (cur, prev) => {
    console.log(cur, prev);
    console.log('watch => state.b.c', state.b.c);
  }
);
```

[源码戳这里查看](https://github.com/dnhyxc/sample-code/tree/master/proxy)

### 数据劫持及依赖收集笔试题

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

    <script type="module" src="./main.js"></script>
  </body>
</html>
```

main.js 是 js 入口文件：

```js
import { createApp } from './source/collect';
import { ref } from './source/hooks';

createApp('#app', {
  refs: {
    title: ref('this is title'),
    content: ref('this is content'),
  },
  methods: {
    setTitle() {
      this.title.value = '这是标题';
    },
    setContent() {
      this.content.value = '这是内容';
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
import { bindEvent } from './event';
import { createRefs } from './hooks';
import { render } from './render';

export function createApp(el, { refs, methods }) {
  const $el = document.querySelector(el);
  const allNodes = $el.querySelectorAll('*');

  const refSet = createRefs(refs, allNodes);
  console.log(refSet, 'refSet');
  render(refSet);
  // 绑定事件时，对 this 指向进行重置，改为指向 refs
  bindEvent.apply(refSet, [allNodes, methods]);
}
```

source/ref.js 用于实现 Ref 类：

```js
import { update } from './render';

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
import Ref from './ref';

// 使用类实现
export function ref(defalutValue) {
  return new Ref(defalutValue);
}

const reg_var = /\{\{(.+?)\}\}/;

export function createRefs(refs, nodes) {
  nodes.forEach((el) => {
    if (reg_var.test(el.textContent)) {
      const refKey = el.textContent.match(reg_var)[1].trim();
      console.log(refKey, 'refKey');
      refs[refKey].deps.add(el);
    }
  });

  return refs;
}
```

- 使用对象实现 ref：

```js
import { update } from './render';

export function ref(defalutValue) {
  const refWrapper = {
    deps: new Set(),
    _value: defalutValue,
    _defalutValue: defalutValue,
    $reset() {
      this.value = this._defalutValue;
    },
  };

  Object.defineProperty(refWrapper, 'value', {
    get() {
      return refWrapper._value;
    },
    set(newValue) {
      refWrapper._value = newValue;
      update(refWrapper);
    },
  });

  console.log(refWrapper, 'refWrapper');

  return refWrapper;
}

const reg_var = /\{\{(.+?)\}\}/;

export function createRefs(refs, nodes) {
  nodes.forEach((el) => {
    if (reg_var.test(el.textContent)) {
      const refKey = el.textContent.match(reg_var)[1].trim();
      console.log(refKey, 'refKey');
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
    const handlerName = el.getAttribute('@click');

    if (handlerName) {
      el.addEventListener('click', methods[handlerName].bind(this), false);
    }
  });
}
```

[戳这里查看源码](https://github.com/dnhyxc/sample-code/tree/master/interview)

## 参考资料

[https://blog.csdn.net/qq_16546829/article/details/138318658](https://blog.csdn.net/qq_16546829/article/details/138318658)
