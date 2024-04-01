### webpack5 基本配置

#### webpack 安装

1、注意尽量不要在全局安装 webpack、在全局安装会把 webpack 版本锁死，可能导致其它项目打包出错。

2、可以通过如下方式在局部安装：

```
mkdir webpack-test

cd webpack-test

npm init -y

npm i webpack webpack-cli webpack-dev-server -D
```

#### entry 配置

1、entry 用于配置打包时的入口，其属性及配置如下：

```js
module.exports = {
  entry: "./src/index.js",
};
```

#### output 配置

1、output 用于配置打包的出口，其属性及配置方式如下：

- clean：用于清除上次打包生成的 dist 或 build 文件夹。

- filename：用于配置打包输出的文件名称，我们可以通过 filename 中的 **substitutions** 设置来定义输出文件的名称。webpack 提供了一种使用称为 substitutions（可替换模板字符串）的方式，通过带括号字符串来模板化文件名。其中 **[contenthash]** substitutions 将根据资源内容创建出唯一 hash。当资源内容发生变化时，contenthash 也会发生变化。

- path：用于配置打包输出的文件夹路径。

- assetModuleFilename：用于设置打包输出的资源模块（图片等）的文件名及路径。如：`assetModuleFilename: "images/test.png"` 就是将打包的资源模块输出到 dist 文件夹中的 images 文件夹下，名字为 test.png。

- publicPath：该属性用于配置公共路径。这个配置在各种场景中都非常有用，我们可以通过它来指定应用程序中所有资源的基础路径。

  - 基于环境变量设置：在开发环境中，我们通常有一个 asset/ 文件夹，它与索引页面位于同一级别，这没太大问题，但是如果我们将所有的静态资源托管到 CDN 上，然后想在生产环境中使用该怎么解决呢？想要解决这个问题，可以直接使用环境变量，假设有一个环境变量 ASSET_PATH：

```js
import webpack from "webpack";

const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
  // ...
  output: {
    filename: "[name].[contenthash].[ext]",
    path: path.reslove(__dirname, "./dist"),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]",
    publicPath: "ASSET_PATH",
  },

  plugins: [
    // 该配置可以帮助我们在代码中安全的使用环境变量
    new webpack.DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
    }),
  ],
};
```

> contenthash：表示根据文件的内容来生成一个 hash 字符串，ext 则表示文件的扩展名，这些都是 webpack 内置的写法。

#### 环境变量

1、想要消除 webpack.config.js 在开发环境和生产环境之间的差异，就需要环境变量。

2、webpack 命令行环境变量的 **--env** 参数，可以允许传入任意数量的环境变量。而在 webpack.config.js 中可以访问到这些环境变量。例如：`--env production` 或 `--env goal=local`

```
npx webpack --env production --goal=local --progress
```

3、注意：要使用 env 变量，必须将 module.exports 转换成函数的形式：

```js
module.exports = (env) => {
  const isDev = env.production ? false : true;

  return {
    // ...
    mode: isDev ? "production" : "development",
    // ...
  };
};
```

#### plugins

##### html-webpack-plugin

1、该插件可以让 webpack 在打包时自动生成 index.html，并自定将打包生成的 js 文件引入生成的 index.html 中。

2、属性及配置方式如下：

- template：该属性用于配置 webpack 打包生成 index.html 的模板。

- filename：配置生成 html 的文件名。

- inject：配置引入 script 标签的位置，默认是放在 header 中，属性值如果配置为 body，将会引入到 body 中。

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "./index.html",
    filename: "index.html",
    inject: "body",
  }),
];
```

##### webpack-bundle-analyzer

1、该插件是一个 plugin 和 CLI 工具，可以用来配置打包时生成依赖图。它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式。即打包完成之后，会在浏览器中打开一个页面展示一个可视化的打包产物依赖图。

2、具体配置方式如下：

- 首先需要安装 webpack-bundle-analyzer 这个插件：

```
npm i webpack-bundle-analyzer -D
```

- 之后在 plugins 中配置该插件：

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // ...
  plugins: [new BundleAnalyzerPlugin()],
};
```

#### webpack-dev-server

1、webpack-dev-server 可以提供一个基本的 web server，并且具有 live reloading（实时重新加载）功能。

2、webpack-dev-server 在编译之后不会输出任何文件，而是将 bundle 文件保存到内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。

##### 常用属性属性及配置

1、static：该属性用于告知 webpack-dev-server 从什么位置查找文件，`static: "./dist"` 将告知其从 dist 目录下的文件作为 web 服务的根目录。

2、compress：该属性可以设置是否开启 gzip 压缩，及是不是在服务器端进行代码压缩。其中值为 `true` 则表示开启，否则反之。我们可以通过浏览器中 network 中的 Respons Headers 中的 **Content-Encoding: gzip** 属性查看是否开启了 gzip 压缩。

3、prot：用于配置浏览器访问的端口号。

4、proxy：该属性可以用来配置代理。

```js
module.exports = {
  // ...
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    compress: true,
    port：3000,
    proxy: {
      "/api": "http://localhost: 4001",
      pathRewrite: {
        "^/api": " "
      }
    },
  },
}
```

##### 高级属性及配置

1、headers：可以将一个头部信息传递到请求头中。

```js
module.exports = {
  devServer: {
    headers: {
      "X-Access-Token": "abcxxx",
    },
  },
};
```

2、https：是否将 http 服务变成 https 的服务。其中值为 true 为开启 https 服务。

```js
module.exports = {
  devServer: {
    https: true,
  },
};
```

3、http2：是否使用 http2 的服务。其中值为 true，则表示开启 http2 的服务。

```js
module.exports = {
  devServer: {
    http2: true,
  },
};
```

4、historyApiFallback：用于解决 SPA 单页应用配置 history 模式路由出现的 404 的问题。

- 在一个 SPA 应用中，当在路由后面加上 `/article` 时，会发现此时刷新页面后，控制台会报错：`GRT http://localhost: 3000/article 404 (Not Found)`。这是因为浏览器把这个路由当作静态资源地址去请求了，然而我们并没有打包出 `/article` 这样的资源，所以就会出现 404 的情况。这时，就可以通过 **historyApiFallback** 属性来解决问题了。

```js
module.exports = {
  devServer: {
    historyApiFallback: true,
  },
};
```

> 配置如上设置之后，重新刷新页面，就会发现请求变成了 `index.html`。

- 在多数应用场景下，我们需要根据不同的访问路径定制替代的页面，此时可以使用 **rewrites** 这个配置项，具体配置如下：

```js
module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [
        {from: /^\/$/, to: "/views/loading.html"}
        {from: /^\/subpage$/, to: "/views/subpage.html"}
        {from: /./, to: "/views/404.html"}
      ],
    },
  },
};
```

5、host: 用于设置开发服务器主机，如果在开发环境中起了一个 devServer 服务，并期望在同一局域网下的他人也能访问到它，就可以使用如下配置解决：

```js
module.exports = {
  devServer: {
    host: "0.0.0.0",
  },
};
```

6、hot：用于开启模块热替换。

- 模块热替换（HMR-hot module replacement）功能会在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。

```js
module.exports = {
  devServer: {
    hot: true,
  },
};
```

- 当配置了 style-loader 时，也就相当于开启了样式文件的热替换功能。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

7、liveReload：用于开启热加载功能。

- 当开启了热加载时，当文件更新时，会自动刷新服务和页面。新版的 webpack-dev-server 默认已经开启了热加载功能。它对应的参数是 ddevServer.liveReload，默认为 true。注意：如果想要关掉它，需要将 liveReload 设置为 false 的同时将 hot 设置为 false。

