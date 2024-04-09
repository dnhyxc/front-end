const {SyncHook} = require('tapable');

class MyPlugin {
  constructor() {
    this.hooks = {
      // 定义一个 SyncHook 钩子
      myHook: new SyncHook(['arg1', 'arg2'])
    };
  }

  apply() {
    // 注册回调函数到 myHook 钩子
    this.hooks.myHook.tap('MyPlugin', (arg1, arg2) => {
      console.log('Callback 1:', arg1, arg2);
    });

    this.hooks.myHook.tap('MyPlugin', (arg1, arg2) => {
      console.log('Callback 2:', arg1, arg2);
    });

    // 触发 myHook 钩子，执行注册的回调函数
    this.hooks.myHook.call('dnhyxc', 'hmhm');
  }
}

const plugin = new MyPlugin();

plugin.apply();