const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");

/*
* 初始化 SyncHook 对象
* SyncHook 是同步的、按照事件注册顺序执行（不管事件有没有返回值）。
* 接受一个字符串数组作为参数，数组的长度决定了 tap 注册事件时，callback 函数传入的参数个数
*/
const hook = new SyncHook(["name", "age", "hobby"]);

//2、通过 tap 注册事件，在这里，因为 SyncHook 是同步 hook，所以用 tap 注册事件
//该事件的回调函数接受的参数个数就是 初始化时 定义的数组长度
// event1 实际并没有什么意义，只是一个标识位，不要和 eventMitter 里面自定义事件的事件名混淆，它只是一个标识位！！
hook.tap("event1", (arg1, arg2, arg3) => {
  console.log('event1被执行', arg1, arg2, arg3); // dnhyxc 18 coding
})

hook.tap("event2", (arg1, arg2, arg3) => {
  console.log('event2被执行', arg1, arg2, arg3); // dnhyxc 18 coding
})

//3、触发注册的事件，同步 hook 通过 call 触发
hook.call('dnhyxc', 18, 'coding')


/*
* SyncWaterfallHook 是同步的、瀑布的钩子，按照事件注册顺序执行，
* 当前一个事件有不为 undefined 的返回值 result 时，
* 会把 result 传给下一个事件的第一个参数，如果 result 是 undefined，那么就不管
*/
const syncWaterfallHook = new SyncWaterfallHook(["arg1", "arg2", "arg3"]);

syncWaterfallHook.tap("syncWaterfallHook-event1", (arg1, arg2, arg3) => {
  console.log("syncWaterfallHook-event1被执行了", arg1, arg2, arg3); // snsn 23 gender
  return "dnhyxc";
});

syncWaterfallHook.tap("event2", (arg1, arg2, arg3) => {
  console.log("syncWaterfallHook-event2被执行了", arg1, arg2, arg3); // dnhyxc 23 gender
});

syncWaterfallHook.tap("event3", (arg1, arg2, arg3) => {
  console.log("syncWaterfallHook-event3被执行了", arg1, arg2, arg3); // dnhyxc 23 gender
  return ["hmhm", "snsn"];
});

syncWaterfallHook.tap("event4", (arg1, arg2, arg3) => {
  console.log("syncWaterfallHook-event4被执行了", arg1, arg2, arg3); // [ 'hmhm', 'snsn' ] 23 gender
});

syncWaterfallHook.call("snsn", 23, "gender");


/*
* SyncBailHook 是同步的、保险的钩子，同样会按照事件注册的顺序执行，
* 当其中有一个事件的返回值 result 不为 undefined 时，会中断后续事件的执行，直接结束。
* 同样，它以 tap 注册事件、以 call 触发事件。
*/
const syncBailHook = new SyncBailHook(['name', 'age', 'gender'])

syncBailHook.tap('event1', (arg1, arg2, arg3) => {
  console.log('syncBailHook-event1被执行了', arg1, arg2, arg3);  // dnhyxc 18 male
})

syncBailHook.tap('event2', (arg1, arg2, arg3) => {
  console.log('syncBailHook-event2被执行了', arg1, arg2, arg3);  // dnhyxc 18 male
  // 因为是同步的，所以按照 event1、event2、event3 的顺序执行，当执行到 event2 发现有不为 undefined 的返回值
  // 又因为是 保险的，所以结束后续事件的调用
  return 'event2的返回值'
})

// 会被 event2 中断执行，即 event3 不会被执行，因为 event2 返回值不为 undefined
syncBailHook.tap('event3', (arg1, arg2, arg3) => {
  console.log('syncBailHook-event3被执行了', arg1, arg2, arg3);  // 不会被执行
})

syncBailHook.call('dnhyxc', 18, 'male')


