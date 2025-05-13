### 小程序渲染 markdown 方案

#### 使用 Towxml

这种方案在 uni-app + vue3 项目中存在各种问题，放弃。

#### 使用 marked + highlight.js

在 uni-app 中安装 marked + highlight.js 自己实现对 markdown 的解析。这种方案在本地运行没问题，但是在上传微信小程序时会报错，导致小程序包无法上传成功。

#### 通过后端将 markdown 转成 html

最终选择的是调用后端接口将 markdown 转成 html，这种方案能减小小程序包体积，同时能够自定义对 markdown 的解析。

后端（node）也通过 marked + highlight.js + katex 实现对 markdown 的转换，具体实现如下：

```js
const { marked } = require("marked");
const hljs = require("highlight.js");
const katex = require("katex");
const javascript = require("highlight.js/lib/languages/javascript");
const typescript = require("highlight.js/lib/languages/typescript");
const python = require("highlight.js/lib/languages/python");
const java = require("highlight.js/lib/languages/java");
const csharp = require("highlight.js/lib/languages/csharp");
const bash = require("highlight.js/lib/languages/bash");
const sql = require("highlight.js/lib/languages/sql");
const json = require("highlight.js/lib/languages/json");
const xml = require("highlight.js/lib/languages/xml");
const c = require("highlight.js/lib/languages/c");
const cpp = require("highlight.js/lib/languages/cpp");
const go = require("highlight.js/lib/languages/go");
const shell = require("highlight.js/lib/languages/shell");
const rust = require("highlight.js/lib/languages/rust");
const yaml = require("highlight.js/lib/languages/yaml");

// 注册语言支持
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("go", go);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("java", java);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);

const md2html = (markdown, options = { needKatex: true, lineNumber: true }) => {
	const { needKatex, lineNumber } = options;

	const render = new marked.Renderer();
	marked.setOptions({
		renderer: render,
		gfm: true, // 启用GitHub风格的Markdown
		pedantic: false, // 禁用不规范的HTML
		breaks: false, // 禁用换行符
		silent: false, // 禁用警告
	});

	// 行内数学公式处理
	function inlineKatex(options) {
		return {
			name: "inlineKatex",
			level: "inline",
			start(src) {
				return src.indexOf("$");
			},
			tokenizer(src, _tokens) {
				const match = src.match(/^\$+([^$\n]+?)\$+/);
				if (match) {
					return {
						type: "inlineKatex",
						raw: match[0],
						text: match[1].trim(),
					};
				}
			},
			renderer(token) {
				return katex.renderToString(token.text, options);
			},
		};
	}

	// 块级数学公式处理
	function blockKatex(options) {
		return {
			name: "blockKatex",
			level: "block",
			start(src) {
				return src.indexOf("$$");
			},
			tokenizer(src, _tokens) {
				const match = src.match(/^\$\$+\n([^$]+?)\n\$\$/);
				if (match) {
					return {
						type: "blockKatex",
						raw: match[0],
						text: match[1].trim(),
					};
				}
			},
			renderer(token) {
				options.displayMode = true;
				return `<p>${katex.renderToString(token.text, options)}</p>`;
			},
		};
	}

	// 自定义警告框处理 - 以 !!! 开头和结尾的文本块
	function customAlert(text) {
		const match = text.match(/^!!!\s*([a-z]+)\s+([^\n]+?)\n([\s\S]+?)!!!/i);
		if (match) {
			const type = match[1].toLowerCase();
			const title = match[2].trim();
			const content = match[3].trim();

			const alertTypes = {
				attention: "attention",
				abstract: "abstract",
				bug: "bug",
				caution: "caution",
				danger: "danger",
				error: "error",
				example: "example",
				failure: "failure",
				hint: "hint",
				info: "info",
				note: "note",
				question: "question",
				quote: "quote",
				success: "success",
				tip: "tip",
				warning: "warning",
			};

			const alertClass = alertTypes[type] || "default";

			return `
        <div class="custom-alert ${alertClass}">
          <div class="alert-title">${title}</div>
          <div class="alert-content">${content}</div>
        </div>
      `;
		}
		return text;
	}

	const renderer = {
		// 默认文本段落处理
		paragraph(text, lang) {
			const alertContent = customAlert(text);
			if (alertContent !== text) {
				return alertContent;
			}
			return `<p>${text}</p>`;
		},
		// 单行代码块处理
		codespan(code) {
			// 判断是否是行内代码块，如果是则返回高亮处理后的代码
			if (code && hljs.getLanguage("javascript")) {
				try {
					return `<code class="hljs-inline">${code}</code>`;
				} catch (e) {
					console.error(e);
				}
			}
			return `<span>${code}</span>`;
		},
		// 多行代码块处理
		code(code, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					if (lineNumber) {
						const highlighted = hljs.highlight(code, { language: lang }).value;
						const lines = highlighted.split("\n");
						// 生成带行号的代码行
						const numberedLines = lines
							.map(
								(line, i) =>
									`<div class="code-line"><span class="line-number">${
										i + 1
									}</span><code class="hljs language-${lang}">${
										line || " "
									}</code></div>`
							)
							.join("");
						return `
              <div class="code-container">
                <div class="code-title">
                  <div class="code-flag">
                    <span class="flag first-flag"></span><span class="flag secend-flag"></span><span class="flag third-flag"></span>
                  </div>
                  ${lang}
                </div>
                <div class="code-content">
                  <pre>${numberedLines}</pre>
                </div>
              </div>
            `;
					} else {
						return `
              <div class="code-container">
                <div class="code-title">
                  <div class="code-flag">
                    <span></span><span></span><span></span>
                  </div>
                  ${lang}
                </div>
                <div class="code-content">
                  <pre>
                    <code class="hljs language-${lang}">${
							hljs.highlight(code, { language: lang }).value
						}</code>
                  </pre>
                </div>
              </div>
            `;
					}
				} catch (e) {
					console.error(e);
				}
			}
			return `<pre><code class="hljs">${
				hljs.highlightAuto(code).value
			}</code></pre>`;
		},
		// 标题处理
		heading(text, level) {
			const anchor = text.toLowerCase().replace(/\s+/g, "-");
			return `<h${level} id="${anchor}" class="head">${text}</h${level}>`;
		},
		// 链接处理
		link(href, title, text) {
			return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="hljs-link" title="${title}">${text}</a>`;
		},
		// 图片处理
		image(href, title, text) {
			return `<img src="${href}" alt="${text}" title="${title}"/>`;
		},
		// 引用内容处理
		blockquote(quote) {
			return `<blockquote class="hljs-quote">${quote}</blockquote>`;
		},
	};

	// 是否需要对数学公式进行转换，小程序使用 mp-html 渲染，内部支持了数学公式的渲染，所以不需要转换
	if (needKatex) {
		marked.use({
			// extensions 扩展 marked 的 Markdown 解析功能
			extensions: [
				inlineKatex({
					throwOnError: false,
					displayMode: false,
				}),
				blockKatex({
					throwOnError: false,
					displayMode: true,
				}),
			],
		});
	}

	marked.use({ renderer });
	return marked.parse(markdown);
};

