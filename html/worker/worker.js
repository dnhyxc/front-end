// 在 worker.js 中编写 Web Worker 的代码
onmessage = function (event) {
  console.log('Message received in worker:', event.data);


  // 向主线程发送消息
  this.setTimeout(() => {
    postMessage('hello dnhyxc---------');
  }, 5000)
};

// 计算斐波那契数列
// function fibonacci(num) {
//   if (num <= 1) {
//     return num;
//   } else {
//     return fibonacci(num - 1) + fibonacci(num - 2);
//   }
// }
