onmessage = async function (e) {
  const {
    file,
    CHUNK_SIZE,
    startChunkIndex: start,
    endChunkIndex: end,
    createChunk,
  } = e.data;

  console.log(file, CHUNK_SIZE, start, end);
  const proms = [];
  for (let i = start; i < end; i++) {
    proms.push(createChunk(file, i, CHUNK_SIZE));
  }
  const chunks = await Promise.all(proms);
  this.setTimeout(() => {
    postMessage(chunks);
  }, 2000)
};