module.exports = {
	md2html,
};
```

### 小程序渲染 html 富文本

#### 使用 rich-text

这种方案无法渲染数学公式，同时对图片、链接的渲染也不是很友好，并且无法对链接及图片进行事件绑定。

#### 使用 mp-html

这种方案能够完美的解决上述 rich-text 遇到的问题。但是对于渲染数学公式或者其他内容，需要将 mp-html 源码拉下来，对根目录下的 `tools` 文件夹中的 `config.js` 的内容进行修改，把 注释的 `latex` 放开，之后运行 `npm run build:uni-app` 重新打包。

- /tools/config.js 文件内容：

```js
/**
 * @fileoverview 配置文件
 */
module.exports = {
	/**
	 * @description 需要的插件列表
	 */
	plugins: [
		// 按需打开注释即可
		// 'audio',     // 音乐播放器
		// 'editable',  // 内容编辑
		// 'emoji',     // 小表情
		"highlight", // 代码高亮
		"markdown", // 解析 md
		"latex", // 解析 latex
		// 'search',    // 关键词搜索
		"style", // 解析 style 标签
		// 'txv-video', // 使用腾讯视频
		// 'img-cache'  // 图片缓存
		// 'card',      // 卡片展示
	],

	// ...
};
```

> 放开 latex，使 mp-html 支持数学公式的渲染。

完成打包之后将打包输出文件 dist 中的 `uni-app` 文件中的 `components` 文件复制到自己的 uni-app 项目根目录下。

最后，在需要使用 mp-html 的文件中导入 mp-html 即可使用了。

```vue
<template>
	<scroll-view class="detail-wrap" ref="scrollRef" scroll-y="true">
		<mp-html :content="articleStore.html" />
	</scroll-view>
</template>

<script setup lang="ts">
import mpHtml from "@/components/mp-html/mp-html.vue";
// ...
</script>
```
