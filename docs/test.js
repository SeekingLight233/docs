const fs = require("fs");

setTimeout(() => {
  console.log("定时器");
}, 0);

setImmediate(() => {
  console.log("setImmediate区");
});

fs.readFile("./os-process.md", { encoding: "utf-8" }, (err, res) => {
  if (err) throw err;
  console.log("读取文件回调");
});

/// 该部分将会在首次事件循环中执行
Promise.resolve().then(() => {
  console.log("promise!!!");
});

process.nextTick(() => {
  console.log("process nexttick!!!");
});

// 首次事件循环执行
console.log("同步区");
