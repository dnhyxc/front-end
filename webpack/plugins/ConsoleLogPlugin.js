class ConsoleLogPlugin {
  constructor(options) {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    // 可以在插件配置中传入需要添加的字符串
    this.prefix = options?.prefix || `${hour}时${minute}分${second}秒`;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ConsoleLogPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('ConsoleLogPlugin', (chunks, callback) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            let code = compilation.assets[file].source();
            code = this.injectPrefixToConsoleLog(code, file);
            compilation.assets[file] = {
              source: () => code,
              size: () => code.length
            };
          });
        });
        callback();
      });
    });
  }

  injectPrefixToConsoleLog(code, file) {
    console.log(file, 'file')
    // 匹配所有的 console.log() 打印语句，并给其加上指定的字符串
    return code.replace(/(console\.log\()(.+?)(\);?)/g, (match, p1, p2, p3) => {
      // 在 console.log() 的参数前面添加指定的前缀字符串
      console.log(p1, '---', p2, '---', p3, '------')
      return `${p1}'${file}-${this.prefix}:',${p2}${p3}`;
    });
  }
}

module.exports = ConsoleLogPlugin;

