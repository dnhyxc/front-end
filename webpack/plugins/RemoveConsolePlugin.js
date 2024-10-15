const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const code = `
  console.log('This is a log');
  const x = 5;
  console.log(x);
`;

const ast = parser.parse(code);

// 遍历 AST 并删除 console.log 调用
traverse(ast, {
  CallExpression(path) {
    // 检查是否是 console.log
    if (
      path.node.callee.type === "MemberExpression" &&
      path.node.callee.object.name === "console" &&
      path.node.callee.property.name === "log"
    ) {
      path.remove(); // 删除该节点
    }
  }
});

// 生成修改后的代码
const { code: newCode } = generate(ast);

console.log(newCode);

// RemoveConsolePlugin.js
// class RemoveConsolePlugin {
//   // 由于我们不需要从外部传入 options 
//   // 因此这里就不显示地定义 constructor 了
//   // constructor (){...}

//   apply(compiler) {
//     compiler.hooks.emit.tapAsync(
//       "RemoveConsolePlugin",
//       (compilation, callback) => {
//         Object.keys(compilation.assets).forEach((filename) => {
//           // 仅处理 .js 文件
//           if (filename.endsWith(".js")) {
//             const asset = compilation.assets[filename];
//             let content = asset.source();

//             // 使用正则表达式移除整个 console.log 语句
//             // 匹配 console.log( 之后的任意字符，直到遇到闭合的括号
//             const consoleLogRegex = new RegExp(
//               "console\\.log\\(.*?\\)(,|$)",
//               "g"
//             );

//             const withoutConsole = content.replace(consoleLogRegex, "");

//             // 更新资源
//             compilation.assets[filename] = {
//               source: () => withoutConsole,
//               size: () => Buffer.byteLength(withoutConsole, "utf8"),
//             };
//           }
//         });

//         callback();
//       }
//     );
//   }
// }

// module.exports = RemoveConsolePlugin;

const { transform } = require('@babel/core');

class RemoveConsoleLogPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RemoveConsoleLogPlugin', (compilation, callback) => {
      // 遍历每个模块
      for (const filename in compilation.assets) {
        const asset = compilation.assets[filename];
        const source = asset.source();

        // 使用 Babel 转换源代码，删除 console.log
        const result = transform(source, {
          plugins: [
            function removeConsoleLog() {
              return {
                visitor: {
                  CallExpression(path) {
                    if (
                      path.node.callee.type === "MemberExpression" &&
                      path.node.callee.object.name === "console" &&
                      path.node.callee.property.name === "log"
                    ) {
                      path.remove();
                    }
                  }
                }
              };
            }
          ]
        });

        // 更新模块的源代码
        compilation.assets[filename] = {
          source: () => result.code,
          size: () => result.code.length,
        };
      }

      callback();
    });
  }
}

module.exports = RemoveConsoleLogPlugin;