```js
module.exports = {
  devServer: {
    liveReload: false,
    hot: false,
  },
};
```

### 资源文件

#### loader

1、webpack 天生就可以解析 js 及 json 文件，而需要解析其它资源文件，就需要借助 loader 来实现了，比如在 js 中加载 css 模块，就需要通过 loader 来完成。

#### loader 的定义

1、test：用于识别出哪些文件需要被转换。

2、use：定义转化的时候需要用哪个 loader 进行转化。

```js
module.exports = {
  module: {
    rules: [
      test: /\.txt$/,
      use: "raw-loader",
    ]
  },
};
```

> 上述例子中，当 webpack 去解析一个 .txt 文件的时候，在对这个文件进行打包之前，先使用 raw-loader 进行转化一下，再打包输出。

#### 解析 css 资源

1、解析 css 资源，需要安装 **style-loader、css-loader**。

```
npm i style-loader css-loader -D
```

2、具体配置如下：

```js
module.exports = {
  module: {
    rules: [
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    ]
  },
};
```

> 由于 loader 的加载顺序是从右到左，从下到上的，所以 style-loader 要放在 css-loader 之前，即先使用 css-loader 进行解析，之后再使用 style-loader 渲染到页面上。

#### PostCSS

1、PostCSS 是一个用 JS 工具和插件转换 CSS 代码的工具，比如可以使用 Autoprefixer 插件获取浏览器额流行度和能够支持的属性，并根据这些数据帮我们自动的为 CSS 规则添加前缀，将最新的 CSS 语法转换为大多数浏览器都能识别的语法。

2、使用 PostCSS 时，需要安装 style-loader、css-loader、postcss-loader 这三个 loader：

```
npm i style-loader css-loader postcss-loader -D
```

3、PostCSS 具体配置如下：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /module/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
```

4、在项目录下创建 postcss.config.js 文件，内容如下：

- 首先需要安装 **autoprefixer** 这个插件，该插件的作用是可以为样式加上前缀，用于做浏览器的兼容性设置：

```
npm i autoprefixer -D
```

- 之后在 postcss.config.js 中使用该插件：

```js
module.exports = {
  plugins: [require("autoprefixer")],
};
```

- 最后需要在 package.json 中配置 **browserslist** 属性：

```json
"devDependencies": {
  // ...
},

"browserslist": {
  "> 1%",
  "last 2 versions"
}
```

- 设置好以上配置之后，在 css 中设置 `body: { display: flex; }`，最终在浏览器中设置的样式为：

```css
body: {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

#### CSS 模块化设置

1、CSS 模块则能让你永远不用担心命名太大众化而造成冲突，只要用最有意义的名字就行了。

2、配置 css 模块化，只需要在 css-loader 中的设置 `options.module: true` 即可。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /module/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[hash:base64:6]", // 样式名设置
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
};
```

3、除了将所有的 css 都设置为模块化之外，也可以部分开启 css 模块化形式，比如全局样式可以冠以 `.global` 前缀，如：`*.global.css 表示普通模式`，`*.css 表示 css 模块化模式`。

- 模块化模式配置如下：

```js
{
  test: new RegExp(`^(?!.*\\.global).*\\.css`);
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
      options: {
        modules: true,
        localIdentName: "[hash:base64:6]",
      },
    },
    {
      loader: "postcss-loader",
    },
  ];
  exclude: [path.resolve(__dirname, "..", "node_modules")];
}
```

- 普通模式配置如下：

```js
{
  test: new RegExp(`^(.*\\.global).*\\.css`);
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
    },
  ];
  exclude: [path.resolve(__dirname, "..", "node_modules")];
}
```

#### 解析 less 资源

1、解析 less 需要安装 **less、less-loader**。

```
npm i less less-loader -D
```

2、具体配置如下：

```js
module.exports = {
  module: {
    rules: [
      test: /\.(css|less)$/,
      use: ["style-loader", "css-loader", "less-loader"],
    ]
  },
};
```

#### 抽离 css

1、将 css 文件抽离成单独的文件，需要通过 **mini-css-ectract-plugin** 这个插件来完成。

```
npm i mini-css-ectract-plugin -D
```

2、mini-css-ectract-plugin 属性及配置如下：

- filename：定义 css 打包输出的文件路径及文件名称。

```js
const MiniCssExtractPlugin = require("mini-css-ectract-plugin");

module.exports = {
  module: {
    rules: [
      test: /\.(css|less)$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],

    ]
  },

  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css"
    });
  ]
};
```

#### 压缩 css

1、压缩 css 需要通过 **css-minimizer-webpack-plugin** 来完成。

```
npm i css-minimizer-webpack-plugin -D
```

2、css-minimizer-webpack-plugin 配置如下：

```js
const MiniCssExtractPlugin = require("mini-css-ectract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      test: /\.(css|less)$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    ]
  },

  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css"
    });
  ],

  optimization: {
    minimizer: [
      new CssMinimizerPlugin();
    ]
  },

  mode: 'production',
};
```

#### 压缩 js

1、压缩 js 本是 webpack 开箱即用的功能，但是如果在 optimization.minimizer 中配置了压缩 css 的功能之后，这个开箱即用的功能就失效了，需要单独配置，此时需要单独配置 **terser-webpack-plugin** 来实现：

```
npm i terser-webpack-plugin -D
```

2、具体配置如下：

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // ...
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin();
      // 压缩js
      new TerserPlugin();
    ]
  },

  mode: 'production',
};
```

> 注意：要使压缩 css 生效，必须将 mode 设置为生产模式。

#### 加载数据

1、类似于 NodeJS，webpack 加载 JSON 文件实际上是内置的，也就是说 `import Data from './data.json'`，但要导入 CSV、TSV、XML 这些资源就需要使用 **csv-loader 和 xml-loader**。

```
npm i csv-loader xml-loader -D
```

2、具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.(csv|tsv)$/,
      use: ["csv-loader"],
    },
    {
      test: /\.xml$/,
      use: ["xml-loader"],
    },
  ];
}
```

3、使用如上配置，就可以直接在 js 文件中导入 csv、xml 等资源了：

```js
import Data from "./assets/data.xml";
import Notes from "./assets/data.csv";

console.log(Data);
console.log(Notes);
```

#### 自定义 JSON 模块 parser

1、通过自定义 parser 代替特定的 webpack loader，可以将任何 toml、yaml 或 json5 文件作为 JSON 模块导入。但要完成这个需求需要安装如下插件：

```
npm i toml yaml json5 -D
```

2、在 webpack.config.js 文件中设置如下配置：

```js
// ...
const toml = require("toml");
const yaml = require("yaml");
const json5 = require("json5");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/,
        type: "json",
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
};
```

3、设置了如上配置之后，就可以在 js 中导入使用上述资源了：

```js
import toml from "./assets/data.toml";
import yaml from "./assets/data.yaml";
import json5 from "./assets/data.json5";

console.log(toml);
console.log(yaml);
console.log(json5);
```

#### babel-loader

1、babel-loader 可以将 es6 的 js 代码编译成 es5 的代码，如下 es6 中的 async await 的写法就可通过 babel-loader 编译成低版本浏览器可识别的 es5 的写法：

- 在入口 js 文件中写入如下代码：

```js
function getString() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Hello world");
    }, 2000);
  });
}

