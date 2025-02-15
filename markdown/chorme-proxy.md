## 原来浏览器资源代理插件是这么实现的

本文主要介绍了浏览器资源代理插件的具体实现原理，及实现资源代理的相关浏览器 API，同时也详细介绍了如何一步一步的实现浏览器资源代理插件。

### 浏览器资源代理插件的作用

通常在开发过程中，我们需要调试线上的资源时，往往都比较麻烦，因为线上的资源都被打包压缩过了，不太容易找到对应的代码位置。同时如果想要更改线上的资源进行调试时，更是麻烦。

那么我们能不能将本地的跑起来的 js 资源代理到线上进行调试呢？这样不就完美的解决了线上代码不容易调试的问题吗？答案是可以的。

桌面端，通常我们可以通过阿里开源的 [lightProxy](https://github.com/alibaba/lightproxy) 这个应用实现这个能力。

浏览器插件方面，通常可以使用 [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega) 这个插件实现。

以上这两个工具想必大家都并不太陌生，它们具体的使用方式，网上都有一大堆的教程，大家如果有疑问的话，可以自行查阅。

那如果我们自己来实现一个浏览器代理插件要怎么做呢？且看我娓娓道来。

### 浏览器代理插件的实现原理

chrome 代理插件实现的主要原理其实就是基于 `chrome` 提供的 `declarativeNetRequest` 这个 API 来实现的。

[declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest?hl=zh-cn) API 允许开发者声明性地管理网络请求的拦截、修改和阻止等操作。你可以通过规则来控制网络请求的行为，而无需直接监听每个请求。这种声明式的处理方式在大规模拦截和修改请求时尤其有效。具体功能有：

- 拦截请求：拦截指定的网络请求，阻止它们继续执行。

- 修改请求：修改请求的 URL、请求头等内容。

- 重定向请求：将网络请求重定向到另一个 URL。

- 允许或拒绝请求：根据特定的规则允许或拒绝请求。

### declarativeNetRequest 方法说明

- updateDynamicRules：更新动态规则，添加、修改或删除现有规则。

  - addRules：动态添加规则。

- getDynamicRules：获取当前的动态规则。

- getAvailableStaticRules：获取可用的静态规则（通过扩展声明的静态规则）。

### 规则结构参数说明

**id**：规则的唯一标识符。每个规则的 ID 必须是正整数。

**priority**：规则的优先级。数字越大优先级越高。

**action**：规则触发时的动作，是一个对象类型，包括 block（拦截请求）、redirect（重定向请求）、modifyHeaders（修改请求头）、allow（允许请求）、upgradeScheme（升级请求）、allowAllRequests（允许所有请求）。

- 当 type 为 `redirect` 时，可以设置 `redirect` 参数，用于设置重定向。具体如下：

```js
action: {
  type: 'redirect',
  redirect: {
    url: 'https://example.com', // 需要重定向到的 url
  },
}
```

- 当 type 为 `modifyHeaders` 时，可以设置 `requestHeaders` 及 `responseHeaders` 参数，用于修改请求头或者响应头如下：

```js
// 设置请求头
action: {
  type: "modifyHeaders",  // 修改请求头
  requestHeaders: [{
    header: "User-Agent",
    operation: "set",
    value: "MyCustomUserAgent"  // 修改 User-Agent 为自定义值
  }]
},

// 设置响应头
action: {
  type: "modifyHeaders",
  responseHeaders: [
    {
      header: "Content-Security-Policy",
      operation: "set",
      value: "default-src 'self'"  // 覆盖CSP策略
    }
  ]
},
```

**condition**：定义规则匹配的条件。条件包括 URL 过滤器、请求类型等，常用参数有：

- urlFilter：字符串类型，指定一个 URL 过滤器，用于匹配请求的 URL。可以使用通配符（\*）来匹配任意部分。

```js
urlFilter: "*://*.example.com/*"; // 匹配所有以 example.com 为域名的请求
```

- resourceTypes：数组类型，指定请求的资源类型，决定规则是否应用于该类型的请求。可以指定多个类型，常见类型有：

  - "main_frame"：主框架请求（即网页的主页面）。

  - "sub_frame"：子框架请求（嵌套的页面或 iframe）。

  - "script"：脚本资源（例如 JavaScript 文件）。

  - "image"：图片资源。

  - "stylesheet"：样式表资源。

  - "object"：对象资源（例如 Flash 插件）。

  - "xmlhttprequest"：XMLHttpRequest（AJAX 请求）。

  - "font"：字体资源。

  - "media"：音视频资源。

  - "manifest"：清单资源（通常是 Web 应用的清单文件）。

```js
resourceTypes: ["main_frame", "script"]; // 仅匹配主框架请求和脚本请求
```

- requestMethods：数组类型，指定请求方法，只有匹配的请求方法才会触发规则。可以指定一个或多个 HTTP 请求方法。常见值有：

  - "GET"：GET 请求。

  - "POST"：POST 请求。

  - "PUT"：PUT 请求。

  - "DELETE"：DELETE 请求。

  - "PATCH"：PATCH 请求。

  - "OPTIONS"：OPTIONS 请求。

```js
requestMethods: ["GET", "POST"]; // 仅匹配 GET 和 POST 请求
```

- domains：数组类型，指定请求的域名。匹配请求的域名时，可以指定多个域名或使用通配符进行匹配。

```js
domains: ["example.com", "test.com"]; // 匹配来自 example.com 和 test.com 域的请求
```

- origin：字符串类型，指定请求的源。可以与 urlFilter 配合使用来进一步限定规则应用的来源。

```js
origin: "https://www.example.com"; // 匹配源自 https://www.example.com 的请求
```

- requestHeaders：对象类型，指定请求头条件。可以对请求头进行匹配或限制，只有请求头满足指定条件时，规则才会生效。

```js
requestHeaders: {
  "User-Agent": "Mozilla/5.0"  // 仅匹配 User-Agent 为 "Mozilla/5.0" 的请求
}
```

- excludeDomains：数组类型，指定要排除的域名，匹配时排除这些域的请求。它与 domains 结合使用时非常有用。

```js
excludeDomains: ["ads.example.com"]; // 排除 ads.example.com 域的请求
```

- excludeUrls：字符串类型，指定排除的 URL 模式，用于排除匹配某些特定 URL 模式的请求。

```js
excludeUrls: "*://*.example.com/ads/*"; // 排除所有指向 example.com/ads 的请求
```

### 具体使用示例

#### 阻止请求（block）

```js
chrome.declarativeNetRequest.updateDynamicRules({
	addRules: [
		{
			id: 1,
			priority: 1,
			action: {
				type: "block", // 阻止请求
			},
			condition: {
				urlFilter: "*://example.com/*", // 阻止所有指向 example.com 的请求
				resourceTypes: ["main_frame"], // 仅拦截主框架请求
			},
		},
	],
});
```

- 多条件匹配：

```js
chrome.declarativeNetRequest.updateDynamicRules({
	addRules: [
		{
			id: 4,
			priority: 1,
			action: {
				type: "block", // 阻止请求
			},
			condition: {
				urlFilter: "*://*.example.com/*", // 匹配所有以 example.com 为域名的请求
				requestMethods: ["GET", "POST"], // 匹配 GET 和 POST 请求
				resourceTypes: ["script"], // 仅匹配脚本资源类型
			},
		},
	],
});
```

#### 重定向请求（redirect）

```js
chrome.declarativeNetRequest.updateDynamicRules({
	addRules: [
		{
			id: 2,
			priority: 1,
			action: {
				type: "redirect", // 重定向请求
				redirect: {
					url: "https://new-website.com", // 重定向到新的 URL
				},
			},
			condition: {
				urlFilter: "*://old-website.com/*", // 重定向所有指向 old-website.com 的请求
				resourceTypes: ["main_frame"], // 仅拦截主框架请求
			},
		},
	],
});
```

#### 修改请求头（modifyHeaders）

```js
chrome.declarativeNetRequest.updateDynamicRules({
	addRules: [
		{
			id: 3,
			priority: 1,
			action: {
				type: "modifyHeaders", // 修改请求头
				requestHeaders: [
					{
						header: "User-Agent",
						operation: "set",
						value: "MyCustomUserAgent", // 修改 User-Agent 为自定义值
					},
				],
			},
			condition: {
				urlFilter: "*://example.com/*", // 仅匹配 example.com 的请求
				resourceTypes: ["main_frame"], // 仅拦截主框架请求
			},
		},
	],
});
```

#### 删除规则（removeRules）

```js
chrome.declarativeNetRequest.updateDynamicRules({
	removeRules: [1], // 删除 ID 为 1 的规则
});
```

了解了 `declarativeNetRequest` API 之后，接下来就正式进入插件的具体实现过程了。

### 浏览器插件的构成

要实现一个 chrome 浏览器插件，至少需要具备一下几个文件：

1. manifest.json 文件：manifest.json 是每个 Chrome 扩展的核心文件，它定义了扩展的基础信息、权限、功能和其他配置。

```js
{
  // 指明该扩展所使用的清单文件版本。对于大多数现代浏览器扩展，manifest_version 通常为 3（意味着这是一个 manifest V3 格式的扩展）。
  "manifest_version": 3,
  // 指定扩展的名称，用户在浏览器中看到的扩展名字。
  "name": "Dnhyxc Proxy",
  // 指定扩展的版本号，浏览器会使用该字段来识别更新。
  "version": "1.0",
  // 描述扩展的功能，用户在浏览器的扩展管理页面会看到此信息。
  "description": "浏览器代理插件",
  // 该字段声明了扩展所需的权限，扩展可以通过这些权限访问浏览器的特定功能。
  "permissions": [
    // 允许扩展声明网络请求的规则，拦截和修改请求。
    "declarativeNetRequest",
    // 允许扩展访问和处理所有主机的网络请求。
    "declarativeNetRequestWithHostAccess",
    // 允许扩展访问浏览器的本地存储（例如用于保存设置或缓存数据）。
    "storage"
  ],
  // 指定扩展访问的域名范围。这里使用了 <all_urls>，表示扩展可以访问所有的 URL（即任何网站）。
  "host_permissions": ["<all_urls>"],
  // 定义扩展的后台脚本。在 Manifest V3 中，后台脚本使用 service_worker 来实现，而不再是传统的后台页面。
  "background": {
    "service_worker": "background.js"
  },
  // 定义扩展的浏览器工具栏按钮的行为和外观。
  "action": {
    // 指定在点击扩展图标时显示的弹出页面文件 popup.html。
    "default_popup": "popup.html",
    // 指定扩展图标的不同尺寸（分别为 16x16、32x32、48x48 和 128x128）。这些图标会根据浏览器界面的不同需要使用不同尺寸的图标。
    "default_icon": {
      "16": "16.png",
      "32": "32.png",
      "48": "48.png",
      "128": "128.png"
    }
  },
  // 指定扩展图标的不同尺寸，这些图标会出现在浏览器的扩展管理页面或工具栏等位置。
  "icons": {
    "16": "16.png",
    "32": "32.png",
    "48": "48.png",
    "128": "128.png"
  }
}
```

2. background.js：这个脚本在浏览器生命周期内持续运行，通常用于处理事件监听、管理扩展的状态或进行其他后台任务。

```js
// 当扩展首次安装或更新时，这个事件会被触发。
chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed");
});

// 当 chrome 扩展的本地存储（chrome.storage）发生变化时，这个事件会被触发。
chrome.storage.onChanged.addListener(() => {
	console.log("storage onChanged");
});
```

3. popup.html：如果扩展有用户界面，通常会使用弹出窗口（Popup）。popup.html 定义了该窗口的 HTML 结构。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Popup</title>
		<style>
			body {
				width: 200px;
				height: 150px;
			}
			button {
				width: 100%;
				height: 50px;
			}
		</style>
	</head>
	<body>
		<button id="changeColor">Change Background Color</button>
		<script src="popup.js"></script>
	</body>
</html>
```

3. popup.js：导入到 popup.html 文件中，负责处理弹出页面中的事件或交互逻辑。

```js
document.getElementById("changeColor").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.executeScript(tabs[0].id, {
			code: 'document.body.style.backgroundColor = "lightgreen";',
		});
	});
});
```

如果 popup.js 需要与 background.js 进行交互时，可以通过 `chrome.runtime.sendMessage` 实现：

- popup.js

```js
chrome.runtime.sendMessage({ message: "changeColor" });
```

- background.js

```js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "changeColor") {
		// 执行相应的任务，比如改变背景色
	}
});
```

4. options.html 和 options.js（可选）：如果你的扩展需要用户设置或配置，你可以创建一个选项页面。例如，options.html 用于用户配置，options.js 用于处理用户输入。

- options.html

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Extension Options</title>
	</head>
	<body>
		<h1>Settings</h1>
		<label for="color">Choose background color:</label>
		<input type="color" id="color" name="color" />
		<script src="options.js"></script>
	</body>
</html>
```

