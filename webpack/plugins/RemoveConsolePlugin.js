const { transform } = require('@babel/core');

class RemoveConsolePlugin {
  apply(compiler) {
    console.log(compiler.hooks.emit, 'compiler.hooks.emit')
    compiler.hooks.emit.tapAsync('RemoveConsolePlugin', (compilation, callback) => {
      // 遍历每个模块
      for (const filename in compilation.assets) {
        const asset = compilation.assets[filename];
        const source = asset.source();
        if (filename.endsWith('.js')) {
          const result = transform(source, {
            // 这是一个用于移除控制台输出的插件
            plugins: [
              {
                name: 'remove-console',
                visitor: {
                  CallExpression(path) {
                    // 如果调用表达式的调用者是console对象，就移除这个调用表达式
                    if (path.node.callee.type === 'MemberExpression' && path.node.callee.object.name === 'console') {
                      path.remove();
                    }
                  },
                  ConditionalExpression(path) {
                    // 如果条件表达式的结果是console对象的调用，我们将其替换为undefined，以移除控制台输出
                    if (path.node.consequent.type === 'CallExpression' && path.node.consequent.callee.type === 'MemberExpression' && path.node.consequent.callee.object.name === 'console') {
                      path.replaceWithSourceString('undefined');
                    }
                  },
                },
              },
            ],
            ast: true, // 确保生成 AST
            code: true, // 确保生成代码
          });
          compilation.assets[filename] = {
            source: () => result.code,
            size: () => result.code.length,
          };
        }
      }
      callback();
    });
  }
}

module.exports = RemoveConsolePlugin;