/*
* SyncLoopHook 是 同步的、循环的钩子，同样它会按照事件的注册顺序执行，
* 它会去监听每一个事件的返回值 result 是不是 undefined，
* 如果 result 不是 undefined，则跳回到第一个事件从头执行，如果 result 是 undefined，则执行后续事件。
* 同样，它通过 tap 注册事件，通过 call 触发事件。
*/
const syncLoopHook = new SyncLoopHook(['name', 'age', 'gender'])
let count = 1;
let num = 5;
syncLoopHook.tap('event1', (arg1, arg2, arg3) => {
  console.log('syncLoopHook-event1-count ', count);
  if (count !== 5) {
    return count++
  } else {
    return undefined
  }
})

syncLoopHook.tap('event2', (arg1, arg2, arg3) => {
  console.log('syncLoopHook-event2-num ', num);
  if (num !== 1) {
    return num--
  } else {
    return undefined
  }
})

/*
* 运行结果：
* syncLoopHook-event1-count  1
* syncLoopHook-event1-count  2
* syncLoopHook-event1-count  3
* syncLoopHook-event1-count  4
* syncLoopHook-event1-count  5
* syncLoopHook-event2-num  5
* syncLoopHook-event1-count  5
* syncLoopHook-event2-num  4
* syncLoopHook-event1-count  5
* syncLoopHook-event2-num  3
* syncLoopHook-event1-count  5
* syncLoopHook-event2-num  2
* syncLoopHook-event1-count  5
* syncLoopHook-event2-num  1
*/
syncLoopHook.call('dnhyxc', 23, 'gender')
// > 总结：SyncLoopHook 当事件返回值不为 undefined 时，会循环执行该事件，知道返回值为 undefined 时，才会执行下一个事件。


/*
* AsyncSeriesHook 是异步的、串行的（Series）钩子。
* 对于异步的钩子，通过 tapAsync、tapPromise来注册事件：
* - tapAsyc 注册事件时，会多一个 callback 回调，即：
*   tapAsync(identifer, (...args, callback) => {
*     callback()
*   })
*   此时这个 callback 可以理解为 antd form 里面的 validator 中的 callback，用来控制事件流程的。
*   当这个 callback 的第一个参数不为 undefined 时，表示抛出错误，后续的事件不会执行，
*   所以如果要执行下一个事件，callback 返回值应该写成：callback(undefined | null, 返回值)。
* - tapPromise 注册事件时，通过返回 promise，来控制事件流程。
*
* 对于异步钩子，通过 callAsync、promise 一一对应的触发事件。
* */
const asyncSeriesHook = new AsyncSeriesHook(['name', 'age', 'gender'])

console.time('timer');

//可以通过 tapAsync 注册事件
asyncSeriesHook.tapAsync('event1', (arg1, arg2, arg3, callback) => {
  console.log('asyncSeriesHook-event1', arg1, arg2, arg3);
  // 如果 callback 的第一参数不为 undefined，则相当于抛出错误，event2不会执行
  callback(undefined, '123')
})

asyncSeriesHook.tapPromise('event2', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesHook-event2', arg1, arg2, arg3);
      resolve("hmhm")
    }, 1000);
  })
})

asyncSeriesHook.tapAsync('event4', (arg1, arg2, arg3, callback) => {
  console.log('asyncSeriesHook-event4', arg1, arg2, arg3);
  // 如果 callback 的第一参数不为 undefined，则相当于抛出错误，event2不会执行
  callback(undefined, 'snsn')
})

// 通过 tapPromise 注册事件
asyncSeriesHook.tapPromise('event3', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesHook-event3', arg1, arg2, arg3);
      reject("hmhm-error")
    }, 1000);
  })
})

asyncSeriesHook.tapAsync('event4', (arg1, arg2, arg3, callback) => {
  console.log('asyncSeriesHook-event4', arg1, arg2, arg3);
  // 如果 callback 的第一参数不为 undefined，则相当于抛出错误，event2不会执行
  callback(undefined, 'snsn')
})

// 通过 callAsync 的方式触发事件
asyncSeriesHook.callAsync('dnhyxc', 18, '男', (err, res) => {
  console.log('结束了 done:', err, res);
  console.timeEnd('timer');
})

