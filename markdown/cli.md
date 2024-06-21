## 什么是脚手架？

脚手架（scaffolding）是一个项目模板，它可以帮助你快速构建一个新项目，它可以自动生成项目目录结构、文件、代码、配置等，大大减少了开发人员的工作量。常见的脚手架有：create-react-app、vue-cli 等。

## 为什么要使用脚手架？

1. 节省时间：使用脚手架可以大大减少开发人员创建新项目的时间，只需要运行一下脚手架命令，就可以快速生成一个完整的项目。

2. 统一风格：使用脚手架可以统一项目的风格，使得项目代码风格一致，降低代码维护成本。

3. 降低错误率：使用脚手架可以降低开发人员的错误率，因为脚手架已经帮你搭建好了项目的基本框架，你只需要专注于业务逻辑的实现。

## 脚手架需要具备哪些基本的功能？

1. 能够根据用户选择的模版快速生成项目目录结构。如：create-react-app 脚手架可以运行 `npx create-react-app my-app --template typescript` 命令，指定生成一个 TypeScript 项目。或者直接运行 `npx create-react-app my-app` 生成一个 JavaScript 项目。

2. 能够根据用户选择是否需要使用 mbox、eslint 等插件。

3. 可以根据用户选择是否需要自动安装依赖。

本文主要实现上述 3 个基本的功能，其它的功能可以根据实际情况动态扩展。

## 实现脚手架的第三方插件介绍

### [chalk](https://www.npmjs.com/package/chalk)

chalk 是一个用于在终端中输出颜色的库，可以用来给命令行输出加上颜色。

chalk 提供了一系列方法来设置文本的样式和颜色，包括：

- 文本颜色：.black, .red, .green, .yellow, .blue, .magenta, .cyan, .white, .gray, .grey。

- 背景颜色：.bgBlack, .bgRed, .bgGreen, .bgYellow, .bgBlue, .bgMagenta, .bgCyan, .bgWhite.

- 样式：.bold, .dim, .italic, .underline, .inverse, .strikethrough, .hidden, .visible.

结合上述属性，可以实现各种颜色的输出。基本使用方式如下：

```js
const chalk = require("chalk");

console.log(chalk.blue("Hello") + " World" + chalk.red("!")); // 打印出蓝色的 Hello，红色的感叹号
console.log(chalk.green.bold("Success!")); // 打印出绿色加粗的文字
console.log(chalk.keyword("orange")("Some orange text")); // 打印出橙色的文字
console.log(chalk.bgBlue("Blue background text")); // 打印出蓝色背景的文字
```

### [commander](https://www.npmjs.com/package/commander)

commander 是一个用于解析命令行参数的库，可以用来解析脚手架的命令行参数。

commander API 方法说明：

**.version(version, [optionFlags])**：设置命令行工具的版本号。

**.command(name)**：定义一个新的命令。

**.description(desc)**：给命令或选项设置描述信息。

**.option(flags, desc)**：定义一个选项，flags 是选项的标志，例如 -a, --all，desc 是选项的描述。

**.action(callback)**：定义命令的执行动作，callback 是一个函数，用于处理命令的逻辑。

**.on('--help', callback)**：在帮助信息中添加自定义内容，通常用于展示更详细的命令使用说明。

**.parse(argv)**：解析命令行参数，通常是 process.argv。

基本使用方式如下：

```js
const { program } = require("commander");

program
  .version("1.0.0")
  .description("一个示例命令行工具")
  .option("-t, --type <type>", "指定类型")
  .command("list")
  .description("显示列表")
  .action(() => {
    console.log("显示列表");
  });

program.parse(process.argv);
```

> 注意：`program.parse(process.argv)` 必须放在所有命令定义之后，否则会导致命令无法被解析。

### [inquirer](https://www.npmjs.com/package/inquirer)

inquirer 是一个用于创建交互式命令行的库，可以用来让用户选择脚手架的模版、是否使用插件、是否自动安装依赖等。

inquirer API 方法说明：

**.prompt(questions)**：创建一系列问题，questions 是数组，每一项是一个对象，包含 type、name、message、choices 等属性。

questions 参数说明：

- type：类型是 String，用于定义用户输入的类型，可以是以下之一：

  - input: 输入框，用户可以输入任意文本。

  - confirm: 确认框，用户可以回答是或否。

  - list: 列表选择框，用户从预定义的选项中选择一个。

  - rawlist: 与 'list' 类似，但是显示的是未格式化的选项列表。

  - expand: 可以展开选择的问题（如多选题）。

  - checkbox: 多选框，用户可以从预定义的选项中选择多个。

  - password: 密码输入框，输入内容会被隐藏。

