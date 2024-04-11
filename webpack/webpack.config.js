const path = require('path');
const CompilePlugin = require('./plugins/CompilePlugin');
const ChangeImportPlugin = require('./plugins/ChangeImportPlugin');
const ResourceAnalyzerPlugin = require('./plugins/ResourceAnalyzerPlugin');
const CustomOutputPlugin = require('./plugins/CustomOutputPlugin');
const CodeInjectionPlugin = require('./plugins/CodeInjectionPlugin');
const ConsoleLogPlugin = require('./plugins/ConsoleLogPlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    // 使用自定义插件
    // new CompilePlugin(),
    // new ResourceAnalyzerPlugin(),
    // new CustomOutputPlugin(),
    // new CodeInjectionPlugin({
    //   injectedCode: `const customFn = (a, b) => a * b;console.log(customFn(2, 9));\n`
    // }),
    // new ChangeImportPlugin({useSub: process.env.USE_SUB === 'true'}),
    new ConsoleLogPlugin()
    // new ConsoleLogPlugin({prefix: 'dnhyxc'})
  ],
  mode: 'development',
}