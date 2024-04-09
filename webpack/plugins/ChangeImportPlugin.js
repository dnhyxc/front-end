const {SyncBailHook} = require('tapable');

class ChangeImportPlugin {
  constructor(options) {
    this.options = options;
    this.hooks = {
      resolveImport: new SyncBailHook(['importPath'])
    };
  }

  apply(compiler) {
    /**
     * compiler.hooks.compilation.tap: 这个钩子是在每次新的 compilation 创建时触发的。
     * 在 webpack 中，compilation 是指一次完整的构建过程，包括从 entry 开始的模块解析、依赖分析、代码生成等。
     * 通过在 compiler.hooks.compilation.tap 上注册函数，可以在每个新的 compilation 中执行特定的逻辑，例如修改模块、资源或代码块等。
     */
    compiler.hooks.compilation.tap('ChangeImportPlugin', (compilation) => {
      this.hooks.resolveImport.tap('ChangeImportPlugin', (importPath) => {
        console.log(importPath, '222222', this.options.useSub) // this.hooks.resolveImport.call(resolveData.request) 传递的 resolveData.request 参数
        return this.options.useSub ? importPath.replace('add', 'sub') : importPath;
      });
    });

    /**
     * compiler.hooks.normalModuleFactory.tap: 这个钩子是在创建 NormalModuleFactory 实例时触发的。
     * NormalModuleFactory 是负责创建模块的工厂类，它负责解析模块请求、创建模块对象等。
     * 通过在 compiler.hooks.normalModuleFactory.tap 上注册函数，可以在模块工厂创建时执行特定的逻辑，例如修改模块请求、处理模块解析等。
     */
    compiler.hooks.normalModuleFactory.tap('ChangeImportPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tap('ChangeImportPlugin', (resolveData) => {
        console.log(resolveData.request, '111111', resolveData.contextInfo) // 文件路径 ./src/index.js、./add、./test
        // 替换所有文件中引入的 ./add 为 ./sub
        // resolveData.request = this.hooks.resolveImport.call(importPath);

        // 只替换 ./index.js 中引入的 ./add 为 ./sub
        if (resolveData.request === './add' && resolveData.contextInfo.issuer.indexOf('index.js') !== -1) {
          resolveData.request = this.hooks.resolveImport.call(resolveData.request);
        }
      });
    });
  }
}

module.exports = ChangeImportPlugin;
