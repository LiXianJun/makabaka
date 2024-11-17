////importScripts('https://cdn.jsdelivr.net/npm/fflate@0.6.9/umd/index.min.js');
//importScripts('https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js');
//
//self.onmessage = async function (event) {
//  const { filesData } = event.data;
//  const compressedData = [];
//
//  console.log("111");
//
//  // 确保 filesData 是数组
//  if (!Array.isArray(filesData)) {
//    throw new TypeError('Expected filesData to be an array');
//  }
//
//  for (const image of filesData) {
//    const uint8Array = new Uint8Array(image);
//    // 使用 Promise 来处理 gzip
//    const compressedImage = await new Promise((resolve, reject) => {
//      fflate.gzip(uint8Array, (err, result) => {
//        if (err) {
//          reject(err);
//        } else {
//          resolve(result);
//        }
//      });
//    });
//    compressedData.push(compressedImage);
//  }
//  console.log("222");
//  // 合并压缩数据
//  const combined = new Uint8Array(compressedData.reduce((acc, curr) => acc + curr.length, 0));
//  let offset = 0;
//  for (const data of compressedData) {
//    combined.set(data, offset);
//    offset += data.length;
//  }
//
//  console.log("333");
//  // 创建 Blob
//  const finalCompressedBlob = new Blob([combined], { type: 'application/octet-stream' });
//  console.log("444");
//  // 发送回主线程
//  self.postMessage(finalCompressedBlob);
//};

importScripts('https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js');

//self.onmessage = async function (event) {
//  const { filesData } = event.data; // 假设 filesData 是一个包含 List<int> 的数组
//  const zip = new fflate.Zip();
//
//  if (!Array.isArray(filesData)) {
//    throw new TypeError('Expected filesData to be an array');
//  }
//
//  const timestamp = Date.now(); // 获取当前时间戳
//
//  for (let i = 0; i < filesData.length; i++) {
//    const image = filesData[i]; // 获取 List<int>
//    const uint8Array = new Uint8Array(image); // 将 List<int> 转换为 Uint8Array
//    // 生成文件名：timestamp_index.png
//    const fileName = `${timestamp}_${i}.png`;
//    // 将图片添加到 ZIP
////    zip.add(fileName, uint8Array);
//    const nonStreamingFile = new fflate.ZipPassThrough(fileName);
//    zip.add(nonStreamingFile);
//    // If you have data already loaded, just .push(data, true)
//    nonStreamingFile.push(uint8Array, true);
//  }
//
//  // 生成 ZIP 文件
//  const zipBlob = await new Promise((resolve) => {
//    zip.generate((data) => {
//      resolve(new Blob([data], { type: 'application/zip' }));
//    });
//  });
//    zip.end();
//  // 发送回主线程
//  self.postMessage(zipBlob);
//};

self.onmessage = async function (event) {
  const { filesData } = event.data;
// 假设你有多个图片数据的列表
//const files = [
//  { name: 'image1.png', data: new Uint8Array([/* image1 content */]) },
//  { name: 'image2.png', data: new Uint8Array([/* image2 content */]) },
//  // 添加更多图片
//];

 // 创建一个对象来存储文件内容
  const fileMap = {};

  // 将每个文件添加到 fileMap
 filesData.forEach((file, index) => {
   // 使用 index 和 file.name 构建文件名，例如：file_0.png
     const fileName = `file_${index}.png`; // 使用原文件名或生成的名称
    fileMap[fileName] = new Uint8Array(file); // 确保将 Uint8List 转换为 Uint8Array
 });

  // 使用 zipSync 压缩文件
  const zipped = fflate.zipSync(fileMap);

  // 创建 Blob
  const zipBlob = new Blob([zipped], { type: 'application/zip' });

  // 将 Blob 返回给主线程
  self.postMessage(zipBlob);

};
