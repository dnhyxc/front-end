const path = require('path');
const CompilePlugin = require('./plugins/CompilePlugin');
const ChangeImportPlugin = require('./plugins/ChangeImportPlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    // 使用自定义插件
    // new CompilePlugin(),
    new ChangeImportPlugin({useSub: process.env.USE_SUB === 'true'})
  ],
  mode: 'development'
};