async function helloWorld() {
  const string = await getString();
  console.log(string);
}
```

> 如果在低版本的浏览器中运行上述代码，如果没有被 babel-loader 转义，在页面将不能正常显示。

2、要使用 babel-loader，需要安装如下几个 loader：

```
npm i babel-loader @babel/core @babel/preset-env -D
```

- babel-loader：在 webpack 里用于解析 ES6 的桥梁。

- @babel/core：babel 核心模块。

- @babel/preset-env：babel 预设，一组 babel 插件的集合。

3、为了兼容 async/await 语法，webpack 会用到 regeneratorRuntime 插件。此时就需要安装 **@babel/runtime、@babel/plugin-transform-runtime** 这两个插件。否则在解析 async/await 语法的时候就会报错。

- @babel/plugin-transform-runtime：会在需要使用到 regeneratorRuntime 的地方自动 require 导包。

```
npm i @babel/runtime @babel/plugin-transform-runtime -D
```

4、具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [["@babel/plugin-transform-runtime"]],
        },
      },
    },
  ];
}
```

#### 解析 TypeScript

1、结合 webpack 使用 TS，首先需要安装 typescript 及 ts-loader：

```
npm i typescript ts-loader -D
```

2、在项目根目录下添加一个 ts 配置文件 `tsconfig.json`，或者直接使用 ts 自带的工具来自动化生成该文件：

```
npx tsc --init
```

- tsconfig.js 文件局部配置如下：

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "sourceMap": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": "true",
    "moduleResolution": "node"
  }
}
```

3、webpack 编译 ts 具体配置如下：

```js
const path = reauire("path");
const HtmlWebpackPlugin = require();

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    extensions: [".ts", ".js"],
  },
  mode: "development",
};
```

### [资源模块](https://webpack.docschina.org/guides/asset-modules/)

#### asset/resource

1、asset/resource 会发送一个单独的文件并导出 URL，可以用来加载图片资源或者 fonts 字体等，如加载 **png、jpg、jpeg** 或者 **woff、woff2、eot、tff、otf** 等，具体配置如下：

- generator：可以在该属性中配置资源打包输出的文件名称及路径。

  - filename：用于配置资源模块的路径及名称。

```js
module: {
  rules: [
    {
      test: /\.png$/,
      type: "asset/resource",
      generator：{
        filename: "images/[contenthash][ext]",
      }
    },
    {
      test: /\.(woff|woff2|eot|tff|otf)$/,
      type: "asset/resource",
    },
  ];
}
```

> 在 generator 中配置的资源模块打包输出的路径及文件名优先级高于 在 output 配置中使用 assetModuleFilename 配置的路径及文件名。

2、使用如上配置后，在 js 文件中就可以使用模块的方式导入图片资源及使用字体了，导入后可以直接作为 img.src 的属性值，如下：

- css 文件：

```css
@font-face {
  font-family: "iconfont";
  src: url("./assets/iconfont.ttf");
}

.icon {
  font-family: "iconfont";
  font-size: 20px;
}
```

- js 文件：

```js
import testImage from "./assets/img1.png";

const myImage = new Image(100, 100);
myImage.src = testImage;
document.body.appendChild(myImage);

// 使用字体
const span = document.createElement("span");
span.classList.add("icon");
span.innerHTML = "&#xe668;";
document.body.appendChild(span);
```

#### asset/inline

1、asset/inline 会导出一个资源的 Data URL（base64 格式），可以用来加载 **svg** 图。具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.svg$/,
      type: "asset/inline",
    },
  ];
}
```

2、使用如上配置后，在 js 文件中就可以使用模块的方式导入 svg 资源了，导入后可以直接作为 img.src 的属性值，如下：

```js
import svgLogo from "./assets/logo.svg";

const myImage = document.createElement("img");
myImage.style.cssText = "width: 600px; height: 200px";
myImage.src = svgLogo;
document.body.appendChild(myImage);
```

#### asset/source

1、asset/source 会导出资源的源代码，可以用来加载 **text** 文本文件，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.text$/,
      type: "asset/source",
    },
  ];
}
```

2、使用如上配置后，在 js 文件中就可以使用模块的方式导入 text 资源了，如下：

```js
import textFile from "./assets/textFile.txt";

