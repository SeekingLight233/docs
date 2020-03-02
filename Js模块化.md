---
title: 模块化与webpack
date: 2020-2-13
categories: 
 - 前端
sidebarDepth: 5
sidebar: "auto"
---
现在前端的需求开始变得越来越复杂，许多代码如果你全写到一个js文件里的话一是不好维护，二是没法多人协作，因此模块化是一个非常重要的话题。
## 模块化
### babel安装
1. cnpm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
2. cnpm i --save @babel/polyfill
3. 创建项目配置文件`babel.config.js`
``` js
const presets = [
    ["@babel/env", {
        targets: {
            edge: "17",
            firefox: "60",
            chrome: "67",
            safari: "11.1"
        }
    }]
];
module.exports = { presets };
```
4. 通过`npx babel-node`来运行js文件
### 默认导出

导出的话要用`export default`将变量暴露出去

``` js
// calculate.js
function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function multify(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}
//这些变量不导出的话外界是访问不到的
export default {
    add,
    sub,
    multify,
    div
}
```
导入的话用`import...from`导入外部模块。
``` js
import calculate from "./calculate.js";
let res = calculate.add(10, 20);
let res2 = calculate.multify(20, 20);
console.log(res); //30
console.log(res2); //400
```

### 按需导出
如果要按需导出的话只需要在变量前加上`export`关键字。
``` js
// calculate.js
export const PI = 3.141592;
export const SQRT2 = 1.414;
export const SQRT3 = 1.732;
```
导入的话用花括号，但注意变量名要和导出的变量名保持一致。

默认导入和按需导入可以同时存在，并不冲突。
``` js
import calculate, { PI, SQRT2 } from "./calculate.js";
let res = calculate.add(10, 20);
let res2 = calculate.multify(20, 20);
console.log(res); //30
console.log(res2); //400
console.log(PI);//3.141592
```
### 直接导出并执行代码
`naive.js`
``` js
console.log("too young too simple!")
```
`main.js`
``` js
import './naive'
//too young too simple!
```

## webpack
### 基本命令
``` js
//calculate.js
function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function multify(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}
//这些变量不导出的话外界是访问不到的
export default {
    add,
    sub,
    multify,
    div
}
//按需导出
export const PI = 3.141592;
export const SQRT2 = 1.414;
export const SQRT3 = 1.732;
```
``` js
//main.js
import calculate from "./calculate";

let res = calculate.add(1, 3);
console.log(res);
```
此时`main.js`和`calculate.js`位于同一目录下，可以使用webpack命令编译
``` shell
webpack main.js -o out.js
```
如果不指定配置的话默认的出口文件是用于生产环境的，如果要指定生成开发环境的入口文件需要加上`--mode development`

``` shell
webpack main.js -o out.js
```

在webpack4里，如果你有一个`src`文件，src文件中又有一个`index.js`,此时当你执行`webpack`命令时它会自动给你生成出打包好的`dist`文件夹。当然如果你不去指定配置项默认还是生产环境。
### 配置文件详解
如果要手动更改配置项的话，我们需要创建出一个`webpack.config.js`配置文件并放到项目的根目录。
``` js
//webpack.config.js
const path = require('path');

module.exports = {
    //entry用来指定到打包的入口文件
    entry: {
        a: './src/a.js',
        b: './src/b.js',
        c: './src/c.js',
    },
    //output用来指定出口文件的名称及路径
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
