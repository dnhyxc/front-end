const path = require('path');
const CompilePlugin = require('./plugins/CompilePlugin');
const ChangeImportPlugin = require('./plugins/ChangeImportPlugin');
const ResourceAnalyzerPlugin = require('./plugins/ResourceAnalyzerPlugin');
const CustomOutputPlugin = require('./plugins/CustomOutputPlugin');
const CodeInjectionPlugin = require('./plugins/CodeInjectionPlugin');
const ConsoleLogPlugin = require('./plugins/ConsoleLogPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemoveConsolePlugin = require('./plugins/RemoveConsolePlugin');
const webpackDevServer = require('webpack-dev-server');

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
    // new ConsoleLogPlugin()
    new RemoveConsolePlugin(),
    // 配置 HTML 插件
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        removeComments: true,
      },
    }),
    // new ConsoleLogPlugin({prefix: 'dnhyxc'})
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 9012,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  }
}