const dom = document.createElement("div");
myImage.style.cssText = "width: 200px; height: 200px; background: pink";
dom.textContent = textFile;
document.body.appendChild(dom);
```

#### asset

1、asset 是一个通用资源类型，它会在 resource 和 inline 之间自动进行选择：

- 小于 8kb 的文件，将会被视为 inline 模块类型，否则会被视为 resource 模块类型。

- 可以在 webpack 配置的 module rule 层级中设置 Rule.parser.dataUrlCondition.maxSize 选项来修改此条件：

```js
module: {
  rules: [
    test: /\.jpg$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024 // 4kb
      }
    }
  ]
}
```

### 代码分离

#### 为什么要进行代码分离

1、当没有进行代码分离时：假设 a.html 引用了 a.js，b.html 引用了 b.js，而 a.js 和 b.js 都引用了一个 24kb 的 lodash，这时假设用户先访问了 a.html，再访问 b.html，那么用户访问 a.html 的时候下载 a.js 有 24kb+，之后 a.js 被浏览器缓存，用户访问 b.html 的时候下载 b.js 有 24kb+，然后 b.js 被浏览器缓存，这样用户一共下载了 48kb+ 的内容，显然 lodash 被下载了两次。而且 lodash 没有被浏览器缓存（缓存的是 a.js 和 b.js）。

2、代码分离之后：这时候将 lodash 单独打包放到 vendor.js 中，当用户访问 a.html 的时候会下载 a.js 和 vendor.js，同时 a.js 和 vendor.js 会被浏览器缓存，用户再访问 b.html 的时候，只会下载 b.js，而不会再去下载 vendor.js，因为会直接使用缓存中的 vendor.js。这样就只下载了一次 lodash，省下了 24kb+ 的带宽，同时还提升了访问速度。

#### 常用的代码分离方法

1、在入口起点中使用 entry 配置多入口手动分离代码。

2、使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离代码。

3、使用动态导入，通过模块的内联函数调用来分离代码。

#### 入口起点的方式

1、使用多入口的方式，可以将多个入口的 js 文件单独打包到不同的文件中，从而实现代码的分离。

2、这种方式需要更改 output 配置中的 filename 属性，即使用 webpack 内置的写法，自动获取输出文件的文件名称，使分离的文件不会使用同一个出口，防止报错。

```js
// ...
module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
};
```

> 上述配置会将 index.js 及 another-module.js 分别输出到 dist 文件中，及将会在 dist 文件中同时生成 index.bundle.js 及 another.bundle.js 文件。而在输出的 index.html 文件中也会同时引入这两个 js 文件。

3、使用 entry 配置多入口分离代码会存在一个致命的缺点，就是如果在入口的 chunk 之间，包含一些重复的代码，这些重复的代码就会被引入到各自的 bundle 中。

- 如果在 index.js 中以及 another-module.js 中同时使用 lodash 的话，将会将 lodash 分别打包进入这两个 js 文件中，导致 lodash 重复打包。

#### 防止重复打包

1、需要在入口依赖中配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块：

```js
module.exports = {
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },

    another: {
      import: "./src/another-module.js",
      dependOn: "shared",
    },

    shared: "lodash",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
};
```

> 上述配置就实现了将 lodash 单独打包到 shared.bundle.js 文件中，而在 打包输出的文件中，会同时引入 index.bundle.js、another.bundle.js 及 shared.bundle.js。这样就让 index.js 及 another-module.js 能够共享 lodash。而不需要将 lodash 打包到自己的文件中。

2、除了上述方法之外，还可以使用 webpack 内置的插件 **[split-chunks-plugin](https://webpack.docschina.org/plugins/split-chunks-plugin/)** 来实现防止代码的重复打包：

- splitChunks.minSize：生成 chunk 的最小体积（以 bytes 为单位），默认是 20000。

- splitChunks.chunks：表明那些模块需要单独打包。`all` 表示将所有大于 20000 的模块都进行单独打包，`async` 表示只将异步加载的模块进行打包，`initial` 表示只将 entry 入口中引入的模块进行单独打包。

- splitChunks.name：打包输出的文件名称。

```js
module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },

  optimization: {
    minimizer: [
      // ...
    ],
    splitChunks: {
      minSize: 20000,
      chunks: "all",
      name: "vendor",
    },
  },
};
```

#### 动态导入

1、当涉及到动态代码拆分时，webpack 提供了两个类似的技术，第一种，也是推荐选择的方式是使用符合 ECMAScript 提案的 **import()** 语法来实现动态导入。第二种，则是 webpack 的遗留功能，使用 webpack 特定的 require.ensure。

2、webpack.config.js 具体配置如下：

```js
module.exports = {
  entry: {
    index: "./src/index.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
};
```

3、在 src 中创建一个使用第三方模块 lodash 的 async-module.js 文件，其内容如下：

```js
function getComponent() {
  return import("lodash").then(({ default: _ }) => {
    const element = document.createElement("div");
    element.innerHtml = _.join(["hello", "webpack"], " ");
    return element;
  });
}

getComponent().then((element) => {
  document.body.appendChild(element);
});
```

4、在入口 index.js 文件中引用 async-module.js：

```js
import "async-module.js";
```

5、如果在入口 index.js 文件中即引入了使用 import() 动态导入的 lodash，同时也使用了静态导入的 lodash 时，为了使这两种方式都生效，就需要在 webpack.config.js 中开启 splitChunks 的配置。

```js
module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

- 入口 index.js 文件内容如下：

```js
import _ from "lodash";
import "async-module.js";

console.log(_.join(["hello", "world", "-index"], " "));
```

> 使用上述配置，即可将 import() 动态导入的 lodash 和 index.js 中静态导入的 lodash 及 another.module.js 中导入的 lodash 共同打包到同一个 bundle 文件中。实现 lodash 的多方共享，同时也避免了重复打包。

#### 使用动态导入实现懒加载

1、懒加载或者按需加载，是一种很好的优化网页或应用的方式，这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码，如果你不触发，可能永远不会被加载。

2、创建一个 math.js 文件，在主页中通过点击按钮调用其中的函数：

```js
export const add = () => {
  return x + y;
};

export const minus = () => {
  return x - y;
};
```

3、编辑 index.js 文件：

```js
const button = document.createElement("button");
button.textContent = "点击进行加法运算";
button.addEventListener("click", () => {
  import(/* webpackChunkName: 'math' */ "./math.js").then(({ add }) => {
    console.log(add(2, 9));
  });
});
document.body.appendChild(button);
```

> 上述代码中的注释 `/* webpackChunkName: math */` 称之为 webpack 魔法注释，用来告诉 webpack 打包生成的文件名为 math，即该文件会单独打包到一个 bundle 中。文件名称为 math。该文件如果没有触发按钮，将永远不会被加载，可以从浏览器的 network 中进行验证。

#### 动态导入实现预加载/预获取模块

1、webpack v4.6.0+ 增加了对与获取和预加载的支持。在声明 import 时，使用下面这些内置指令就可以让 webpack 输出 "resource hint（资源提示）"，来告诉浏览器什么时候去加载该资源：

- prefetch（预获取）：将来某些导航下可能需要的资源。

- preload（预加载）：当前导航下可能需要的资源。

2、prefetch 的简单使用方式如下，编辑 index.js 文件：

```js
const button = document.createElement("button");
button.textContent = "点击进行加法运算";
button.addEventListener("click", () => {
  import(
    /* webpackChunkName: 'math', webpackPrefetch: true */ "./math.js"
  ).then(({ add }) => {
    console.log(add(2, 9));
  });
});
document.body.appendChild(button);
```

> 添加 `webpackPrefetch: true` 这句魔法注释用于告诉 webpack 执行预加载，这回生成 `<link rel="prefetch" href="math.js">` 并追加到页面头部，指示着浏览器在闲置的时候获取 math.js 文件。
> `webpackPreload: true` 功能效果类似于懒加载。

### 缓存

#### 缓存第三方库

1、将第三方库（如 lodash）提取到单独的 vendor chunk 文件中是比较推荐的做法，这是因为它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。

2、要缓存第三方库，我们需要在 optimization.splitChunks 添加如下 cacheGroups 参数：

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: 'all',
      }
    }
  }
},
```

#### 外部扩展

1、有时候为了减小 bundle 的体积，我们会把一些不变的第三方库使用 cdn 的方式引入，比如：jQuery，这个时候就可以使用 **externals** 属性实现。

2、externals 具体使用方式如下：

- 首先我们需要在入口 html 文件中使用 scripts 标签引入 jQuery。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>使用外部扩展</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
  </head>
  <body></body>
</html>
```

- 之后在 webpack 中配置 externals 属性：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "app.js",

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],

  externals: {
    jquery: "jQuery", // 或者配置成 jquery: "$",
  },
};
```

- 如果不想在入口 index.html 中使用 scripts 引入 jQuery 时，也可以在 externals 中引入，这时就需要将 externals 配置改为如下形式了：

```js
module.exports = {
  // ...
  externalsType: "script",
  externals: {
    jquery: ["https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js", "$"],
  },
};
```

> 在 externals 中引入第三方库时必须配置 **externalsType** 属性，用于告诉 webpack 引入的链接以 script 标签的形式放置到页面中。

- 最后就可以在 js 文件中快乐的使用 jQuery 了：

```js
import $ from "jquery";

console.log($);
```

### 项目基本打包配置

#### webpack.config.common.js

1、ebpack.config.common.js 为公共配置：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const toml = require("toml");
const yaml = require("yaml");
const json5 = require("json5");

module.exports = {
  entry: {
    index: "./src/index.js",
  },

  output: {
    path: path.resolve(__dirname, "../dist"),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-runtime"]],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[contenthash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
      {
        test: /\.(csv|tsv)$/,
        type: "csv-loader",
      },
      {
        test: /\.xml$/,
        type: "xml-loader",
      },
      {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/,
        type: "json",
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.jpg$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1204 * 1024,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
    }),

    new MiniCssExtractPlugin({
      filename: "styles[contenthash].css",
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};
```

#### webpack.config.dev.js

1、webpack.config.dev.js 为开发环境配置：

```js
module.exports = {
  output: {
    filename: "scripts/[name].[ext]",
  },

  devServer: {
    static: "./dist",
  },

  devtool: "inline-source-map",

  mode: "development",
};
```

#### webpack.config.prod.js

1、webpack.config.prod.js 为 生产环境配置：

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  output: {
    filename: "scripts/[name].[contenthash].[ext]",
    publicPath: "/",
  },

  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },

  mode: "production",

  // 告诉 webpack 在发现提示时关闭抛出错误或警告。
  performance: {
    hints: false,
  },
};
```

#### webpack.config.js

1、配置文件拆分好后，需要安装 **webpack-merge** 这个插件将公共配置与生产及开发环境配置都合并到 webpack.config.js 中：

```
npm i webpack-merge -D
```

2、具体配置如下：

```js
const { merge } = require("webpack-merge");

const commomConfig = require("./webpcak.config.commom");
const productionConfig = require("./webpcak.config.prod");
const developmentConfig = require("./webpcak.config.dev");

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commomConfig, developmentConfig);

    case env.production:
      return merge(commomConfig, productionConfig);

    default:
      return new Error("No matching configuration was found");
  }
};
```

#### package 脚本配置

```
{
  "scripts": {
    "start": "webpack serve -c ./config/webpack.config.js --env development"
    "build": "webpack -c ./config/webpack.config.js --env production"
  }
}
```

### 高级应用

#### source-map

1、source-map 用于将报错信息（bundle 错误的语句几其所在行列）映射到源码上，方便调试。

2、webpack 中的 devtool 一共提供了如下七种 SourceMap 模式：

- eval：每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 `//@sourceURL`。