- options.js

```js
document.getElementById("color").addEventListener("input", (event) => {
	chrome.storage.sync.set({ color: event.target.value });
});
```

### 最终实现的网络代理插件介绍

下图就是最终实现的网络代理插件弹出界面：

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__7c4dbf5faecc956322cc9d32a4e40318_66efe5c8d80d0da837a3e600.webp)

由上图插件弹出窗口可以看出，通过添加需要被代理的目标资源及要代理到的代理资源，可以添加代理的规则，该插件支持同时代理多条规则。同时支持一键开启及一键关闭所有代理规则。

假设需要将 `https://www.baidu.com` 代理到本地的 `https://localhost:8090/index.js` js 资源，或者项目远程 js 资源 `https://moke.cn/index.js` 代理到本地的启动项目的 js 资源 `https://localhost:8090/index.js`，又或者将 `https://www.zhihu.com` 代理到 `https://juejin.cn`，那么目标资源分别就是 `https://www.baidu.com`、`https://moke.cn/index.js`、`https://www.zhihu.com`。代理资源分别就是 `https://localhost:8090/index.js`、`https://localhost:8090/index.js`、`https://localhost:8090/index.js`。

当添加完上述规则之后，就会自动开启对应资源的代理，如当你访问 `https://www.baidu.com` 时，加载的就不是原来百度的资源了，而是本地启动的 `https://localhost:8090/index.js` 资源：

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__3d95c3efa1eaf194ed78823aa948ad48_66efe5c8d80d0da837a3e600.webp)