- name：类型是 String，问题答案在最终返回的对象中会以此属性作为 key，用于标识问题的答案。

- message：类型是 String 或 Function，用于在终端中向用户显示的问题文本，可以是字符串或者一个函数，函数返回一个字符串作为问题文本。

- default：类型是类型: Any，用于设置问题的默认值，如果用户没有输入或选择任何值，则使用该值作为默认值。

- choices：类型是 Array 或 Function，用于提供给用户的选项列表，只适用于 list、rawlist、expand 和 checkbox 类型的问题。可以是一个静态的数组或者一个返回数组的函数。

- validate：类型是 Function，用于验证用户输入的函数，接受用户输入作为参数，返回 true 表示输入有效，返回字符串则表示输入无效，并将字符串作为错误消息显示给用户。

- filter：类型是 Function，用于对用户输入的值进行过滤的函数，可以修改输入值并返回新值。

- when：类型是 Boolean 或 Function，用于根据前一个问题的答案决定当前问题是否应该被提问。可以是一个布尔值或者返回布尔值的函数。

- pageSize：类型是 Number，仅在 list、rawlist、expand 和 checkbox 类型的问题中有效，用于设置列表分页的大小。

- prefix：类型是 String，仅在 expand 类型的问题中有效，用于定义一个前缀，显示在可展开选项前面。

- suffix：类型是 String，仅在 expand 类型问题中有效，定义一个后缀，显示在可展开选项后面。

- transformer：类型是 Function，用于对用户选择的选项进行转换，它接受用户选择的选项作为参数，并返回格式化后的字符串。

基本使用方式如下：

```js
const inquirer = require("inquirer");

// 定义问题数组
const questions = [
  {
    type: "input",
    name: "name",
    message: "请输入名称:",
    default: "dnhyxc",
    validate: (value) => {
      if (value.length) {
        return true;
      } else {
        return "请输入名称！";
      }
    },
  },
  {
    type: "list",
    name: "template",
    message: "请选择模版:",
    choices: ["base", "react", "vue"],
  },
];

// 启动问答会话
inquirer
  .prompt(questions)
  .then((answers) => {
    console.log("你的输入结果是:");
    console.log(answers);
  })
  .catch((error) => {
    console.error("交互过程中出现错误:", error);
  });
```

## [prompts](https://www.npmjs.com/package/prompts)

prompts 是一个用于创建交互式命令行界面的库。它支持多种类型的提示，包括文本输入、确认、选择、复选框等，非常适合于构建 CLI 工具或脚本。

prompts 参数是一个对象，常用的属性如下：

- type: 提示的类型。可以是 text、password、number、confirm、select、multiselect、autocomplete、date、list、toggle 等。

- name: 响应对象中的键名。

- message: 提示信息，显示给用户的问题。

- initial: 提示的初始值。

- choices: 选择项数组，仅用于 list 和 multiselect 等多选类型。

- validate: 一个函数，用于验证用户输入。如果输入有效，返回 true；否则返回错误消息字符串。

- format: 一个函数，用于格式化用户输入的值。

- onState: 一个函数，接受 state 对象作为参数，可以用于监听提示状态的变化。

- onRender: 一个函数，允许自定义渲染逻辑。

基本使用方式如下：

```js
const prompts = require("prompts");

(async () => {
  const questions = [
    {
      type: "text",
      name: "username",
      message: "What is your username?",
      validate: (value) => (value ? true : "Username is required"),
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
    },
    {
      type: "number",
      name: "age",
      message: "How old are you?",
      validate: (value) => (value > 0 ? true : "Age must be a positive number"),
    },
    {
      type: "select",
      name: "color",
      message: "Pick a color",
      choices: [
        { title: "Red", value: "red" },
        { title: "Green", value: "green" },
        { title: "Blue", value: "blue" },
      ],
      initial: 1,
    },
    {
      type: "multiselect",
      name: "hobbies",
      message: "Pick your hobbies",
      choices: [
        { title: "Reading", value: "reading" },
        { title: "Traveling", value: "traveling" },
        { title: "Cooking", value: "cooking" },
        { title: "Sports", value: "sports" },
      ],
      min: 1,
      max: 3,
      instructions: false,
    },
  ];

  const response = await prompts(questions);

  console.log(response);
})();
```

