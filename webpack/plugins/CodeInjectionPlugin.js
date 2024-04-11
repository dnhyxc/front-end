class CodeInjectionPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('CodeInjectionPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('CodeInjectionPlugin', (chunks, callback) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            if (file.endsWith('.js')) {
              let source = compilation.assets[file].source();

              // 在输出文件末尾注入额外的代码片段
              source = `\n${this.options.injectedCode}` + source;

              compilation.assets[file] = {
                source: () => source,
                size: () => source.length
              };
            }
          });
        });

        callback();
      });
    });
  }
}

module.exports = CodeInjectionPlugin;