由上图就可以看出，访问 `https://www.baidu.com` 时，资源已经成功的代理到了本地启动项目的 `https://localhost:8090/index.js`。

再比如开启 `https://www.zhihu.com` 代理到 `https://juejin.cn` 的规则时，当你访问知乎时，就会自动重定向到掘金：

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__afe87a5494fc75f71a5eacb6351e77c5_66efe5c8d80d0da837a3e600.webp)

### 网络代理插件的具体实现

1. 配置 `manifest.json`，因为我们需要更改网络请求，因此，必须要在 `permissions` 中开启 `declarativeNetRequest`、`declarativeNetRequestWithHostAccess` 的权限，同时我们还需要使用浏览器存储，因此还需要设置 `storage` 的的权限。具体配置如下：

```js
{
  // 指明该扩展所使用的清单文件版本。对于大多数现代浏览器扩展，manifest_version 通常为 3（意味着这是一个 manifest V3 格式的扩展）。
  "manifest_version": 3,
  // 指定扩展的名称，用户在浏览器中看到的扩展名字。
  "name": "Dnhyxc Proxy",
  // 指定扩展的版本号，浏览器会使用该字段来识别更新。
  "version": "1.0",
  // 描述扩展的功能，用户在浏览器的扩展管理页面会看到此信息。
  "description": "浏览器代理插件",
  // 该字段声明了扩展所需的权限，扩展可以通过这些权限访问浏览器的特定功能。
  "permissions": [
    // 允许扩展声明网络请求的规则，拦截和修改请求。
    "declarativeNetRequest",
    // 允许扩展访问和处理所有主机的网络请求。
    "declarativeNetRequestWithHostAccess",
    // 允许扩展访问浏览器的本地存储（例如用于保存设置或缓存数据）。
    "storage"
  ],
  // 指定扩展访问的域名范围。这里使用了 <all_urls>，表示扩展可以访问所有的 URL（即任何网站）。
  "host_permissions": ["<all_urls>"],
  // 定义扩展的后台脚本。在 Manifest V3 中，后台脚本使用 service_worker 来实现，而不再是传统的后台页面。
  "background": {
    "service_worker": "background.js"
  },
  // 定义扩展的浏览器工具栏按钮的行为和外观。
  "action": {
    // 指定在点击扩展图标时显示的弹出页面文件 popup.html。
    "default_popup": "popup.html",
    // 指定扩展图标的不同尺寸（分别为 16x16、32x32、48x48 和 128x128）。这些图标会根据浏览器界面的不同需要使用不同尺寸的图标。
    "default_icon": {
      "16": "16.png",
      "32": "32.png",
      "48": "48.png",
      "128": "128.png"
    }
  },
  // 指定扩展图标的不同尺寸，这些图标会出现在浏览器的扩展管理页面或工具栏等位置。
  "icons": {
    "16": "16.png",
    "32": "32.png",
    "48": "48.png",
    "128": "128.png"
  }
}
```