- source-map：生成一个 SourceMap 文件。

- hidden-source-map：和 source-map 一样，但不会在 bundle 末尾追加注释。

- inline-source-map：生成一个 DataUrl 形式的 SourceMap 文件。

- eval-source-map：每个 module 会通过 eval() 来执行，并且生成一个 DataUrl 形式的 SourceMap。

- cheap-source-map：生成一个没有列信息（column-mappings）的 SourceMap 文件，不包含 loader 的 sourcemap（比如：babel 的 sourcemap）。

- cheap-module-source-map：生成一个没有列信息（column-mappings）的 SourceMap 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。

> 在开发环境中推荐使用 `cheap-module-source-map`，因为它既能单独的生成一个 map 文件，而且不会记录列数，从而减小的 map 的体积。

3、在生产环境一般不会开启 sourcemap 功能，主要有两点原因：

- 通过 bundle 和 sourcemap 文件，可以反编译出源码，也就是说，线上产物有 sourcemap 文件的话，就意味着有着暴露远嘛的风险。

- sourcemap 文件的体积相对比较巨大，这跟我们生产环境的追求不同（更小更轻量的 bundle）。

#### 在 webpack5 中使用 Web Works

1、Web Works 简介：

- Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用 XMLHttpRequest 执行 I/O (尽管 responseXML 和 channel 属性总是为空)。一旦创建， 一个 worker 可以将消息发送到创建它的 JavaScript 代码， 通过将消息发布到该代码指定的事件处理程序（反之亦然）。

2、创建 worker 的方式：

```js
new Worker(new URL('work.js', import.mata.url));
```

> 注意：第二个参数 `import.mata.url` 不能在 commonJs 中使用。

3、结合 webpack5 使用 Web Worker 的方式：

- 在 src 下创建 work.js 文件，内容如下：

```js
self.onmessage = (message) => {
  self.postMessage({
    answer: "dnhyxc",
  });
};
```

- 在入口 app.js 中引入 work.js 文件，具体如下：

```js
const worker = new Worker(new URL("./work.js", import.meta.url));

worker.postMessage({
  name: "What's your name?",
});

worker.onmessage = (message) => {
  console.log(message.data.answer);
};
```

- 在 webpack.config.js 中不需要设置任何编译 Web Worker 的设置，因为 webpack5 默认就支持了 Web Worker。

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "[name].[ext]",
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: "development",
};
```

- 只需要在 webpack.config.js 中配置如上设置之后，使用 webpack 进行编译就会在 dist 文件夹中出现一个 `src_work_js.js` 文件，这就说明了 webpack 已经默认帮我们做了一个额外的打包。

#### 打包多页面应用

1、打包多页面应用基本配置如下：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: {
      import: ["./src/app.js", "./src/app2.js"],
      dependOn: "lodash",
      filename: "page1/[name].js",
    },
    main2: {
      import: ["./src/app3.js"],
      dependOn: "lodash",
      filename: "page2/[name].js",
    },
    lodash: {
      import: "lodash",
      filename: "commom/[name].js",
    },
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  devtool: "inline-source-map",

  plugins: [
    new HtmlWebpackPlugin({
      title: "多页面打包",
      template: "./index.html",
      filename: "page1/index.html",
      chunks: ["main", "lodash"],
    }),

    new HtmlWebpackPlugin({
      title: "多页面打包",
      template: "./index2.html",
      filename: "page2/index2.html",
      chunks: ["main2", "lodash"],
    }),
  ],

  mode: "development",
};
```

#### pwa

1、我们可以通过搭建一个拥有更多基础特性的 server 来测试下离线体验，这里我们通过使用 **http-server** 这个第三方库来实现。

- 首先需要安装 http-server：

```
npm i http-server -D
```

- 之后修改 package.json 的 scripts 脚本，修改如下：

```json
{
  //...
  "scripts": "http-server dist"
}
```

2、注意：默认情况下，webpack devServer 会写入到内存中，我们需要启用 devserverdevmiddleware.writeToDisk 配置项，来让 http-server 处理 `./dist` 目录中的文件。

```js
devServer: {
  devMiddleware: {
    index: true;
    writeToDisk: true;
  }
}
```

> 如果之前没有操作过，首先需要运行命令 `npm run build` 来构建你的项目，然后运行命令 `npm start`。

3、添加 Workbox：

- 首先需要安装 workbox-webpack-plugin：

```
npm i workbox-webpack-plugin -D
```

- 之后修改 webpack.config.js 文件：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      clientsClaim: true,
      // 不允许遗留任何旧的 ServiceWorkers
      skipWaiting: true,
    }),
  ],
  mode: "development",
};
```

4、注册 Service Worker：

- 在 index.js 文件中通过如下代码进行注册 Service Worker：

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((registrationError) => {
        console.log("SW registered failed:", registrationError);
      });
  });
}
```

> 设置完以上配置之后，即使终止本地服务，照样能访问当前页面。现在你就可以愉快的进行离线访问了。这其实是在浏览器中缓存了当前页面，可以通过：`chrome://serviceworker-internals` 查看。当清除浏览器缓存时，就无法再访问了。

#### Shimming 预置依赖

1、Shimming 预置依赖就是在没有手动安装如 lodash 时，也可以在页面中使用 lodash。

2、要实现预置全局变量，需要使用 **ProvidePlugin** 插件（该插件不需要安装），使用 ProvidePlugin 后，能够在 webpack 编译的每个模块中，通过访问一个变量来获取一个 package。如果 webpack 看到模块中用到这个变量，它将在最终 bundle 中引入给定的 package。具体使用如下：

- src/index.js：

```js
console.log(_.join("hello", "word"), " ");
```

- webpack.config.js：

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.ProvidePlugin({
      _: "lodash",
    }),
  ],
  mode: "development",
};
```

> 以上配置从本质上来说，就是告诉 webpack，如果遇到了至少一处用到 `_` 变量的模块实例，那就自动将 lodash package 引入进来（无需开发者手动 npm install lodash），并将其提供给需要用到它的模块。这其实就是 webpack 自动将 lodash 引入，并打包到 main.js 中了。

#### 细粒度 Shimming

1、在一些遗留模块依赖中，this 指向的是 window 对象，我们可以调整 index.js 文件内容进行测试：

```js
this.alert("hello webpack");
```

> 如果不进行任何配置，使用 npx webpack serve 运行该模块时，将会报错。

2、之所以上述 index.js 模块运行报错，是因为它运行在 CommonJS 上下文中时，此时的 this 指向的是 module.exports。因此运行代码时，就会出现 `this.alert is not a function` 的报错。在这种情况下，我们可以通过 **imports-loader** 覆盖 this 指向，注意：需要安装 imports-loader 这个插件：

```
npm i imports-loader -D
```

- webpack.config.js 配置如下：

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: require.resolve("./src/index.js"),
        use: "imports-loader?wrapper=window",
      },
    ],
  },

  plugins: [new HtmlWebpackPlugin()],
  mode: "production",
};
```

> 通过上述配置之后就可以正常的访问 index.js 文件内容了。

#### 全局 Exports

1、假设某个 library 创建出一个全局变量，期望 consumer（使用者）使用这个变量。要实现这一需求，就需要借助 `exports-loader` 这个 loader 来实现：

```
npm i exports-loader -D
```

- src/global.js：

```js
const file = "example.txt";

const helpers = {
  test: function () {
    console.log("test something");
  },
  parse: function () {
    console.log("parse something");
  },
};
```

