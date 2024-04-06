const inpFile = document.querySelector('input[type="file"]');

inpFile.onchange = async (e) => {
  const file = e.target.files[0];
  console.time("cutFile");
  const chunks = await cutFile(file);
  console.time("curFile");
  console.log(chunks);
};

// 切片的大小为 5M
const CHUNK_SIZE = 1024 * 1024 * 5;

// 进程数量
const THREAD_COUNT = navigator.hardwareConcurrency || 4;

const cutFile = async (file) => {
  return new Promise((resolve) => {
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
    // 所有拆分的分片
    const result = [];
    // 用于判断所有的线程是否结束
    let finishCount = 0;
    for (let i = 0; i < THREAD_COUNT; i++) {
      // 创建线程，并分配任务
      const worker = new Worker("./worker.js");
      console.log(worker, "worker");

      const start = i * threadChunkCount;
      let end = (i + 1) * threadChunkCount;
      if (end > chunkCount) {
        end = chunkCount;
      }
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startChunkIndex: start,
        endChunkIndex: end,
      });
      worker.onmessage((e) => {
        for (let j = 0; j < end; j++) {
          result[i] = e.data[i - start];
        }
        // 结束线程
        worker.terminate();
        finishCount++;
        if (finishCount === THREAD_COUNT) {
          console.log(result, "result111");
          result.sort((a, b) => a.index - b.index);
          console.log(result, "result222");
          resolve(result);
        }
      });
    }
  });
};


