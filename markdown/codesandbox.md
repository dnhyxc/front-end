### 安装 codesandbox

```yaml
npm install codesandbox -S
```

### codesandbox 使用 GIT 方式调用

```js
import { getParameters } from "codesandbox/lib/api/define";

const parameters = getParameters({
	files: {
		"index.js": {
			content: "console.log('hello')",
		},
		"package.json": {
			content: { dependencies: {} },
		},
	},
});

const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;

document.body.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
```

### codesandbox 使用 POST 方式调用

```js
import { getParameters } from "codesandbox/lib/api/define";

document.body.innerHTML = "";

const code = `import React from 'react';
import ReactDOM from 'react-dom';

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Meck',
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);`;
const html = '<div id="root"></div>';

const parameters = getParameters({
	files: {
		"package.json": {
			content: {
				dependencies: {
					react: "latest",
					"react-dom": "latest",
				},
			},
		},
		"index.js": {
			content: code,
		},
		"index.html": {
			content: html,
		},
	},
});

document.body.innerHTML = `
<form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
  <input type="hidden" name="parameters" value="${parameters}" />
  <input type="submit" value="Open in sandbox" />
</form>
`;
```

### codesandbox 使用 XHR Request 方式调用

```js
const code = `import React from 'react';
import ReactDOM from 'react-dom';

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Meck',
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);`;
const html = '<div id="root"></div>';

fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	body: JSON.stringify({
		files: {
			"package.json": {
				content: {
					dependencies: {
						react: "latest",
						"react-dom": "latest",
					},
				},
			},
			"index.js": {
				content: code,
			},
			"index.html": {
				content: html,
			},
		},
	}),
})
	.then((x) => x.json())
	.then((data) => (document.body.innerHTML = JSON.stringify(data, null, 2)));
```

### ITemplate 类型

```ts
export type ITemplate =
	| "adonis"
	| "vue-cli"
	| "preact-cli"
	| "svelte"
	| "create-react-app-typescript"
	| "create-react-app"
	| "angular-cli"
	| "parcel"
	| "@dojo/cli-create-app"
	| "cxjs"
	| "gatsby"
	| "nuxt"
	| "next"
	| "reason"
	| "apollo"
	| "sapper"
	| "ember"
	| "nest"
	| "static"
	| "styleguidist"
	| "gridsome"
	| "vuepress"
	| "mdx-deck"
	| "quasar"
	| "docusaurus"
	| "node";
```

### 参考示例

```js
const onOpenCodesandboxWithReact = (e: Event) => {
	const code = getParameters({
		template: "create-react-app-typescript",
		files: {
			"src": {
				children: {
					"App.tsx": {
						content: codeContent.value,
						isBinary: false,
					},
					"index.tsx": {
						content: `
        		  import React from "react";
        		  import ReactDOM from "react-dom/client";
        		  import App from "./App";

        		  const rootElement = document.getElementById("root")!;
        		  const root = ReactDOM.createRoot(rootElement);

        		  root.render(
        		    <React.StrictMode>
        		      <App />
        		    </React.StrictMode>
        		  );
        		`,
						isBinary: false,
					},
					"styles.css": {
						content: `
      		    .App {
      		      font-family: sans-serif;
      		      text-align: center;
      		      color: red;
      		    }
      		  `,
						isBinary: false,
					},
				}
			},
			"App.tsx": {
				content: codeContent.value,
				isBinary: false,
			},
			"index.tsx": {
				content: `
          import React from "react";
          import ReactDOM from "react-dom/client";
          import App from "./App";

          const rootElement = document.getElementById("root")!;
          const root = ReactDOM.createRoot(rootElement);

          root.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>
          );
        `,
				isBinary: false,
			},
			"styles.css": {
				content: `
          .App {
            font-family: sans-serif;
            text-align: center;
            color: red;
          }
        `,
				isBinary: false,
			},
			"package.json": {
				content: JSON.stringify({
					dependencies: {
						react: "^18.3.1",
						"react-dom": "^18.3.1",
						antd: "^5.20.2",
						"@ant-design/icons": "^5.4.0",
						dayjs: "^1.11.13",
						"lodash-es": "^4.17.21",
						axios: "^1.7.5",
						ahooks: "^3.8.1",
					},
				}),
				isBinary: false,
			},
			"tsconfig.json": {
				content: JSON.stringify({
					include: ["./src/**/*"],
					compilerOptions: {
						strict: true,
						esModuleInterop: true,
						lib: ["dom", "es2015"],
						jsx: "react-jsx",
					},
				}),
				isBinary: false,
			},
		},
	});
	const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${encodeURIComponent(
		code
	)}`;
	shell.openExternal(url);
};
```