- webpack.config.js：

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: require.resolve("./src/global.js"),
        use: "exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse,multiple|helpers.test|test",
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: "development",
};
```

#### 加载 Polyfills

1、要加载 polfill，例如可以直接引入 **@babel/polyfill**，但是首先需要安装 @babel/polyfill：

```
npm i @babel/polyfill -D
```

- @babel/polyfill 是一个垫片，说白了就是可以通过这个插件将代码转换为低版本浏览器可以识别的代码。

2、@babel/polyfill 基本使用方式如下：

```js
import "@babel/polyfill";
console.log(Array.from([1, 2, 3], (x) => x + x));
```

- 说明：这种方式优先考虑正确性，而不考虑 bundle 体积大小。为了安全和可靠，polyfill/shim 必须运行在所有其它代码之前，而且需要同步加载，或者说，需要在所有 polyfill/shim 加载之后，再去加载所有应用程序代码，社区中存在许多误解，即现代浏览器"不需要"polyfill，或者 polyfill/shim 仅用于添加缺失功能。实际上，它们通常用于**修复损坏实现**（repair broken implementation），即使是在现代浏览器中，也会出现这种情况。因此，最佳的实践仍然是：不加选择地和同步加载所有 polyfill/shim，尽管这会导致额外的 bundle 体积成本。

#### 优化 Polyfills

1、正常是不建议使用 `import @babel/polyfill` 导入的。因为这样做会在全局引入整个 polyfill 包，比如 Array.from 会全局引入，不但包的体积大，而且还会污染全局环境。

2、**babel-preset-env** 插件通过 `browserslist` 来转译那些浏览器中不支持的特性。这个 preset 使用 **useBuiltIns** 选项，默认值是 false，这种方式可以将全局 babel-polyfill 导入，改进为更细颗粒度的 import 格式：

```js
import "core-js/modules/es7.string.pad-start";
import "core-js/modules/es7.string.pad-end";
import "core-js/modules/web.timers";
import "core-js/modules/web.immediate";
import "core-js/modules/web.dom.iterable";
```

- 安装 @babel/preset-env 及相关的包：

```
npm i babel-loader @babel/core @babel/preset-env core-js@3 -D
```

- webpack.config.js 相关配置如下：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: ["last 1 version", "> 1%"],
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },

  plugins: [new HtmlWebpackPlugin()],
  mode: "development",
};
```

#### library

1、library 可以用于打包一个 JavaScript 库（如 lodash 就是一个函数库）。打包好的库可以发布到 npm 上作为一个通用的库，具体配置如下：

- src/index.js 内容如下：

```js
export const add = (x, y) => {
  return x + y;
};
```

- webpack.config.js 配置如下：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    // library可以防止生产模式下，模块未使用而被tree shaking删除
    library: "mylib",
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: "production",
};
```

- 上述配置打包出来的 mylib 只能在 html 中以 script 引入使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Library</title>
  </head>
  <body>
    <script src="../dist/mylib.js"></script>
    <script>
      console.log(mylib.add(9, 2));
    </script>
  </body>
</html>
```

3、如果希望打包出来的库能兼容不同的环境，即用户能够通过以下方式使用打包后的库：

- CommonJS module require：

```js
const { mylib } = require("../dist/mylib");

if (mylib) {
  console.log(mylib.add(9, 2), "commonjs");
}
```

- AMD module require：

```js
require(["mylib"], function (webpackNumbers) {
  mylib.add(9, 2);
});
```

- script tag：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Library</title>
  </head>
  <body>
    <script src="../dist/mylib.js"></script>
    <script>
      console.log(mylib.add(9, 2));
    </script>
  </body>
</html>
```

3、要实现上述要求，需要更改 library 配置项，将其中的 **type** 属性行设置为：**umd**。

- var/window：仅支持 script 标签引入使用。

- commonjs：支持 commonjs 导入使用。

- amd：支持 AMD 导入使用。

- module：支持 ES6 import 导入使用。注意：webpack 5 中如果配置了 library.type 为 module 时，需要配置 `experiments.outputModule: true`，并且将 library.name 配置去除，否则将会报错。

- umd：支持所有方式的导入使用。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    // library可以防止生产模式下，模块未使用而被tree shaking删除
    library: {
      // 当配置了experiments时，不能设置name属性，否则会报错
      name: "mylib",
      // type 的值还可以是：var、window（等于var）、commonjs、module
      type: "umd",
    },
    // 处理commonjs中self未定义而报错的情况
    globalObject: "globalThis",
  },
  // 当library.type为module时需要配置如下属性，注意experiments属性现在为试运行阶段，慎用
  // experiments: {
  //   outputModule: true,
  // },
  mode: "production",
};
```

4、将打出来的 library 包发布到 npm：

- 首选需要检查当前的 npm 是否是 npm 官方的源地址，如果是淘宝源的话是无法发布到 npm 上的。

```json
// 检查当前npm源
npm get registry

// 切换为默认的官方源
npm config set registry https://registry.npmjs.org
```

- 如果没有 npm 账号的话，需要到 [npm 官网](https://www.npmjs.com/signup) 进行注册。

- 如果已有账号，直接运行如下命令发布即可：

```json
npm login // 输入 username => password => email => 邮箱收到的验证码

npm publish // 登录成功后即可运行publish进行发布了
```

5、将发布的包下载到本地使用：

- src/commonjs.js：

```js
// 在webpack中配置了全局变量，所以不需要导入包即可使用
console.log(mylib.add(222, 999), "使用全局变量引入");
```

- src/index.js：

```js
import { add } from "mylib_math_test";
import "./commonjs";

console.log(add(9, 2));
```

- webpack.config.js：

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    // 设置全局变量，在全局可以不导入mylib_math_test包的情况下，直接使用mylib访问到这个mylib_math_test包的内容
    new webpack.ProvidePlugin({
      mylib: "mylib_math_test",
    }),
  ],
  mode: "production",
  optimization: {
    splitChunks: {
      // minSize 默认值是20000，如果要分离的目标小于20000，则不会被分割，当前设置也就不生效了，因此需要指定minSize。
      minSize: 50,
      chunks: "all",
      name: "vendor",
    },
  },
};
```

- package.json：

```json
{
  "name": "mylib_test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve",
    "build": "rimraf dist && webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "html-webpack-plugin": "^5.5.0",
    "webpack": "^5.65.0",
    "webpack-cli": "^4.9.1",
    "webpack-dev-server": "^4.6.0"
  },
  "dependencies": {
    "mylib_math_test": "^1.0.0"
  }
}
```

### dll

#### dll 概述

1、dll 可以将不经常更改的第三方库（如：react、vue、jquery 等）单独进行打包，而且只会在项目第一次构建的时候打包一次，以后如果这些第三方库内容没有变更将不会再重新打包，从而提高了打包效率。

#### DllPlugin

1、DllPlugin 插件概述：

- 该插件能把第三方库代码分离开，并且每次文件更改的时候，它只会打包该项目自身的代码，所以打包速度会更快。

2、DllPlugin 插件参数说明：

- name：公开的 dll 函数的名称，和 output.library 保持一致。

- path：manifest.json 生成文件的位置和文件名称。

- context(可选)：manifest 文件中请求的上下文，默认为该 webpack 文件上下文。

3、该插件的具体使用方式如下：

- webpack.dll.config.js：

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: ["jquery", "lodash"],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "dll/manifest.json"),
    }),
  ],
};
```

#### DllReferencePlugin

1、DllReferencePlugin 插件概述：

- 该插件的作用是把 dll 打包生成的文件引用到 webpack.config.js 打包出的 mian.js 中。