2. 实现插件弹出界面交互：

由于本人是通过 Vite + Vue3 搭建的应用，因此，弹出界面是通过 Vue 实现的，这样更方便功能的实现及最终打包。如果不想通过 Vue 实现，也直接可以通过 `popup.html` 原生 js 实现。

```html
<template>
	<div class="wrap">
		<div class="add">
			<div class="title">
				<img src="/public/128.png" alt="icon" class="icon" />
				Dnhyxc Proxy
			</div>
			<el-form
				ref="formRef"
				style="max-width: 600px"
				label-position="top"
				:model="dynamicValidateForm"
			>
				<el-form-item
					prop="urlFilter"
					label="目标资源"
					:rules="[
						{
							required: true,
							message: '请输入目标资源',
							trigger: 'blur',
						},
					]"
				>
					<el-input
						v-model="dynamicValidateForm.urlFilter"
						placeholder="请输入目标资源"
					/>
				</el-form-item>
				<el-form-item
					prop="redirectUrl"
					label="代理资源"
					:rules="[
						{
							required: true,
							message: '请输入代理资源',
							trigger: 'blur',
						},
					]"
				>
					<el-input
						v-model="dynamicValidateForm.redirectUrl"
						placeholder="请输入代理资源"
					/>
				</el-form-item>
			</el-form>
			<div class="btn-list">
				<div class="actions">
					<el-button
						type="primary"
						:disabled="
							!dynamicValidateForm.urlFilter || !dynamicValidateForm.redirectUrl
						"
						class="action"
						@click="onAddRule"
					>
						添加并开启代理
					</el-button>
					<el-button type="primary" class="action" @click="onOpenAll">
						开启全部代理
					</el-button>
				</div>
				<div class="actions">
					<el-button type="warning" class="action" @click="onCloseAll">
						关闭全部代理
					</el-button>
					<el-button type="danger" class="action" @click="onClear">
						清空全部规则
					</el-button>
				</div>
			</div>
		</div>
		<div v-if="filterUrls.length" class="rule-list">
			<div v-for="(i, index) in filterUrls" :key="i" class="rule-item">
				<div class="left">
					<div class="rule">
						<span class="labal">目标资源：</span>
						<span class="value">{{ i }}</span>
					</div>
					<div class="rule">
						<span class="label">代理资源：</span>
						<span class="value">{{ redirectUrls[index] }}</span>
					</div>
				</div>
				<div class="right">
					<el-button
						:type="
							closedKeys.includes(i + '-' + redirectUrls[index])
								? 'primary'
								: 'warning'
						"
						link
						class="edit"
						style="padding: 0"
						@click="() => onChangeRuleStatus(index)"
					>
						{{ closedKeys.includes(i + "-" + redirectUrls[index]) ? "开启" :
						"关闭" }}
					</el-button>
					<el-button
						type="danger"
						link
						class="edit"
						style="padding: 0"
						@click="() => onDelete(index)"
					>
						删除
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { nextTick, onMounted, reactive, ref } from "vue";
	import type { FormInstance } from "element-plus";
	import { ElMessage } from "element-plus";
	import { getStorage } from "@/utils";

	const formRef = ref<FormInstance>();
	const dynamicValidateForm = reactive<{
		urlFilter: string;
		redirectUrl: string;
	}>({
		urlFilter: "",
		redirectUrl: "",
	});
	const filterUrls = ref<string[]>([]);
	const redirectUrls = ref<string[]>([]);
	const closedKeys = ref<string[]>([]);

	onMounted(() => {
		nextTick(async () => {
			const { urlFilter, redirectUrl, closedRules } = await getStorage();
			filterUrls.value = urlFilter || [];
			redirectUrls.value = redirectUrl || [];
			closedKeys.value = closedRules || [];
		});
	});

	// 添加需要代理的域名及被代理的域名或者js资源，即线上的 js 资源及本地的 js 资源
	const onAddRule = async () => {
		const { urlFilter, redirectUrl } = await getStorage();
		formRef.value?.validate((valid) => {
			if (valid) {
				if (!urlFilter?.length || !redirectUrl?.length) {
					chrome.storage.local.set({
						urlFilter: [dynamicValidateForm.urlFilter],
						redirectUrl: [dynamicValidateForm.redirectUrl],
					});
					filterUrls.value = [dynamicValidateForm.urlFilter];
					redirectUrls.value = [dynamicValidateForm.redirectUrl];
				} else {
					const index1 = urlFilter?.findIndex(
						(i: string) => i === dynamicValidateForm.urlFilter
					);
					const index2 = redirectUrl?.findIndex(
						(i: string) => i === dynamicValidateForm.redirectUrl
					);
					if ((index1 === -1 && index2 === -1) || index1 !== index2) {
						chrome.storage.local.set({
							urlFilter: [dynamicValidateForm.urlFilter, ...urlFilter],
							redirectUrl: [dynamicValidateForm.redirectUrl, ...redirectUrl],
						});
						filterUrls.value = [dynamicValidateForm.urlFilter, ...urlFilter];
						redirectUrls.value = [
							dynamicValidateForm.redirectUrl,
							...redirectUrl,
						];
					}
				}
				ElMessage.success("设置成功");
				dynamicValidateForm.redirectUrl = "";
				dynamicValidateForm.urlFilter = "";
			} else {
				console.log("error submit");
			}
		});
	};

	// 开启添加的所有资源的代理
	const onOpenAll = async () => {
		const { rules } = await getStorage(["rules"]);
		chrome.storage.local.set({
			closedRules: [],
		});
		closedKeys.value = [];
		chrome.storage.local.set({
			closedRules: [],
		});
		updateRules(rules);
		ElMessage.success("代理已开启");
	};

	// 关闭所有资源的代理
	const onCloseAll = async () => {
		const { rules } = await getStorage();
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds:
				rules?.map((i: any) => i.id) ||
				Array.from({ length: 100 }, (_, i) => i + 1),
		});
		closedKeys.value = rules.map(
			(i: any) => `${i.condition.urlFilter}-${i.action.redirect.url}`
		);
		chrome.storage.local.set({
			closedRules: [...closedKeys.value],
		});
		ElMessage.success("代理已关闭");
	};

	// 清除 storage 添加的规则，这也间接的关闭了所有资源的代理
	const onClear = () => {
		chrome.storage.local.remove([
			"urlFilter",
			"redirectUrl",
			"closedRules",
			"rules",
		]);
		filterUrls.value = [];
		redirectUrls.value = [];
		closedKeys.value = [];
		ElMessage.success("规则已清空");
	};

	// 动态更新或者删除添加的代理规则
	const updateRules = async (rules: any[]) => {
		const _rules = rules?.filter(
			(i: any) =>
				!closedKeys.value.includes(
					i.condition.urlFilter + "-" + i.action.redirect.url
				)
		);
		if (_rules) {
			await chrome.declarativeNetRequest.updateDynamicRules({
				removeRuleIds:
					rules?.map((i: any) => i.id) ||
					Array.from({ length: 100 }, (_, i) => i + 1),
				addRules: _rules,
			});
		} else {
			await chrome.declarativeNetRequest.updateDynamicRules({
				removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1),
			});
		}
	};

	// 关闭单个资源的代理
	const onChangeRuleStatus = async (index: number) => {
		const { closedRules, rules } = await getStorage(["closedRules", "rules"]);
		let _closedKeys: string[] = [];

		if (
			closedKeys.value.includes(
				filterUrls.value[index] + "-" + redirectUrls.value[index]
			)
		) {
			_closedKeys = closedRules.filter(
				(i: string) =>
					i !== `${filterUrls.value[index]}-${redirectUrls.value[index]}`
			);
			chrome.storage.local.set({
				closedRules: _closedKeys,
			});
			closedKeys.value = _closedKeys;
		} else {
			_closedKeys = [...(closedRules || [])];
			const key = `${filterUrls.value[index]}-${redirectUrls.value[index]}`;
			_closedKeys.push(key);
			chrome.storage.local.set({
				closedRules: _closedKeys,
			});
			closedKeys.value = _closedKeys;
		}
		updateRules(rules);
	};

	// 删除单个代理资源
	const onDelete = (index: number) => {
		filterUrls.value.splice(index, 1);
		redirectUrls.value.splice(index, 1);
		chrome.storage.local.set({
			urlFilter: [...filterUrls.value],
			redirectUrl: [...redirectUrls.value],
		});
	};
</script>

<style scoped lang="less">
	.wrap {
		display: flex;
		flex-direction: column;
		width: 500px;
		padding: 10px;
		box-sizing: border-box;
		overflow: hidden;

		.add {
			.title {
				display: flex;
				align-items: center;
				font-size: 20px;
				font-weight: 500;
				padding: 0 0 10px;
				margin-bottom: 10px;
				border-bottom: 1px solid #5e5e5e;

				.icon {
					width: 35px;
					height: 35px;
					margin-right: 10px;
				}
			}
		}

		.btn-list {
			margin-top: 24px;

			.actions {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				margin-top: 10px;

				.action {
					flex: 1;
				}
			}
		}

		.rule-list {
			width: 100%;
			max-height: 268px;
			margin-top: 16px;
			border-radius: 5px;
			padding: 1px 5px;
			box-sizing: border-box;
			background-color: #3e3e3e;
			overflow: auto;

			.rule-item {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #5e5e5e;
				cursor: pointer;

				.left {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
				}

				&:last-child {
					border-bottom: none;
				}

				.rule {
					display: flex;
					justify-content: flex-start;
					padding: 3px 0;
					font-size: 14px;

					.value {
						flex: 1;
						text-align: left;
					}
				}
			}
		}

		:deep {
			.el-form-item__label {
				width: 100%;
				color: #fff;
			}
		}
	}
</style>
```

