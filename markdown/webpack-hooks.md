### compilation

#### compilation 说明

在 webpack 中，compilation 是一个表示一次完整的构建过程的对象，包含了当前的模块资源、编译生成的文件、变化的文件等信息。compilation
对象在每次新的编译创建时触发。包括但不限于以下情况：

- 当 webpack 启动时，会创建初始的 compilation 对象。

- 每次文件变化时，会触发新的 compilation 对象的创建，以进行增量编译。

- 当 webpack 执行构建时，会创建新的 compilation 对象来跟踪和管理模块资源的变化。

- 在 webpack 执行插件时，插件可以访问和操作当前的 compilation 对象，以实现对编译过程的干预和定制。

在每次新的编译创建时，webpack 会生成一个新的 compilation 对象，该对象包含了当前编译过程中的所有信息和资源，可以通过该对象访问和操作编译过程中的各个阶段。插件可以通过监听
compiler 对象上的 compilation 钩子来获取和操作 compilation 对象，以实现对编译过程的扩展和定制化。

#### compilation 实际使用案例

资源分析：通过遍历 compilation 对象的模块资源，可以实现对项目中各个模块的依赖关系、文件大小等进行分析，从而优化项目的性能和体积。

- ResourceAnalyzerPlugin 插件：

```js
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
          // 在控制台输出模块路径和大小
          console.log(`Module Path: ${modulePath}, Size: ${moduleSize} bytes`);
        });

        callback();
      });
    });
  }
}

module.exports = ResourceAnalyzerPlugin;
```

- 使用插件：

```js
const ResourceAnalyzerPlugin = require('./ResourceAnalyzerPlugin');

module.exports = {
  // 其他配置
  plugins: [
    new ResourceAnalyzerPlugin()
  ]
};
```

自定义输出文件：通过监听 compilation 对象的 optimizeChunkAssets 钩子，在文件输出阶段对输出文件进行自定义处理，例如添加自定义注释、修改文件名等。

```js
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
```

代码注入：在 compilation 对象的 optimizeChunkAssets 钩子中，可以向输出的文件中注入额外的代码片段，实现一些特定的功能，如添加统计代码、监控代码等。

- 插件示例代码：

```js
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
```

- 使用插件：

```js
const ResourceAnalyzerPlugin = require('./ResourceAnalyzerPlugin');

module.exports = {
  // 其他配置
  plugins: [
    new CodeInjectionPlugin({
      injectedCode: `const customFn = (a, b) => a * b;console.log(customFn(2, 9));\n`
    })
  ]
};
```

错误处理：通过监听 compilation 对象的 failed 和 warnings 钩子，可以捕获编译过程中的错误和警告信息，并进行相应的处理，如输出错误日志、发送通知等。

自定义模块解析：通过监听 compilation 对象的 resolver 钩子，可以自定义模块的解析逻辑，实现对特定模块路径的定制化处理。

条件编译：通过监听 compilation 对象的 optimizeModulesBasic 钩子，可以根据特定条件动态地控制哪些模块需要被编译和输出，实现条件编译的功能。