> DllReferencePlugin 补充说明：在 webpack.dll.config.js 中打包后，会生成 main.js 文件和 manifest.json 文件，mian.js 文件包含所有的第三方库文件，manifest.json 文件会包含所有库代码的一个索引，当在使用 webpack.config.js 文件中使用 DllReferencePlugin 插件的时候，会使用该 DllReferencePlugin 插件读取 manifest.json 文件，看看是否有该第三方库。manifest.json 文件其实就是有一个第三方库的一个映射而已。

2、DllReferencePlugin 参数说明：

- manifest: 编译时的一个用于加载的 JSON 的 manifest 的绝对路径。

- name: dll 暴露的地方的名称（默认值为 manifest.name）。

- scope: dll 中内容的前缀。

- sourceType: dll 是如何暴露的 libraryTarget。

- context: manifest 文件中请求的上下文。

3、DllReferencePlugin 具体使用说明：

- webpack.config.js：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name][contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "./dll/manifest.json"),
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, "./dll/main.js"),
      publicPath: "./",
    }),
  ],
  devServer: {
    port: 9000,
  },
  mode: "production",
};
```

#### AddAssetHtmlPlugin

1、AddAssetHtmlPlugin 插件概述：

- 该插件可以将 dll 打包出的动态链接库自动的存放到 dist 文件夹，同时自动在打包出的 index.html 文件中引入 dll 打包出的动态链接库脚本。

2、要使用 AddAssetHtmlPlugin 需要安装 `add-asset-html-webpack-plugin`：

```
npm i add-asset-html-webpack-plugin -D
```

#### dll 完整配置

1、webpack.dll.config.js：

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: ["jquery", "lodash"],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "dll/manifest.json"),
    }),
  ],
};
```

2、webpack.config.js：

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name][contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "./dll/manifest.json"),
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, "./dll/main.js"),
      publicPath: "./",
    }),
  ],
  devServer: {
    port: 9000,
  },
  mode: "production",
};
```

### 模块联邦

#### 模块联邦概念

1、Webpack 5 增加了一个新的功能 "模块联邦"，它允许多个 webpack 构建一起工作。从运行时的角度来看，多个构建的模块将表现得像一个巨大的连接模块图。从开发者的角度来看，模块可以从指定的远程构建中导入，并以最小的限制来使用。即模块联邦可以将一个应用的包应用于另一个应用，同时具备整体应用一起打包的公共依赖抽取能力。

2、多个独立的构建可以组成一个应用程序，这些独立的构建之间不应该存在依赖关系，因此可以单独开发和部署它们。这通常被称作微前端，但并不仅限于此。

3、Webpack5 模块联邦让 Webpack 达到了线上 Runtime 的效果，让代码直接在项目间利用 CDN 直接共享，不再需要本地安装 Npm 包、构建再发布了。我们知道 Webpack 可以通过 DLL 或者 Externals 做代码共享时 Common Chunk，但不同应用和项目间这个任务就变得困难了，我们几乎无法在项目之间做到按需热插拔。

4、webpack 5 引入联邦模式是为了更好的共享代码。在此之前，我们共享代码一般用 npm 发包来解决。npm 发包需要经历构建，发布，引用三阶段，而联邦模块可以直接引用其他应用代码，实现热插拔效果。对比 npm 的方式更加简洁、快速、方便。

#### 模块联邦 API 说明

1、ModuleFederationPlugin：该插件是 webpack 自带的插件，可以从 `webpack.container` 中获取到。

2、ModuleFederationPlugin 插件属性：

- name：必传，且唯一，不可冲突。作为被依赖的 key 标志，依赖方使用方式 ${name}/${expose}。

- filename：构建后被依赖部分的入口文件名称。

- remotes：声明需要引用的远程应用。

- exposes：对外暴露 modules 模块，即当前应用对外暴露出的模块名。

- shared：声明共享的第三方依赖，当配置了这个属性时，webpack 在加载的时候会先判断本地应用是否存在对应的包，如果不存在，则加载远程应用的依赖包。例如：app1，它是一个远程应用，配置了 `["react", "react-dom"]` ，而它被 app2 所消费，所以 webpack 会先查找 app2 是否存在这两个包，如果不存在就使用 app1 中的自带包。如果 app2 里面同样申明了这两个参数时，由于 app2 是本地应用，所以会直接用 app2 的依赖。

#### 模块联邦的使用方式

1、nav 应用：

- nav/src/Header.js：

```js
const Header = () => {
  const header = document.createElement("h1");
  header.textContent = "Header";
  return header;
};

export default Header;
```

- nav/src/index.js：

```js
import Header from "./Header";

const div = document.createElement("div");
div.appendChild(Header());
document.body.appendChild(div);
```

- nav/webpack.config.js：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "nav",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Header": "./src/Header.js",
      },
      shared: {}, // shared: ["react", "react-dom"],
    }),
  ],
  devServer: {
    port: 9001,
  },
  mode: "production",
};
```

2、home 应用：

- home/src/HomeList.js：

```js
const HomeList = (num) => {
  let str = "<ul>";
  for (let i = 0; i < num; i++) {
    str += `<li>item${i}</li>`;
  }
  str += "</ul>";

  return str;
};

export default HomeList;
```

- home/index.js：

```js
import HomeList from "./HomeList";

import("nav/Header").then((Header) => {
  const div = document.createElement("div");
  div.appendChild(Header.default());
  document.body.appendChild(div);
  document.body.innerHTML += HomeList(5);
});
```

- home/webpack.config.js：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {
        nav: "nav@http://localhost:9001/remoteEntry.js",
      },
      exposes: {
        "./HomeList": "./src/HomeList.js",
      },
      shared: {},
    }),
  ],
  devServer: {
    port: 9000,
  },
  mode: "production",
};
```

3、search 应用：

- search/src/index.js：

```js
Promise.all([import("nav/Header"), import("home/HomeList")]).then(
  ([{ default: Header }, { default: HomeList }]) => {
    document.body.appendChild(Header());
    document.body.innerHTML += HomeList(3);
  }
);
```

- search/webpack.config.js：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "search",
      filename: "remoteEntry.js",
      remotes: {
        nav: "nav@http://localhost:9001/remoteEntry.js",
        home: "home@http://localhost:9000/remoteEntry.js",
      },
      exposes: {},
      shared: {},
    }),
  ],
  devServer: {
    port: 9002,
  },
  mode: "production",
};
```

### esLint

#### 配置 eslint

1、首先需要安装 eslint：

```
npm i eslint -D
```

2、在根目录下添加一个 `.eslintrc` 文件（或者 .eslintrc.json, .js 等）。或者使用 eslint 工具自动生成该文件：

```
npx eslint --init
```

3、eslint 配置文件里的配置项含义说明：

- env：指定脚本的运行环境。每种环境都有一组特定的的预定义全局变量。此处使用的 browser 预定义了浏览器环境中的全局变量，es6 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。

- globals：脚本在执行期间访问的额外的全局变量。也就是 env 中未预定义，但我们又需要使用的全局变量。

- extends：检测中使用的预定义的规则集合。

- rules：启用的规则及其各自的语法级别，会合并 extends 中的同名规则，定义冲突时优先级更高。