## 使用 pnpm monorepo 初始化项目

具体如何使用 pnpm monorepo 初始化项目，请参考这篇文章：[pnpm monorepo 搭建工具库](https://juejin.cn/post/7338268608324681747)。

通过上述《pnpm monorepo 搭建工具库》一文中，获取到 pnpm monorepo 模版，在该模版的基础上，进行一些简单的更改，用于开发脚手架。

## 初始化 cli 脚手架工具包

获取到 pnpm monorepo 模版之后，在该项目根目录下，执行以下命令初始化脚手架工具包：

```yaml
npm run create cli
```

执行完上述命令之后，就会在项目 `packages` 文件目录下生成 `cli` 文件目录。

## 修改 rollup 打包文件

修改 `packages/cli/rollup.config.js` 文件，将 `packageName` 改为自己的脚手架包名。

```js
import { defineConfig } from "rollup";
import { buildConfig } from "../../scripts/build-config.mjs";

// packageName 根据自己意愿进行更改
const configs = buildConfig({ packageName: "dnhyxc" });

export default defineConfig(configs);
```

由于我们需要将打包输出的文件直接放到 cli 项目根目录下，之所以要直接打包放到 cli 项目根目录下，是为了方便在 package.json 中配置 `bin` 脚本，以及 `files` 发布到 npm 的配置。因此，需要调整 `scripts/build-config.mjs` 文件的 `output` 配置，同时需要将内容更新为：

```js
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
// 解析cjs格式的包
import commonjs from "@rollup/plugin-commonjs";
// 处理json问题
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
// 压缩代码
import { terser } from "rollup-plugin-terser";
// 解决node_modules三方包找不到问题
import resolve from "@rollup/plugin-node-resolve";
import eslint from "@rollup/plugin-eslint";
// 配置别名
import alias from "@rollup/plugin-alias";
import { getPath } from "../utils/index.mjs";

// PACKAGE_NAME为子包中 rollup.config.js 中 buildConfig({ packageName: 'dnhyxc' }) 方法传递的 packageName，两边需要保持一致
const PACKAGE_NAME = "dnhyxc";

export const buildConfig = ({ packageName }) => {
  // 将包名转化为驼峰式命名，以便通过window.packageName访问
  packageName = packageName.replace(/-(\w)/g, (_, char) => char.toUpperCase());

  const output =
    packageName === PACKAGE_NAME
      ? [
          // 输出支持 commonjs 的包
          { file: "dnhyxc.cjs", format: "cjs" },
        ]
      : [
          // 输出支持 es6 语法的包
          { file: "dist/index.esm.js", format: "es" },
          // 输出支持 commonjs 的包
          { file: "dist/index.cjs", format: "cjs" },
          // 输出支持 umd 格式的包，以便通过 script 标签直接引用
          {
            format: "umd",
            file: "dist/index.js",
            name: packageName,
          },
        ];

  const baseConfig = [
    {
      input: "./index.ts",
      plugins: [
        typescript({
          tsconfig: getPath("../tsconfig.json"), // 导入本地ts配置
          extensions: [".ts", "tsx"],
        }), // typescript 转义
        json(),
        terser(),
        resolve(),
        commonjs(),
        babel({
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: "current",
                },
              },
            ],
          ],
          // 用于支持在类中使用类属性的新语法，当loose设置为true，代码被以赋值表达式的形式编译，否则，代码以Object.defineProperty来编译。
          plugins: [["@babel/plugin-proposal-class-properties"]],
          exclude: "node_modules/**",
        }),
        // 配置路径别名
        alias({
          entries: [{ find: "@", replacement: "../packages/cli/src" }],
        }),
        // 配置eslint
        eslint({
          throwOnError: true,
          throwOnWarning: true,
          include: ["packages/**"],
          exclude: ["node_modules/**", "dist/**"],
        }),
      ],
      output,
    },
  ];

  // 声明文件打包输出配置
  const declaration = {
    input: "./index.ts",
    plugins: [
      dts(),
      alias({
        entries: [{ find: "@", replacement: "./src" }],
      }),
    ],
    output: {
      format: "esm",
      file: "dist/index.d.ts",
    },
  };

  // 如果不是dnhyxc脚手架包，则添加声明文件打包配置
  if (packageName !== PACKAGE_NAME) {
    baseConfig.push(declaration);
  }

  return baseConfig;
};
```

> 注意：PACKAGE_NAME 为子包中 rollup.config.js 中 buildConfig({ packageName: 'dnhyxc' }) 方法传递的 packageName，如果更改了 rollup.config.js 中 buildConfig({ packageName: 'cli' }) 中的 packageName，则 PACKAGE_NAME 也需要跟着更改为 cli。

## 修改 package.json 文件

为了能在命令行中调用脚手架工具，需要将脚本或可执行文件注册为全局命令行工具，使其可以在命令行中直接调用而无需指定完整路径，因此要在 `package.json` 文件中增加 `bin` 脚本配置。

将 scripts 脚本的 `build` 命令修改为 `rimraf dist && vitest run && rollup -c rollup.config.js`。

同时将 `files` 属性修改为：`["dnhyxc.cjs", "src/template/**", "README.md"]`。

```json
{
  // ...
  "bin": {
    // dnhyxc 执行命令，即可在终端中运行 dnhyxc --help、dnhyxc list 等命令
    "dnhyxc": "dnhyxc.cjs" // dnhyxc.cjs 为 rollup 打包生成的脚手架可执行文件
  },
  "scripts": {
    "dev": "rollup -c rollup.config.js -w",
    "build": "rimraf dnhyxc.cjs && vitest run && rollup -c rollup.config.js",
    "test": "vitest run"
  },
  // 指定将脚手架发布到 npm 时，需要发布的文件
  "files": ["dnhyxc.cjs", "src/template/**", "README.md"]
  // ...
}
```

> 上述 files 配置中，特别需要注意，需要将模版也发到 npm 上，否则，脚手架工具包的使用者无法使用模版。

## 修改 test 测试文件

根据自己的脚手架需求，修改 `packages/cli/test/index.test.ts` 文件，添加自己的测试用例，这里我们只添加了一个简单的测试用例，用来测试脚手架是否能正常运行：

```js
import { describe, expect, it } from "vitest";
import { init } from "../src/init";

describe("init", () => {
  it("should test init", () => {
    expect(init);
  });
});
```

## 安装依赖

进入到 `packages/cli` 目录，安装 chalk、commander、fs-extra、inquirer、ora、prompts、@types/fs-extra、@types/inquirer、@types/prompts、vitest：

```yaml
pnpm i chalk commander fs-extra inquirer ora prompts

pnpm i @types/fs-extra @types/inquirer @types/prompts vitest -D
```

## 更新项目入口文件 `index.ts`

在文件开头增加 `#!/usr/bin/env node` 这行特殊注释，用来指定脚本文件使用 Node.js 来执行，使脚本文件可以直接在命令行中执行。具体内容如下：

```js
#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { Options, init } from "@/init";
import { templates } from "@/constants";
import { logs, checkProjectName, updateVersion } from "@/utils";
import pkg from "./package.json";

// 指定脚手架版本
program.version(updateVersion(pkg.version), "-v, --version");

// 指定脚手架命令行工具的名称为 'dnhyxc'，这个可以根据自己的喜好来更改
program
  .name("dnhyxc")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on("--help", () => {
    console.log(
      `\r\nRun ${chalk.cyan(
        "dnhyxc <command> --help"
      )} for detailed usage of given command\r\n`
    );
  });

// 定义了名为 'list' 的子命令。在命令行中，用户可以通过 dnhyxc list 来调用这个子命令。
program
  .command("list")
  .description("查看所有可用模板")
  .action(async () => {
    console.log(chalk.yellowBright(logs.star, "模板列表"));
    templates.forEach((project, index) => {
      console.log(
        logs.info,
        chalk.green(`(${index + 1}) <${project.name}>`),
        chalk.gray(`${project.desc}`)
      );
    });
  });

const programCreateCallback = async (name: string, option: Options) => {
  if (!checkProjectName(name)) {
    console.log(logs.error, "项目名称存在非法字符，请重新输入");
    return;
  }
  // init 方法初始化项目
  await init(name, option);
};

/**
 * 定义了名为 'create' 的子命令，同时需要指定一个必填参数 <app-name>，这个参数表示新项目的名称。
 * 在命令行中，用户可以通过 dnhyxc create xxx 来调用这个子命令。
 * 同时还能通过 -t 和 -f 来指定模板名称和是否强制覆盖本地同名项目。
 */
program
  .command("create <app-name>")
  .description("创建新项目")
  .option("-t, --template [template]", "输入模板名称创建项目")
  .option("-f, --force", "强制覆盖本地同名项目")
  .action(programCreateCallback);

program.parse(process.argv);
```

## 新建 `init.ts` 文件

在 `packages/cli` 目录下，新建 `init.ts` 文件，用于脚手架进行初始化项目，具体内容如下：

```js
import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
import chalk from 'chalk';
import { verifyFile, removeDir, logs, fileRename } from '@/utils';
import { renderTemplate } from '@/render';
import { install, manualInstall } from '@/install';

export interface Options {
  template: string;
  force: boolean;
}

interface Result {
  needsOverwrite: boolean;
  restoreProjectName: string;
  needsTypeScript: boolean;
  needsMbox: boolean;
  needsEslint: boolean;
  needsHusky: boolean;
  needsInstall: boolean;
}

// 根据收集到的信息初始化项目
export const init = async (name: string, option: Options) => {
  const { template, force } = option;

  // 收集到的用户选择的各个选项的值
  let result = {} as Result;
  // 项目名称
  let projectName = name;
  // 通过脚手架创建出的项目路径
  let projectPath: string = path.join(process.cwd(), projectName);

  try {
    // no: true, yes: false
    result = await prompts(
      [
        {
          name: 'projectName',
          type: projectName ? null : 'text',
          message: '项目名称:',
          initial: projectName,
          onState: (state) => (projectName = String(state.value).trim() || 'my-project')
        },
        {
          name: 'needsOverwrite',
          type: () => (!verifyFile(projectPath) || force ? null : 'toggle'),
          message: '存在相同文件夹是否强制覆盖？',
          initial: true,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'restoreProjectName',
          type: (prev) => (prev ? 'text' : null),
          message: '重新设置项目名称为:',
          initial: projectName + '_1',
          onState: (state) => (projectName = String(state.value).trim() || projectName + '_1')
        },
        {
          name: 'needsTypeScript',
          type: template ? null : 'toggle',
          message: '是否使用 typescript?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsMbox',
          type: 'toggle',
          message: '是否使用 mbox?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsEslint',
          type: 'toggle',
          message: '是否使用 eslint?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsHusky',
          type: 'toggle',
          message: '是否使用 husky?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsInstall',
          type: 'toggle',
          message: '是否自动安装依赖?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    process.exit(1);
  }

  const { needsOverwrite, restoreProjectName, needsTypeScript, needsMbox, needsEslint, needsHusky, needsInstall } =
    result;

  // 重新设置项目名称及路径
  if (restoreProjectName) {
    projectName = restoreProjectName;
    projectPath = path.join(process.cwd(), projectName);
  }

  // 项目已存在且选择强制覆盖
  if (!needsOverwrite && fs.existsSync(projectPath)) {
    await removeDir(projectPath);
  }
  // 项目已存在且未选择强制覆盖
  if (needsOverwrite && !restoreProjectName.trim()) {
    console.log(logs.info, chalk.yellowBright('项目名称冲突或有误，请修改项目名称后再试'));
    return;
  }

  // 根据用户选择的模板，将对应的文件拷贝到到项目目录下
  const render = (templateName: string) => {
    // 项目模板路径
    const templateDir = path.resolve(__dirname, `./src/template/${templateName}`);
    renderTemplate({ templateDir, projectPath, projectName });
  };

  // 取反表示选择的是 yes
  if ((!needsTypeScript && !template) || template === 'typescript') {
    render('typescript');
  } else {
    render('base');
  }

  // 判断是否使用 mbox，取反表示选择的是 yes
  if (!needsMbox) {
    // 判断是否使用ts
    if (!needsTypeScript) {
      render('config/mbox-ts');
    } else {
      render('config/mbox-js');
    }
  }

  // 判断是否使用 eslint，取反表示选择的是 yes
  if (!needsEslint) {
    render('config/eslint');
  }

  // 判断是否使用 husky，取反表示选择的是 yes
  if (!needsHusky) {
    render('config/husky');
  }

  // 将 pkg.json 重命名为 package.json
  const pkg = (await fileRename(projectPath, projectName)) as { [key: string]: any };

  // 是否自动安装依赖，取反表示选择的是 yes
  if (!needsInstall) {
    // 自动安装依赖
    await install(projectPath, projectName, pkg);
  } else {
    // 手动安装依赖
    manualInstall(projectPath, projectName, pkg);
  }
};
```

由上述代码可以看出，组建一个项目的原理就是根据用户选择的结果，比如用户如果选择了 typescript 模板，脚手架就会将 `src/template/typescript` 目录下的所有文件拷贝到项目目录下，假如用户还选择了需要使用 mbox，脚手架就会将 `src/template/config/mbox-ts` 目录下的所有文件拷贝到项目目录下。也就是说，脚手架会根据用户的选择，将对应的模版文件拷贝到项目目录下。这其实就是该脚手架的核心实现原理。

可以看到，上述还有一个 fileRename 的操作，这个操作是为了将模版(base/typscript)中拷贝到项目目录下的 `pkg.json` 文件重命名为 `package.json`。之所以要将所有模版目录下的 `package.json` 命名为 `pkg.json`，是为了防止项目通过 `npm link` 时，导致项目根目录下的 `node_modules` 被污染，从而导致项目无法进行打包，以及 eslint 无法正常工作等问题。fileRename 具体内容如下：

```js
// 文件重命名
const fileRename = (projectPath: string, projectName: string) => {
  return new Promise((resolve) => {
    const filePath = path.join(projectPath, PKG);
    if (verifyFile(filePath)) {
      try {
        const pkgs = fs.readFileSync(`${projectPath}/${PKG}`, "utf8");
        const pkg = pkgs && JSON.parse(pkgs);
        pkg.name = projectName;
        pkg.version = "0.0.0";
        fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
        fs.renameSync(filePath, path.join(projectPath, PACKAGE));
        resolve(pkg);
      } catch (error) {
        console.log(logs.error, chalk.red(error));
        process.exit(1);
      }
    } else {
      console.log(logs.error, chalk.red("文件不存在"));
    }
  });
};
```

## renderTemplate 方法

在 `src/render/index.ts` 中定义 `renderTemplate` 方法，该方法的主要作用就是用于将模板文件拷贝到项目目录下，具体实现如下：

```js
import path from "path";
import fs from "fs";
import { PKG } from "@/constants";
import { deepMergePkg, dependenciesSort, verifyFile } from "@/utils";

interface RenderTemplateParams {
  templateDir: string; // 模板路径
  projectPath: string; // 项目路径
  projectName: string; // 项目名称
}

export const renderTemplate = ({
  templateDir,
  projectPath,
  projectName,
}: RenderTemplateParams) => {
  const stats = fs.statSync(templateDir);

  // 判断是否是文件夹
  if (stats.isDirectory()) {
    // 如果是 node_modules 不创建
    if (path.basename(templateDir) === "node_modules") return;

    // 递归创建 projectPath 的子目录和文件
    fs.mkdirSync(projectPath, { recursive: true });
    for (const file of fs.readdirSync(templateDir)) {
      renderTemplate({
        templateDir: path.resolve(templateDir, file),
        projectPath: path.resolve(projectPath, file),
        projectName,
      });
    }
    return;
  }

  if (path.basename(templateDir) === PKG && verifyFile(projectPath)) {
    // 已经设置好的 package 内容
    const existedPackage = JSON.parse(fs.readFileSync(projectPath, "utf8"));
    // 需要合并进入的新的 package 内容
    const newPackage = JSON.parse(fs.readFileSync(templateDir, "utf8"));
    // deepMerge 重新给 package.json 赋值，并且进行排序
    const pkg = dependenciesSort(deepMergePkg(existedPackage, newPackage));
    fs.writeFileSync(projectPath, JSON.stringify(pkg, null, 2) + "\n");
    return;
  }

  fs.copyFileSync(templateDir, projectPath);
};
```

## 总结

上述内容主要介绍了一些搭建脚手架的重要方法，由此可以看出，脚手架初始化项目的过程就是收集用户的选择，然后根据收集到的信息初始化项目。核心实现原理就是根据用户的选择，将事先放在 `src/template` 目录下对应的模版文件拷贝到项目目录下。

如果需要扩展新的模版，只需要在 `src/template` 目录下新增一个对应的模版文件夹目录即可。

当然你也可以将模版放到 github 仓库中，然后通过 [download-git-repo](https://www.npmjs.com/package/download-git-repo) 这个库将仓库中的模版下载到本地即可。

## 项目源码

[dnhyxc-tools](https://github.com/dnhyxc/dnhyxc-tools/tree/master)
