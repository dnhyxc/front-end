const {SyncHook} = require("tapable");
const hook = new SyncHook(["arg1", "arg2", "arg3"]);

// Tapable 中的每一个钩子，都有拦截器属性，和 Axios 类似，我们可以通过配置拦截器，对每个 hook 执行的流程做出一些额外的操作。
hook.intercept({
  // 每次调用 hook 实例的 tap() 方法注册回调函数时, 都会调用该方法, 并且接受 tap 作为参数, 还可以对 tap 进行修改;
  register: (tapInfo) => {
    console.log('===========register==========', tapInfo);
    console.log(`${tapInfo.name} is doing its job`); // tapInfo.name就是注册事件时传入的标识符...

    //注册事件的时候，都对 tapInfo.name 修改一下
    tapInfo.name = tapInfo.name + '!!!!!!!'
  },

  // 通过 hook 实例对象上的 call 方法时候触发拦截器
  call: (arg1, arg2, arg3) => {
    console.log("===========call==========", arg1, arg2, arg3);
  },

  // 在调用被注册的每一个事件函数之前执行
  tap: (tapInfo) => {
    console.log("===========tap==========", tapInfo);
  },

  // loop 类型钩子中每个事件函数被调用前触发该拦截器方法
  loop: (...args) => {
    console.log("===========loop==========", args);
  },
});

// 注册事件
hook.tap("event1", (arg1, arg2, arg3) => {
  console.log("event1被执行了 ", arg1, arg2, arg3);
});

hook.tap("event2", (arg1, arg2, arg3) => {
  console.log("event12被执行了 ", arg1, arg2, arg3);
});

// 调用事件并传递执行参数
hook.call("dnhyxc", 18, "coding");
/*
* register：通过 tap()、tapAsync()、tapPromise注册事件后，会触发该拦截器，
* 它接受一个 tapInfo 的参数，参数值是：{ type: 'sync', fn: [Function (anonymous)], name: 'event1' }，
* type 表示同步还是异步、fn 就是注册时的回调函数，name 就是注册时的事件占位符。
*
* call：触发事件时触发该拦截器，接受 tapInfo 参数，参数值就是调用 call 时传入的值。
*
* tap：在执行每一个事件的 callback 之前调用。
*/


/*
* Before 属性的值可以传入一个数组或者字符串，值为注册事件对象时的名称，
* 它可以修改当前事件函数在传入的事件名称对应的函数之前进行执行。
*/
const hooks2 = new SyncHook();

hooks2.tap({name: "event1"}, () => console.log("event1被执行了"));

hooks2.tap(
  {
    name: "event2",
    // event2 会在 event1 前执行
    before: "event1",
  },
  () => console.log("event2被执行了")
);

/*
* 输出结果：
* event2被执行了
* event1被执行了
*/
hooks2.call();


/*
 * Stage 属性的类型是 Number，数字越大，事件回调执行的越晚，支持传入负数，默认为0.
 */
const hooks3 = new SyncHook();

hooks3.tap({name: "event1"}, () => console.log("hooks3-event1被执行了"));

hooks3.tap(
  {
    name: "event2",
    // event2 的 stage 是 1 > event1 的 stage 0，所以 event1 先执行
    stage: 2,
  },
  () => console.log("hooks3-event2被执行了")
);

hooks3.tap(
  {
    name: "event3",
    // event2 的 stage 是 1 > event1 的 stage 0，所以 event1 先执行
    stage: 1,
  },
  () => console.log("hooks3-event3被执行了")
);

/*
* 输出结果：
* hooks3-event1被执行了
* hooks3-event3被执行了
* hooks3-event2被执行了
*/
hooks3.call();