/*
* 通过 promise 触发
*/
const asyncSeriesHook2 = new AsyncSeriesHook(['name', 'age', 'gender'])

asyncSeriesHook2.tapAsync('event1', (arg1, arg2, arg3, callback) => {
  console.log('asyncSeriesHook2-event1 ', arg1, arg2, arg3);
  callback(undefined, '123')

  //如果传递的第一个参数不是 undefined，相当于抛出了错误，后续的事件不会执行
  // callback(123)
})

asyncSeriesHook2.tapPromise('event2', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asyncSeriesHook2-event2 ', arg1, arg2, arg3);
      // resolve("snsn")
      // 抛出错误
      reject("snsn")
    }, 1000);
  })
})

//通过 promise 的方式触发事件
asyncSeriesHook2.promise("dnhyxc", 18, 'male').then((res) => {
  //对于 AsyncSeriesHook，通过 tapPromise 的形式注册事件后，无法获取 resolve(value) 传递的 value
  console.log('成功了', res);
}).catch((err) => {
  // 通过 promise 的形式触发事件时，callback('嘻嘻') 的嘻嘻会被 catch 捕获
  console.log('失败了', err);
})


/*
* AsyncSeriesBailHook 是异步的、串行的、保险的钩子，跟同步保险钩子类似，
* 区别仅在于注册的事件函数是异步函数，同样，如果有不为 undefined 的返回值 result，直接中断后续事件的执行
*/
const asyncSeriesBailHook = new AsyncSeriesBailHook(["arg1", "arg2", "arg3"]);

asyncSeriesBailHook.tapPromise("event1", (arg1, arg2, arg3) => {
  console.log("asyncSeriesBailHook-event1:", arg1, arg2, arg3); // my name is dnhyxc 18 male
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000);
  });
});

asyncSeriesBailHook.tapAsync("event2", (arg1, arg2, arg3, callback) => {
  console.log("asyncSeriesBailHook-event2:", arg1, arg2, arg3); // my name is dnhyxc 18 male
  setTimeout(() => {
    // callback() 传递的第一个参数如果不是 undefined，则相当于抛出了错误，也会中断后续的事件
    callback(undefined, "hmhm");
  }, 2000);
});

// 不再执行，因为 event2 有返回值，会直接中断执行
asyncSeriesBailHook.tapAsync("event3", (arg1, arg2, arg3, callback) => {
  console.log("asyncSeriesBailHook-event3:", arg1, arg2, arg3);
  setTimeout(() => {
    callback();
  }, 2000);
});

// 调用事件并传递执行参数
asyncSeriesBailHook.callAsync("my name is dnhyxc", 18, "male", (err, res) => {
  console.log("结束了", err, res);
});


/*
* AsyncSeriesWaterfallHook 是 异步的、串行的、瀑布式的钩子，
* 如果前一个钩子有不为 undefined 的返回值 result，则将 result 作为下一个钩子的第一个入参。
*/
const asyncSeriesWaterfallHook = new AsyncSeriesWaterfallHook(["arg1", "arg2", "arg3"]);

asyncSeriesWaterfallHook.tapAsync("event1", (arg1, arg2, arg3, callback) => {
  console.log("asyncSeriesWaterfallHook-event1:", arg1, arg2, arg3); // my name is asyncSeriesWaterfallHook 18 male
  setTimeout(() => {
    // callback 的第一个参数如果不是 undefined || null 时，相当于会抛出错误
    callback(undefined, 'my name is the return value of event1');
  }, 1000);
});

asyncSeriesWaterfallHook.tapAsync("event2", (arg1, arg2, arg3, callback) => {
  console.log("asyncSeriesWaterfallHook-event1:", arg1, arg2, arg3); // my name is asyncSeriesWaterfallHook 18 male
  setTimeout(() => {
    // callback 的第一个参数如果不是 undefined || null 时，相当于会抛出错误
    callback(undefined, 'my name is the return value of event2');
  }, 1000);
});