- parserOptions ESlint：允许你指定想要支持的 JS 语言选项，ecmaFeatures 是个对象，表示你想要使用的额外的语言特性，这里 jsx 代表启用 JSX。ecmaVersion 用来指定支持的 ECMAScript 版本。默认为 5，即仅支持 es5，你可以使用 6、7、8、9 或 10 来指定想要使用的 ECMAScript 版本。也可以使用年份命名的版本号指定为 2016（同 6），2016（同 7），2017（同 8），2018（同 9），2010（同 10）。上面的 env 中启用了 es6，自动设置了 ecmaVersion 解析器选项为 6，plugins 是一个 npm 包，通常输出 eslint 内部为定义的规则实现，rules 和 extends 中定义的规则，并不都在 eslint 内部中有实现，比如 extends 中的 `plugin: react/recommended`，其中定义了规则开关和等级，但是这些规则如何生效的逻辑实在其对应的插件 react/recommended 中实现的。

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0
  },
  "globals": {}
}
```

#### 结合 webpack 使用

1、结合 webpack 使用，首先需要安装如下 loader：

```
npm i eslint-loader -D
```

2、基本配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader", "eslint-loader"],
      },
    ],
  },

  devServer: {
    // 关闭浏览器上出现的页面报错覆盖层
    client: {
      overlay: false,
    },
  },
};
```

#### husky

1、使用 husky 可以在提交代码前进行 eslint 检查。

```
npm i husky -D
```

2、husky 的使用方式：安装好 husky 之后，需要执行如下命令：

```
npm set-script prepare "husky install"

npm run prepare

npx husky add .husky/pre-commit "npm test"
```

> 注意：执行 `npm set-script prepare "husky install"` 之前，必须要先使用 `git init` 创建 `.git` 文件，否则将会执行失败。

3、配置 package 脚本：

```json
{
  "scripts": {
    // ...
+   "prepare": "husky install",
+   "test": "npx eslint ./src"
  }
}
```

4、进行完以上步骤之后，husky 就已经配置完成了，此时可以执行 git commit 进行测试了。

### webpack 性能优化

#### 通用环境优化

1、将 loader 应用与最少数量的必要模块，即在不需要用到的地方尽量不去使用，如下代码就限制了 loader 的作用范围，只解析 src 下的 js 文件，这就提升了效率：

```js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
      },
    ],
  },
};
```

2、引导（bootstrap）：每个额外的 loader/plugin 都有其启动时间，尽量少的使用工具。

3、解析：通过以下步骤可以提高解析速度：

- 减少 `resolve.modules`、`resolve.extensions`、`resolve.mainFiles`、`resolve.descriptionFiles` 中条数数量，因为它们会增加文件体统的调用次数。

- 如果不需要使用 symlinks（例如 npm link 或 yarn link），可以设置 `resolve.symlinks: false`。

- 如果使用自定义 resolve plugin 规则（正则），但不需要指定 context 上下文，可以设置 `resolve.cacheWithContext: false`。

4、减小编译结果的整体大小，以提高构建性能。尽量保持 chunk 体积为最小状态，为实现这一目的，可以通过如下方法实现：

- 使用数量更少/体积更小的 library。

- 在多页面应用程序中使用 SplitChunksPlugin。

- 在多页面用用程序中使用 SplitChunksPlugin，并开启 async 模式。

- 移除未引用代码。

- 只编译当前正在开发的那些代码。

5、持久化缓存：

- 在 webpack 配置中使用 cache 选项，使用 package.json 中的 **postinstall** 清除缓存目录。

- 将 cache 类型设置为内存或者文件系统。memory 选项很简单，它告诉 webpack 在内存中存储缓存，不允许额外的配置：

```js
module.exports = {
  // ...
  cache: {
    type: "memory",
  },
};
```

6、使用 dll 为更改不频繁的代码生成单独的编译结果。这可以提高应用程序的编译速度，尽管它增加了构建过程的复杂度。

7、使用 worker 池（worker pool 多线程打包）。而要开启多线程打包，需要使用 `thread-loader`，该 loader 可以将非常消耗资源的 loader 分流给一个 worker pool，具体配置如下：

- 为 babel-loader 开启多线程：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_module/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "thread-loader",
            options: {
              workers: 2,
            },
          },
        ],
      },
    ],
  },
};
```

> 注意：不要使用过多的 worker，因为 Node.js 的 runtime 和 loader 都有启动开销，最小化 worker 和 main process（主进程）之间的模块传输。进程间通讯（IPC，inter process communication）是非常消耗资源的。因此只有当某个 loader 运算量很大，并且非常耗时的情况下，才去使用该 loader。

#### 开发环境优化

1、[增量编译](https://www.webpackjs.com/configuration/watch/)：

- 使用 webpack 的 watch mode（监听模式）。而不是使用其它工具来 watch 文件和调用 webpack。内置的 watch mode 会记录时间戳并将此信息传递给 compilation 以使缓存失效。

- 在某些配置环境中，watch mode 会回退到 poll mode（轮询模式）。监听许多文件会导致 CPU 大量负载。在这些情况下，可以使用 watchOptions.poll 来增加轮询的间隔时间。

2、在内存中编译：下面几个工具通过在内存中（而不是写入磁盘）编译和 serve 资源来提高性能：

- webpack-dev-server。

- webpack-hot-middleware。

- webpack-dev-middleware。

3、stats.toJson 加速：

- webpack 4 默认使用 stats.toJson() 输出大量数据，除非在增量步骤中做必要的统计，否则请避免获取 stats 对象的部分内容。

- webpack-dev-server 在 v3.1.3 以后的版本，包含一个重要的性能修复，即最小化每个增量构建步骤中，从 stats 对象获取的数据量。

4、devtool：需要注意的是，不同的 devtool 设置，会导致性能差异。

- evel：具有最好的性能，但是不能帮助你转义代码。

- 如果能接受稍差一些的 map 质量，可以使用 cheap-source-map 变体配置来提高性能。

- 使用 eval-source-map 变体配置进行增量编译。

- 在大多数情况下，最佳选择是 eval-cheap-module-source-map。

5、避免使用在生产环境中才用到的工具。某些 utility，plugin 和 loader 都只用于生产环境。例如在开发环境下使用 TerserPlugin 来压缩和代码是没有意义的。通常在开发环境下，应该排除以下这些工具：

- TerserPlugin。

- fullhash/chunkhash/contenthash。

- AggressiveSplittingPlugin。

- AggressiveMergingPlugin。

- ModuleConcatenationPlugin。

6、最小化 entry chunk：

- webpack 只会在文件系统中输出已经更新的 chunk，某些配置选项（HMR，output.chunkFilename 的 name/chunkhash/contenthash，fullhash）来说，除了对已经更新的 chunk 无效之外，对于 entry chunk 也不会失效。

- 确保在生成 extry chunk 时，尽量减少某体积以提高性能。下面的配置运行代码创建了一个额外的 chunk，所以它的生成代价较低：

```js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: true,
  },
};
```

7、避免额外的优化步骤：

- webpack 通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中且非常耗费性能：

```js
module.exports = {
  // ...
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunk: false,
  },
};
```

8、输出结果不携带路径信息：

- webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这回导致造成垃圾回收性能压力。在 option.output.pathinfo 设置中关闭：

```js
module.exports = {
  // ...
  output: {
    pathinfo: false,
  },
};
```

9、node.js 版本 8.9.10-9.11.1：

- node.js 版本 8.9.10-9.11.1 中 ES2015 Map 和 Set 实现，存在性能回退。而 webpack 大量地使用这些数据结构，因此这次回退也会影响编译时间。

- 说明：在 8.9.10-9.11.1 之前和之后的 node.js 版本不受影响。

9、typescript loader：

- 可以为 loader 传入 transpileOnly 选项，以缩短使用 ts-loader 时的构建时间。使用此选项，会关闭类型检查。如果要再次开启类型检查，就需要使用 ForkTsCheckerWebpackPlugin。使用此插件将检查过程移至单独的进程，可以加快 TS 的类型检查和 ESLint 插入的速度：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
```

#### 生产环境优化

1、不启用 SourceMap：source map 相当消耗资源，开发环境模式下不要设置 source map。
