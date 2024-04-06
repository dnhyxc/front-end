
import SparkMD5 from './spark-md5.js'

export const createChunk = (file, index, chunkSize) => {
    return new Promise((resolve) => {
        const start = index + chunkSize;
        const end = start + chunkSize;
        const spark = new SparkMD5.ArrayBuffer();
        const fileRender = new FileReader();
        const blob = file.slice(start, end);
        fileRender.onload = (e) => {
            spark.append(e.target.result);
            resolve({ start, end, index, hash: spark.end(), blob });
        };
        fileRender.readAsArrayBuffer(blob);
    });
};