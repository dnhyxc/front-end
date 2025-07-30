import { eslintDnhyxcPlugin } from './plugins/eslint-dnhyxc-plugin.js'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // dnhyxc 与 plugin 中的 dnhyxc key 保持一致
      'dnhyxc/no-dnhyxc-vars': 'error'
    },
    plugin: {
      // 具名插件 dnhyxc
      dnhyxc: eslintDnhyxcPlugin,
    }
  },
]