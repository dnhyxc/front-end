class CustomOutputPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('CustomOutputPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('CustomOutputPlugin', (chunks, callback) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            // 获取输出文件内容
            let source = compilation.assets[file].source();

            // 在输出文件内容末尾添加一段代码
            const customCode = '\nconsole.log("Custom code added to output file");';
            source = customCode + source;

            // 更新输出文件内容
            compilation.assets[file] = {
              source: () => source, size: () => source.length
            };
          });
        });

        callback();
      });
    });
  }
}

module.exports = CustomOutputPlugin;
