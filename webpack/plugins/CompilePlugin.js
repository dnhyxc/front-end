const {SyncHook} = require('tapable');

class CompilePlugin {
  constructor() {
    // 定义一个钩子，用于注册编译过程中的回调函数
    this.hooks = {
      compile: new SyncHook(['compilation'])
    };
  }

  apply(compiler) {
    // 注册编译过程中的回调函数
    compiler.hooks.emit.tap('CompilePlugin', (compilation) => {
      console.log('Compiling...', compilation.assets);
      // 其他操作源码的逻辑
    });
  }
}

module.exports = CompilePlugin;
