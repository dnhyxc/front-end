class ResourceAnalyzerPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ResourceAnalyzerPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('ResourceAnalyzerPlugin', (chunks, callback) => {
        // 遍历所有模块资源
        compilation.modules.forEach((module) => {
          // 获取模块路径和大小
          const modulePath = module.resource;
          const moduleSize = module.size();
          if (!modulePath) return
          // 在控制台输出模块路径和大小
          console.log(`模块路径: ${modulePath}, 模块大小: ${moduleSize} bytes`);
        });

        callback();
      });
    });
  }
}

module.exports = ResourceAnalyzerPlugin;