asyncSeriesWaterfallHook.tapAsync("event3", (arg1, arg2, arg3, callback) => {
  console.log("asyncSeriesWaterfallHook-event2:", arg1, arg2, arg3); // my name is the return value of event2 18 male
  setTimeout(() => {
    callback();
  }, 1000);
});

// 调用事件并传递执行参数;
asyncSeriesWaterfallHook.callAsync("my name is asyncSeriesWaterfallHook", 18, "male", (err, res) => {
  // res 就是最后一个事件的返回值
  console.log("结束了", err, res); // 结束了  null  my name is the return value of event2
});


/*
* AsyncParallelHook 是 异步的、并行的钩子，会并发执行所有事件
*/
const asyncParallelHook = new AsyncParallelHook(["arg1", "arg2", "arg3"]);

console.time('timer2');

// 注册事件
asyncParallelHook.tapPromise("event1", (arg1, arg2, arg3) => {
  console.log("asyncParallelHook-event1:", arg1, arg2, arg3); // asyncParallelHook dnhyxc 18 male
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("event1"); // 无法通过 resolve 传递参数
    }, 2000);
  });
});

asyncParallelHook.tapAsync("event2", (arg1, arg2, arg3, callback) => {
  console.log("asyncParallelHook-event2:", arg1, arg2, arg3); // asyncParallelHook dnhyxc 18 male
  callback(undefined, 'event2的返回值');
});

asyncParallelHook.tapAsync("event3", (arg1, arg2, arg3, callback) => {
  console.log("asyncParallelHook-event3:", arg1, arg2, arg3); // asyncParallelHook dnhyxc 18 male
  setTimeout(() => {
    // callback 的第一个参数不为 undefined 时，相当于报错
    // 通过 promise 执行事件的话这个参数值就传给了 catch(err) 的 err
    callback(123, 'event3的返回值')
  }, 1000);
});

asyncParallelHook.callAsync("asyncParallelHook dnhyxc", 18, "male", (err, res) => {
  console.log("结束了~~~", err, res);
  console.timeEnd('timer2'); // timer2: 1.003s
  /*
  * 可以看到最终的回调函数执行时打印的事件为1s稍微多一点，
  * 也就是说 event1、event2 两个事件函数并行开始执行，在1s后两个异步函数执行结束，整体回调结束。
  */
});


/*
* AsyncParallelBailHook 是 异步的、并行的、保险类的钩子，与同步的类似
*/
const asyncParallelBailHook = new AsyncParallelBailHook(['arg1', 'arg2', 'arg3']);

console.time('timer3');

// 注册事件
asyncParallelBailHook.tapPromise('flag1', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    console.log('asyncParallelBailHook-flag1 done:', arg1, arg2, arg3); // dnhyxc hmhm snsn
    setTimeout(() => {
      resolve();
    }, 1000);
  });
});

asyncParallelBailHook.tapAsync("flag2", (arg1, arg2, arg3, callback) => {
  console.log("asyncParallelBailHook-flag2 done:", arg1, arg2, arg3); // dnhyxc hmhm snsn
  setTimeout(() => {
    callback(undefined, "flag2 的返回值"); // 此时相当于返回了不为 undefined 的返回值，直接中断后续事件
  }, 2000);
});

// 由于之前的事件有返回值，因此 flag3 的 callback 被中断，不执行
asyncParallelBailHook.tapAsync('flag3', (arg1, arg2, arg3, callback) => {
  setTimeout(() => {
    // 此时表示hook执行完毕的callback已经执行完毕了，但是因为之前的异步并行的定时器并没有被终止 所以3s后会执行定时器的打印
    console.log('asyncParallelBailHook-flag3 done:', arg1, arg2, arg3); // 会在 3s 后打印 dnhyxc hmhm snsn
    callback();
  }, 3000);
});

asyncParallelBailHook.callAsync('dnhyxc', 'hmhm', 'snsn', () => {
  console.log('asyncParallelBailHook 全部执行完毕 done');
  console.timeEnd('timer3'); // timer3: 2.009s
});