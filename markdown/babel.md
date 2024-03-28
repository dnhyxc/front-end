### @babel/types

desc: 读完本文，你将清楚的了解 @babel/types、@babel/parser 的作用以及其常用 API 的使用。

#### @babel/types 的作用

[@babel/types](https://babel.nodejs.cn/docs/babel-types/#numericliteral) 是 Babel 中的一个模块，用于创建、操作和检查 AST（抽象语法树）节点。它提供了一系列的方法和类型定义，用于构建和处理 JavaScript 代码的 AST。

#### 安装

```
npm install @babel/types -D
```

### @babel/types 常用 API

#### variableDeclaration

主要用于创建变量声明节点，它接受两个参数：kind：表示声明的类型，可以是 `var`、`let` 或 `const`。declarations：一个包含变量声明器的数组。

使用示例：

```js
// 创建一个标识符节点，表示变量名
const identifierNode = t.identifier("myVariable");
// 创建一个字面量节点，表示变量的初始值
const valueNode = t.numericLiteral(42);
// 创建一个变量声明节点，并指定声明类型为 "var"，并包含一个变量声明器
const declarationVarNode = t.variableDeclaration("var", [
  t.variableDeclarator(identifierNode, valueNode),
]);
// 创建一个变量声明节点，并指定声明类型为 "let"，并包含一个变量声明器
const declarationLetNode = t.variableDeclaration("let", [
  t.variableDeclarator(identifierNode, valueNode),
]);
// 创建一个变量声明节点，并指定声明类型为 "const"，并包含一个变量声明器
const declarationConstNode = t.variableDeclaration("const", [
  t.variableDeclarator(identifierNode, valueNode),
]);
const declarationVarNode = declarationVarNode;
const declarationLetNode = declarationLetNode;
const declarationConstNode = declarationConstNode;
```

输出为：

```json
{
  "declarationVarNode": {
    "type": "VariableDeclaration",
    "kind": "var",
    "declarations": [
      {
        "type": "VariableDeclarator",
        "id": { "type": "Identifier", "name": "myVariable" },
        "init": { "type": "NumericLiteral", "value": 29 }
      }
    ]
  },

  "declarationLetNode": {
    "type": "VariableDeclaration",
    "kind": "let",
    "declarations": [
      {
        "type": "VariableDeclarator",
        "id": { "type": "Identifier", "name": "myVariable" },
        "init": { "type": "NumericLiteral", "value": 29 }
      }
    ]
  },

  "declarationConstNode": {
    "type": "VariableDeclaration",
    "kind": "const",
    "declarations": [
      {
        "type": "VariableDeclarator",
        "id": { "type": "Identifier", "name": "myVariable" },
        "init": { "type": "NumericLiteral", "value": 29 }
      }
    ]
  }
}
```

等价于：

```js
var myVariable = 29;
let myVariable = 29;
const myVariable = 29;
```

#### identifier

用于创建一个标识符节点。常用于表示**变量**、**函数名**、**属性名**以及诸如**赋值**、**函数调用**等语句中所引用的标识符。

使用示例：

```js
const t = require("@babel/types");

const identifierNode = t.identifier("nodeName");
```

输出为：

```json
{
  "type": "Identifier",
  "name": "nodeName"
}
```

等价于创建了一个 `nodeName`，它与字符串类型的 'nodeName' 是有区别的，因为 `nodeName` 是一个变量。

> 说明：下文中的 `t.xxx` 中的 `t` 都代表上述导入的 `@babel/types`。

#### stringLiteral

主要用于创建一个字符串字面量节点。

使用示例：

```js
const stringLiteralNode = t.stringLiteral("Hello, World!");
```

输出为：

```json
{
  "type": "StringLiteral",
  "value": "Hello, World!"
}
```

等价于创建了一个字符串 `"Hello, World!"`。

#### numericLiteral

主要用于创建一个数值字面量节点。

使用示例：

```js
const numericLiteralNode = t.numericLiteral(902);
```

输出为：

```json
{
  "type": "NumericLiteral",
  "value": 902
}
```

等价于创建了一个数字 `902`。

#### booleanLiteral

主要用于创建一个布尔字面量节点。

使用示例：

```js
const booleanLiteralNode = t.booleanLiteral(true);
```

输出为：

```json
{
  "type": "BooleanLiteral",
  "value": true
}
```

等价于创建了一个布尔类型的 `true`。

#### nullLiteral

主要用于创建一个空字面量节点（null）。

使用示例：

```js
const nullLiteralNode = t.nullLiteral();
```

输出为：

```json
{
  "type": "NullLiteral"
}
```

等价于创建了一个 `null`。

#### objectProperty

主要用于创建对象字面量中的键值对节点，接受 `key`、`value` 两个参数，分别表示属性的键和值。

使用示例：

```js
const key = t.identifier("name");
const value = t.stringLiteral("dnhyxc");
const objectPropertyNode = t.objectProperty(key, value);
```

输出为：

```json
{
  "type": "ObjectProperty",
  "key": { "type": "Identifier", "name": "name" },
  "value": { "type": "StringLiteral", "value": "dnhyxc" },
  "computed": false,
  "shorthand": false,
  "decorators": null
}
```

等价于创建了一个 `name: "dnhyxc"` 的键值对。

#### objectExpression

主要用于创建一个对象表达式节点，接受一个数组类型的参数 properties，表示对象的属性。对象的属性可以是键值对，其中键通常是标识符或字符串字面量，值可以是任何有效的 AST 节点。

使用示例：

```js
const properties = [
  t.objectProperty(t.identifier("name"), t.stringLiteral("dnhyxc")),
  t.objectProperty(t.identifier("age"), t.numericLiteral(18)),
];
const objectExpressionNode = t.objectExpression(properties);
```

输出为：

```json
{
  "type": "ObjectExpression",
  "properties": [
    {
      "type": "ObjectProperty",
      "key": { "type": "Identifier", "name": "name" },
      "value": { "type": "StringLiteral", "value": "dnhyxc" },
      "computed": false,
      "shorthand": false,
      "decorators": null
    },
    {
      "type": "ObjectProperty",
      "key": { "type": "Identifier", "name": "age" },
      "value": { "type": "NumericLiteral", "value": 18 },
      "computed": false,
      "shorthand": false,
      "decorators": null
    }
  ]
}
```

等价于创建了一个 `{name: "dnhyxc", age: 18}` 的对象。

#### arrayExpression

主要用于创建一个数组表达式节点。接受一个数组类型的参数 elements，表示数组的元素。元素可以是任何有效的 AST 节点，包括**字面量**、**标识符**、**对象表达式**等。

使用示例：

```js
const elements = [
  t.stringLiteral("dnhyxc"),
  t.numericLiteral(18),
  t.booleanLiteral(true),
  t.identifier("y"),
  t.identifier("x"),
  t.identifier("c"),
  t.objectExpression([
    t.objectProperty(t.identifier("name"), t.stringLiteral("dnhyxc")),
    t.objectProperty(t.identifier("age"), t.numericLiteral(18)),
  ]),
];
nodeList.arrayExpressionNode = t.arrayExpression(elements);
```

输出为：

```json
{
  "type": "ArrayExpression",
  "elements": [
    { "type": "StringLiteral", "value": "dnhyxc" },
    { "type": "NumericLiteral", "value": 18 },
    { "type": "BooleanLiteral", "value": true },
    {
      "type": "ObjectExpression",
      "properties": [
        {
          "type": "ObjectProperty",
          "key": { "type": "Identifier", "name": "name" },
          "value": { "type": "StringLiteral", "value": "dnhyxc" },
          "computed": false,
          "shorthand": false,
          "decorators": null
        },
        {
          "type": "ObjectProperty",
          "key": { "type": "Identifier", "name": "age" },
          "value": { "type": "NumericLiteral", "value": 18 },
          "computed": false,
          "shorthand": false,
          "decorators": null
        }
      ]
    },
    { "type": "Identifier", "name": "y" },
    { "type": "Identifier", "name": "x" },
    { "type": "Identifier", "name": "c" }
  ]
}
```

等价于创建了一个 `[["dnhyxc", 18, true, { name: "dnhyxc", age: 18, }, y, x, c]]` 数组。注意：y, x, c 并不一定是字符串，它们是一个变量。

#### arrayPattern

主要用于创建一个数组模式节点。它接受一个数组类型的参数 elements，表示数组模式的元素。数组模式指定了在**解构赋值**或**函数参数**中如何匹配和处理数组的元素。

注意：arrayPattern 只能接受通过 `identifier` 创建的节点。

使用示例：

```js
const patternElements = [
  t.identifier("y"),
  t.identifier("x"),
  t.identifier("c"),
];
nodeList.arrayPatternNode = t.arrayPattern(patternElements);
```

输出为：

```json
{
  "type": "ArrayPattern",
  "elements": [
    { "type": "Identifier", "name": "y" },
    { "type": "Identifier", "name": "x" },
    { "type": "Identifier", "name": "c" }
  ]
}
```

等价于创建了三个变量 `x`、`y`、`z`。

#### arrayPattern 与 arrayExpression 的区别

arrayPattern 和 arrayExpression 是 JavaScript 中两个不同的语法结构，用于在不同的上下文中表示数组。

1. arrayPattern 用于**解构赋值**或**函数参数列表**中的模式匹配。它通常用于从数组或类似数组的对象中提取值并赋给变量。例如：

```js
const [x, y, z] = [1, 2, 3];
```

在上述代码中，`[x, y, z]` 就是一个 `arrayPattern`，用于将数组 [1, 2, 3] 解构赋值给变量 x、y、z。

2. arrayExpression 是用于**创建数组字面量**的语法，用于表示一个具体的数组值。例如：

```js
const numbers = [1, 2, 3];
```

在上述代码中，`[1, 2, 3]` 就是一个 `arrayExpression`，表示一个包含数字 1、2、3 的数组。

总结：两者的本质区别在于 `arrayPattern` 用于解构和模式匹配，而 `arrayExpression` 用于创建具体的数组值。

#### expressionStatement

主要用于创建一个函数表达式的节点。它包含了函数的标识符（如果有）、参数列表、函数体以及函数是否是异步的标志位。如果想创建一个匿名函数，可以将该方法的第一个参数赋值为 `null`。

使用示例一：

```js
const logStatement = t.expressionStatement(
  // 创建函数体内的 console.log 语句节点
  t.callExpression(
    t.memberExpression(t.identifier("console"), t.identifier("log")),
    [t.identifier("username")]
  )
);
// 创建函数体，包含 logStatement
const body = t.blockStatement([logStatement]);
// 创建函数表达式节点
const printUsernameFunction = t.functionExpression(
  // 函数标识符（函数名），如果想创建一个匿名函数，该参数可以传 null
  t.identifier("myFunction"),
  // 函数参数为 username
  [t.identifier("username")],
  // 函数体
  body,
  // 标识是不是异步函数，fasle 表示不是异步函数
  false
);
```

输出为：

```json
{
  "type": "FunctionExpression",
  "id": { "type": "Identifier", "name": "myFunction" },
  "params": [{ "type": "Identifier", "name": "username" }],
  "body": {
    "type": "BlockStatement",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "object": { "type": "Identifier", "name": "console" },
            "property": { "type": "Identifier", "name": "log" },
            "computed": false,
            "optional": null
          },
          "arguments": [{ "type": "Identifier", "name": "username" }]
        }
      }
    ],
    "directives": []
  },
  "generator": false,
  "async": false
}
```

等价于：

```js
function myFunction(username) {
  console.log(username);
}
```

使用实例二：

```js
// 创建函数的标识符节点
const functionId = t.identifier("myFunction");

// 创建函数的参数节点
const param = t.identifier("username");
const params = [param];

// 创建赋值表达式节点 count
const left = t.identifier("count");
// 创建二元表达式节点 2 + 9
const right = t.binaryExpression("+", t.numericLiteral(2), t.numericLiteral(9));
// 创建赋值表达式节点的，第一个参数可以是：=、+=、-=、*= 等等
const assignmentExpression = t.assignmentExpression("=", left, right);

// 创建 console.log; 的调用表达式节点
const mycallee = t.memberExpression(
  t.identifier("console"),
  t.identifier("log")
);
const argument = t.identifier("username");
// 创建函数调用表达式节点 console.log(username);
const callExpression = t.callExpression(mycallee, [argument]);

// 创建返回语句节点 return count;
const returnStatement = t.returnStatement(t.identifier("count"));

// 创建函数体的表达式语句节点数组
const mybody = [
  t.expressionStatement(assignmentExpression),
  t.expressionStatement(callExpression),
  returnStatement,
];

// 创建函数体的语句块节点
const blockStatement = t.blockStatement(mybody);

// 创建函数表达式节点
const functionExpression = t.functionExpression(
  functionId,
  params,
  blockStatement
);
```

输出为：

```json
{
  "type": "FunctionExpression",
  "id": { "type": "Identifier", "name": "myFunction" },
  "params": [{ "type": "Identifier", "name": "username" }],
  "body": {
    "type": "BlockStatement",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": { "type": "Identifier", "name": "count" },
          "right": {
            "type": "BinaryExpression",
            "operator": "+",
            "left": { "type": "NumericLiteral", "value": 2 },
            "right": { "type": "NumericLiteral", "value": 9 }
          }
        }
      },
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "object": { "type": "Identifier", "name": "console" },
            "property": { "type": "Identifier", "name": "log" },
            "computed": false,
            "optional": null
          },
          "arguments": [{ "type": "Identifier", "name": "username" }]
        }
      },
      {
        "type": "ReturnStatement",
        "argument": { "type": "Identifier", "name": "count" }
      }
    ],
    "directives": []
  },
  "generator": false,
  "async": false
}
```

等价于：

```js
function myFunction(username) {
  const count = 2 + 9;
  console.log(username);
  return count;
}
```

#### isIdentifier(node, opts)

用于判断给定的节点是否为一个标识符（Identifier），其中 `opts` 是可选参数，可以是一个字符串或一个配置对象，用于进一步指定判断条件。

> 说明：下述所有 API 中的 `opts` 参数都与上述一致。

使用示例：

```js
const t = require("@babel/types");

const isIdentifier = t.identifier("myVariable");
const notIdentifier = t.numericLiteral(29);

console.log(t.isIdentifier(isIdentifier)); // true
console.log(t.isIdentifier(notIdentifier)); // false
```

#### isLiteral(node, opts)

用于判断给定的节点是否为一个字面量（Literal）。

使用示例：

```js
const number = t.numericLiteral(29);
const identifier = t.identifier("dnhyxc");
const string = t.stringLiteral("Hello, World!");
const boolean = t.booleanLiteral(true);
const nnull = t.nullLiteral();
const binary = t.binaryExpression(
  "+",
  t.numericLiteral(2),
  t.numericLiteral(3)
);
const elements = [
  t.stringLiteral("dnhyxc"),
  t.numericLiteral(18),
  t.booleanLiteral(true),
  t.objectExpression([
    t.objectProperty(t.identifier("name"), t.stringLiteral("dnhyxc")),
    t.objectProperty(t.identifier("age"), t.numericLiteral(18)),
  ]),
  t.identifier("y"),
  t.identifier("x"),
  t.identifier("c"),
];
const arrayExpressionNode = t.arrayExpression(elements);

console.log(t.isLiteral(number)); // true
console.log(t.isLiteral(identifier)); // false
console.log(t.isLiteral(string)); // true
console.log(t.isLiteral(boolean)); // true
console.log(t.isLiteral(nnull)); // true
console.log(t.isLiteral(binary)); // false
console.log(t.isLiteral(arrayExpressionNode)); // false
```

#### isNumericLiteral(node, opts)

用于判断给定的节点是否为一个数字字面量（NumericLiteral）。

使用示例：

```js
const isNumericLiteral = t.numericLiteral(29);
const notNumericLiteral = t.stringLiteral("29");

console.log(t.isNumericLiteral(isNumericLiteral)); // true
console.log(t.isNumericLiteral(notNumericLiteral)); // false
```

#### isStringLiteral(node, opts)

用于判断给定的节点是否为一个字符串字面量（StringLiteral）。

使用示例：

```js
const isStringLiteral = t.stringLiteral("dnhyxc");
const isTplStringLiteral = t.stringLiteral(`dnhyxc`);
const notStringLiteral = t.numericLiteral(29);

console.log(t.isStringLiteral(isStringLiteral)); // true
console.log(t.isStringLiteral(isTplStringLiteral)); // true
console.log(t.isStringLiteral(notStringLiteral)); // false
```

#### isNullLiteral(node, opts)

用于判断给定的节点是否为一个空值字面量（NullLiteral）。

使用示例：

```js
const isNullLiteral = t.nullLiteral();

console.log(t.isNullLiteral(isNullLiteral)); // true
```

#### isBooleanLiteral(node, opts)

用于判断给定的节点是否为一个布尔字面量（BooleanLiteral）。

使用示例：

```js
const isTrueBooleanLiteral = t.booleanLiteral(true);
const isFalseBooleanLiteral = t.booleanLiteral(false);

console.log(t.isBooleanLiteral(isTrueBooleanLiteral)); // true
console.log(t.isBooleanLiteral(isFalseBooleanLiteral)); // true
```

#### isArrayPattern(node, opts)

用于判断给定的节点是否为一个数组模式（ArrayPattern）。

使用示例：

```js
const isArrayPattern = t.arrayPattern([t.identifier("a"), t.identifier("b")]);

const elements = [
  t.stringLiteral("dnhyxc"),
  t.numericLiteral(18),
  t.booleanLiteral(true),
  t.objectExpression([
    t.objectProperty(t.identifier("name"), t.stringLiteral("dnhyxc")),
    t.objectProperty(t.identifier("age"), t.numericLiteral(18)),
  ]),
];
const arrayExpressionNode = t.arrayExpression(elements);

console.log(t.isArrayPattern(isArrayPattern)); // true
console.log(t.isArrayPattern(arrayExpressionNode)); // false
```

#### isObjectExpression(node, opts)

用于判断给定的节点是否为一个布尔字面量（BooleanLiteral）。

使用示例：

```js
const isObjectExpression = t.objectExpression([
  t.objectProperty(t.identifier("key1"), t.stringLiteral("value1")),
  t.objectProperty(t.identifier("key2"), t.stringLiteral("value2")),
]);
const notObjectExpression = t.identifier("dnhyxc");

console.log(t.isObjectExpression(isObjectExpression)); // true
console.log(t.isObjectExpression(notObjectExpression)); // false
```

#### isFunction(node, opts)

用于判断给定的节点是否为函数类型（FunctionDeclaration）。

使用示例：

```js
const isFunctionDeclaration = t.functionDeclaration(
  t.identifier("add"),
  [t.identifier("a"), t.identifier("b")],
  t.blockStatement([
    t.returnStatement(
      t.binaryExpression("+", t.identifier("a"), t.identifier("b"))
    ),
  ])
);
const notFunctionDeclaration = t.identifier("x");

console.log(t.isFunction(isFunctionDeclaration)); // true
console.log(t.isFunction(notFunctionDeclaration)); // false
```

#### cloneNode(node)

用于克隆给定节点，并返回一个相同类型和属性的新节点。可以使用该方法创建一个完全相同的节点副本。

使用示例：

```js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

const code = `function add(a, b) {
  console.log(a, b);
  return a + b;
}`;

// 将源代码解析为 AST 树
const ast = parser.parse(code);

// 删除注释的访问者
const visitor = {
  enter(path) {
    const { node } = path;
    // 判断是否是 function
    if (types.isFunctionDeclaration(node)) {
      // clone 节点
      const cloneNode = types.cloneNode(node);
      const { code: modifiedCode } = generator(cloneNode);
      console.log(modifiedCode);
      /**
       * function add(a, b) {
       *   console.log(a, b);
       *   return a + b;
       * }
       */
    }
  },
};

// 遍历 AST 树并删除注释
traverse(ast, visitor);
```

### @babel/parser

#### @babel/parser 的作用

@babel/parser 是 Babel 提供的 JavaScript 解析器。可用于将 JavaScript 代码解析成 AST 抽象语法树的形式。

#### 安装

```
npm install @babel/parser -D
```

### @babel/parser 常用 API

#### babelParser.parse(code, [options])

babelParser.parse(code, [options]) 是一个用于解析 JavaScript 代码并生成 AST 抽象语法树的方法。

babelParser.parse(code, [options]) 参数说明：

1. code：要解析的 JavaScript 代码，注意该参数是**字符串形式**。

2. options：可选参数，是一个对象形式参数。用于指定解析器的配置选项。

- sourceType：指定代码的类型， 可以是 "script"、"module" 或 "unambiguous" 之一。 默认为 "script"。 "unambiguous" 将使@babel/parser 尝试根据 ES6 import 或 export 语句的存在进行猜测。 具有 ES6 import 和 export 的文件被视为 "module"，否则为 "script"。

- plugins：一个数组，指定要使用的 Babel 插件。这些插件可以支持解析更高级的语法特性，如 JSX、TypeScript 等。默认为空数组。

#### 使用示例

```js
const babelParser = require("@babel/parser");

const code = `function add(a: number, b: number):number {
  console.log(a, b);
  return a + b;
}`;

const ast = babelParser.parse(code, {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});

console.log(ast);
```

注意：如果需要解析 `JSX`、`TypeScript`，需要先安装 `@babel/plugin-syntax-jsx`、`@babel/preset-typescript` 这两个插件。否则将无法成功解析。

### @babel/generator

#### @babel/generator 的作用

@babel/generator 是 Babel 提供的一个包，用于将 AST 抽象语法树转换回 JavaScript 代码的字符串形式。

#### 安装

```
npm install @babel/generator -D
```

### @babel/generator 常用 API

#### babelGenerator.default(ast, options, code)

babelGenerator.default(ast, options, code) 参数说明：

1. ast：必要参数，需要被转换成 JS 代码的 AST 抽象语法树。

2. options：可选参数，一个对象，用于指定生成器的配置选项。常用配置选项如下：

- retainLines：指定是否保留生成的代码中的空行。默认为 `false`。

- compact：布尔值或 `'auto'`，设置为 `true` 以避免为格式化添加空格。

- minified：指定生成的代码是否进行混淆压缩。当设置为 true 时，将启用更进一步的代码压缩优化。默认为 `false`。

- sourceMaps：指定是否生成源映射（source maps）。默认为 `false`，表示不生成源映射。

- retainFunctionParens：指定函数表达式是否保留参数周围的括号。默认为 `false`。

- comments：指定生成代码中是否包含注释。可选值为 `false`（删除所有注释）、`true`（保留所有注释）。默认为 `true`。

3. code：可选参数，原始代码的字符串形式。如果提供了原始代码，代码生成器将尽量保留原始代码中的格式和注释，可以理解为 ast 转换成 JS 代码的模板。

#### 使用示例

一般常用的使用方式：

```js
const parser = require("@babel/parser");
const generator = require("@babel/generator").default;

const code = `function add(a: number, b: number):number {
  // 这是一个行注释
  const message = 'Hello, world!'; /* 这是一个块注释 */
  console.log(a, b);
  console.log('dnhyxc', message);
  return a + b;
}`;

const ast = parser.parse(code, {
  plugins: ["typescript"],
});

const output = generator(ast, {}, code);
```

增加 `options` 配置的使用方式：

```js
const fs = require("fs");
const nodePath = require("path");
const parser = require("@babel/parser");
const generator = require("@babel/generator").default;

const sourceCode1 = `function add(a: number, b: number):number {
  // 这是一个行注释
  const message = 'Hello, world!'; /* 这是一个块注释 */
  console.log(a, b);
  console.log('dnhyxc', message);
  return a + b;
}`;

const sourceCode2 = "const name = 'dnhyxc'";

const astA = parser.parse(sourceCode1, {
  sourceFilename: "a.js",
  plugins: ["typescript"],
});
const astB = parser.parse(sourceCode2, { sourceFilename: "b.js" });

const ast = {
  type: "Program",
  body: [].concat(astA.program.body, astB.program.body),
};

const output = generator(
  ast,
  {
    minified: true, // 启用更进一步的代码压缩优化
    compact: true, // 以避免为格式化添加空格
    comments: false, // 删除所有注释
    sourceMaps: true, // 是否生成代码映射
  },
  {
    "a.js": sourceCode1,
    "b.js": sourceCode2,
  }
);

const createModifiedCodeLog = (data, path = "json/generator.json") => {
  fs.writeFileSync(nodePath.join(__dirname, path), data, (err) => {
    if (err) {
      throw err;
    } else {
      console.log("写入成功");
    }
  });
};

createModifiedCodeLog(
  JSON.stringify({
    ast,
    output,
  })
);
```

### @babel/traverse

#### @babel/traverse 的作用

@babel/traverse 是 Babel 工具链中的一个包，用于对 AST 抽象语法树进行遍历。

#### 安装

```
npm install @babel/traverse -D
```

#### traverse.default(ast, visitor) 参数说明

ast：必需参数，需要遍历的 ast 抽象语法树。

visitor：必需参数，访问器对象（Object）。其中可以包含多种方法，用于处理不同类型的节点。这些方法会在遍历过程中被调用，接收一个 `path` 对象作为参数，在方法内部可以操作和修改节点。

#### traverse.default(ast, visitor) 的使用方式

遍历处理所有的 AST：

```js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  // 将全局变量声明为 n 的改为 x
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

const output = generator(ast, {}, code);

console.log(output.code);
/**
 * 输出为：
 * function square(x) {
 *   return x * x;
 * }
 */
```

针对 AST 中的某些节点类型进行处理：

```js
const fs = require("fs");
const nodePath = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  // 处理 ast type 类型为 FunctionDeclaration（函数）的节点
  FunctionDeclaration(path) {
    // 将函数名称由 n 改为 x
    path.node.id.name = "x";
  },
  // 处理 ast type 类型为 Identifier（变量声明）的节点
  Identifier(path) {
    // 将函数参数名称由 n 改为 x
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

const output = generator(ast, {}, code);

console.log(output.code);
/**
 * 输出为：
 * function x(x) {
 *   return x * x;
 * }
 */
```

### 总结

上述 `@babel/types`、`@babel/parser`、`@babel/generator`、`@babel/traverse` 四个插件一般都是相互配合使用的。用于对源码进行处理。比如：开发 **webpack 插件**或者开发 **vscode 插件**时，都会用到上述插件。

#### 一个简单的使用案例

去除代码中的注释：

```js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const code = `
/**
 * 去外面除块级注释
 */
// 外面单行去除注释
function remove(a, b) {
  // 去除注释1
  // 去除注释2
  // 去除注释3
  /**
   * 去除块级注释
   */
  /*去除块级注释*/
  console.log(a, b); // log 注释
  return a + b; // 这也是一个注释
}
`;

// 将源代码解析为 AST 树
const ast = parser.parse(code);

// 删除注释的访问者
const visitor = {
  enter(path) {
    const { node } = path;
    // 删除注释
    if (node.leadingComments || node.trailingComments) {
      delete node.leadingComments;
      delete node.trailingComments;
    }
  },
};

// 遍历 AST 树并删除注释
traverse(ast, visitor);

// 将修改后的 AST 转换回源代码字符串
const { code: modifiedCode } = generator(ast);

console.log(modifiedCode, "modifiedCode");

/**
 * 输出为：
 * function remove(a, b) {
 *   console.log(a, b);
 *   return a + b;
 * }
 */
```