3. 在 background.js 初始化及监听规则的变化从而动态添加或者删除规则：

```ts
// 获取 storage 中存取的数据
const getStorage = async (keys?: string[]) => {
	const { urlFilter, redirectUrl, rules, closedRules } =
		await chrome.storage.local.get(
			keys || ["urlFilter", "redirectUrl", "rules", "closedRules"]
		);

	return {
		urlFilter,
		redirectUrl,
		rules,
		closedRules,
	};
};

// 创建重定向规则
const createRedirectRule = async (
	urlFilter: string[],
	redirectUrl: string[]
) => {
	if (!urlFilter?.length || !redirectUrl?.length) {
		return null;
	}

	const rules = urlFilter.map((i: string, index: number) => {
		return {
			id: index + 1,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					url: redirectUrl[index],
				},
			},
			condition: {
				urlFilter: i,
				resourceTypes: ["main_frame", "script"],
			},
		};
	});

	if (rules?.length) {
		chrome.storage.local.set({
			rules,
		});
	}

	return rules;
};

// 初始化动态规则
chrome.runtime.onInstalled.addListener(async () => {
	const { urlFilter, redirectUrl } = await getStorage();
	const rules = await createRedirectRule(urlFilter, redirectUrl);
	if (rules?.length) {
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [],
			addRules: rules,
		});
	}
});

// 监听配置变更，动态添加或者删除设置的规则
chrome.storage.onChanged.addListener(
	async (changes: any, namespace: string) => {
		if (namespace === "local" && changes.urlFilter && changes.redirectUrl) {
			const { urlFilter, redirectUrl, closedRules } = await getStorage();
			const rules = await createRedirectRule(urlFilter, redirectUrl);
			const _rules = closedRules?.length
				? rules?.filter(
						(i: any) =>
							!closedRules.includes(
								i.condition.urlFilter + "-" + i.action.redirect.url
							)
				  )
				: rules;

			if (_rules) {
				await chrome.declarativeNetRequest.updateDynamicRules({
					removeRuleIds:
						rules?.map((i: any) => i.id) ||
						Array.from({ length: 100 }, (_, i) => i + 1),
					addRules: _rules,
				});
			} else {
				await chrome.declarativeNetRequest.updateDynamicRules({
					removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1),
				});
			}
		}
	}
);
```

以上就是整个插件的主要实现代码，如果想要查看完成代码，请戳 [dnhyxc-proxy](https://github.com/dnhyxc/dnhyxc-proxy) 前往 github 查看。
