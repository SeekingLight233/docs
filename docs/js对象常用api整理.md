---
title: js内置对象常用api整理
date: 2020-1-28
categories:
  - 前端
tags:
  - history
  - localStorage
  - location
  - navigator
  - screen
  - String对象
  - Array对象
sidebarDepth: 5
sidebar: 'auto'
---

## js 中常用的 bom 方法

### history 全局对象

> history 对象里保存用户的上网记录

- `history.back()`
  加载 history 列表中的前一个 URL
- `history.forward()`
  加载 history 列表中的后一个 URL
- `history.go(-3)`
  加载 history 列表中的某个具体页面,这个例子中是后退三页(作用等效于按三次返回键)

### localStorage

> localStorage 对象用于在浏览器中存储键值对数据

```js
localStorage.setItem('name', 'jason');
var name = localStorage.getItem('name');
```

### location url 信息

> location 对象中会包含当前的 url 信息

- `location.hostname`
  返回当前 url 的主机名
- `location.port`
  返回当前 url 的端口号
- `location.href`
  返回完整的 url
- `location.pathname`
  返回完整的目录和文件名
- `location.search`
  返回 url 中查询字符串（'？name=fafa&sex=male'）
- `location.protocol`
  返回当前 url 使用的协议
- `location.assign(url)`
  打开一个新的 url，并创建记录
- `location.reload();`
  刷新当前页面
- `location.replace(newURL)`
  用一个新的页面来替换当前的页面

### URLSearchParams(location.search)

这是一个获取参数的一个很好用的 api

```js
console.log(location.search);
//?a=1&b=2
const p = new URLSearchParams(location.search);
console.log(p); //{ 'a' => '1', 'b' => '2' }
console.log(p.get('b')); //2
```

这个 api 的返回值是一个对象数组。

### navigator：浏览器信息

> navigator 对象中会保存当前正在使用的浏览器中的一些属性

- `navigator.appName`
  返回当前浏览器的名称
- `navigator.appVersion`
  返回浏览器的平台和版本信息
- `navigator.platform`
  返回浏览器所运行的操作系统平台
- `navigator.userAgent`
  返回 http 中用户代理头的值，通常用来判断操作系统平台

### screen：屏幕信息

- `screen.availHeight`
  返回当前屏幕的可用高度(单位:px)
- `screen.availWidth`
  返回当前屏幕的可用宽度(单位:px)
- `screen.height`
  返回当前屏幕的总高度
- `screen.width`
  返回当前屏幕的总宽度

### Window 全局方法

- `window.open(url)`
  打开一个新的页面
- `window.close()`
  关闭当前窗口
- `setInterval(function, milliseconds, [param1, param2, ...])`
  setInterval 方法会按照 milliseconds 的时间间隔调用内部函数,返回值是一个 ID，这个 id 可以传给 clearInterval()函数来取消执行。
- `setTimeout(function, milliseconds, [param1, param2, ...])`
  延时器，会按照 milliseconds 的时间延时执行内部函数，具体执行机制请见下一篇博客[js 执行过程分析]()
- `alert(str)`
  用于向用户展示一些用户不可控的警告信息
- `confirm(str)`
  用于向用户展示一段信息并确认结果

## Object 对象的常用方法

### `Object.keys()`

获取指定对象的全部的 key

```js
let obj = { a: 1, b: 2, c: 3 };
let res = Object.keys(obj);
console.log(res);
//[ 'a', 'b', 'c' ]
```

### `Object.values()`

获取指定对象的全部的 value

```js
let obj = { a: 1, b: 2, c: 3 };
let res = Object.values(obj);
console.log(res);
//[ 1, 2, 3 ]
```

### `Object.assign()`

把一个对象中的属性值从一个对象拷贝到另一个对象。

```js
let target = { a: '1', b: '2' };
let source = { d: '4', b: '3' };
Object.assign(target, source);
console.log(target);
//{ a: '1', b: '3', d: '4' }
```

### `Object.entries()`

将 obj 转成二维 array

```js
Object.entries({ a: 1, b: 2, c: 3 }); // [["a", 1], ["b", 2], ["c", 3]]
```

## String 对象的常用方法

```js
var str = 'abcde';
```

- `str.length`
  返回字符串的长度
- `str.charAt(2)`
  返回字母"c"
- `str.indexOf('e');`
  返回索引 4(number)
- `str.concat()`
  concat()方法用来拼接字符串

```js
var str1 = 'Hello ';
var str2 = 'world!';
var n = str1.concat(str2); //Hello world!
```

- `substring()`
  截取字符串中[start,end)的连续字符(从 0 数，左闭右开)

```js
var str = 'abcdefg';
str.substring(1, 4); //"bcd"
str.substring(1); // "bcdefg"
```

- `slice()`
  用法同上，不过更为灵活，当第二个参数为负数时，则该参数规定的是从字符串的尾部开始算起的位置。

```js
var str = 'abcdefg';
str.slice(-1); //g
str.slice(1, -2); //bcde
```

::: warning
slice 方法并不会更改原变量！
:::

- `substr()`
  从第 m 个数开始，往后截取 n 个字符

```js
var str = 'Just give me a reason';
str.substr(5, 10); // "give me a "
```

- `replace()`
  查找"love"，并将其替换成"hate"

```js
var str = 'do you love me';
str.replace('love', 'hate'); // "do you hate me"
```

- `split()`
  将字符串用指定的规则分割为字符数组

```js
var str = 'How are you doing today?';
str.split(''); //H,o,w, ,a,r,e, ,y,o,u, ,d,o,i,n,g, ,t,o,d,a,y,?
// 使用limit参数
str.split(' ', 3); //How,are,you
// 自定义分隔规则
str.split('o'); //H,w are y,u d,ing t,day?
```

::: tip
与之对应的有数组的`join()`方法，可以指定数组元素以某种规则拼接成字符串
:::

- `trim()`
  去除字符串两边的空白

```js
var str = ' abc ';
str.trim(); // 'abc'
```

- `toLowerCase()`
  将字符串转成小写

```js
var str = 'JavaScript';
str.toLowerCase(); // 'javascript'
```

- `toUpperCase()`
  将字符串转成大写

```js
var str = 'JavaScript';
str.toUpperCase(); // 'JAVASCRIPT'
```

- `str.search(regexp)`
  用于搜索指定匹配的字符串,返回该匹配字符串第一次出现的位置

```js
var str = 'Visit Runoob!';
var n = str.search('Runoob'); //6
//忽略大小写
var str = 'Mr. Blue has a blue house';
str.search(/blue/i); //4
```

- `str.match(regexp)`
  match()函数会根据正则规则匹配字符串

```js
// 全局匹配"ain",且不分大小写
var str = 'The rain in SPAIN stays mainly in the plain';
var n = str.match(/ain/gi); //[ain,AIN,ain,ain]
```

## Array 对象的常用方法

- `arr.length`
  返回数组的长度
- `arr.concat(arr1,arr2,...)`
  concat()方法可用来拼接数组

```js
let a = [1, 2];
let b = [3, 4, 5];
let c = [6, 7];
let sum = a.concat(b, c);
console.log(sum); // [ 1, 2, 3, 4, 5, 6, 7 ]
```

- `foreach()`
  foreach 用于取出数组中的单个对象的值并进行操作

```js
// 将土豆的重量都加20
var potatos = [
  { id: '1001', weight: 50 },
  { id: '1002', weight: 80 },
  { id: '1003', weight: 120 },
  { id: '1004', weight: 40 },
  { id: '1005', weight: 110 },
  { id: '1006', weight: 60 },
];

potatos.forEach((potato) => (potato.weight += 20));
console.log(potatos);
```

::: tip
`map()`方法也可以实现上述操作，但`foreach()`更加语义化。
:::

- `map()`
  map()函数主要用来提取数组信息

```js
//返回potatos数组中每个土豆的重量
let w = potatos.map((potato) => {
  return potato.weight;
});
console.log(w); //[ 50, 80, 120, 40, 110, 60 ]
//将nums中的元素批量加10并返回
let nums = [1, 2, 3, 4, 5];
let y = nums.map((num) => {
  return num + 10;
});
console.log(y); //[ 11, 12, 13, 14, 15 ]
```

- `filter()`
  filter()函数主要用来筛选过滤信息

```js
let nums = [1, 2, 3, 4, 5];
let y = nums.filter((num) => {
  return num > 3;
});
console.log(y); //[ 4, 5 ]
```

- `some()`
  some()函数主要用来判断数组中是否有符合某个条件的(一个就行)

```js
let nums = [1, 2, 3, 4, 5];
let res = nums.some((num) => {
  return num > 3;
});
console.log(res); // true
let res2 = nums.some((num) => {
  return num > 6;
});
console.log(res2); // false
```

- `every()`
  对应 some(),全符合条件最终才为 true

```js
let nums = [1, 2, 3, 4, 5];

let res = nums.every((num) => {
  return num > 0;
});
console.log(res); // true
let res2 = nums.every((num) => {
  return num > 2;
});
console.log(res2); // false
```

- `find()`
  find()函数会去查找符合条件的第一个元素，并将其 value 返回

```js
let nums = [1, 2, 3, 4, 5];
let res = nums.find((num) => {
  return num > 3;
});
console.log(res); //4
```

- `findIndex()`
  对应 find(),不过返回的是 index

```js
let nums = [11, 12, 13, 14, 15];
let res = nums.findIndex((num) => {
  return num > 13;
});
console.log(res); //3
```

- `from()`
  将拥有 length 属性的对象转化为一个新的数组

```js
let obj = 'abcdef';
arr = Array.from(obj);
console.log(arr); //[ 'a', 'b', 'c', 'd', 'e', 'f' ]
let set = new Set([1, 2, 3]);
arr2 = Array.from(set);
console.log(arr2); //[ 1, 2, 3 ]
```

- `join()`
  将数组中的所有元素拼接为一个字符串

```js
let arr = [1, 'hello', 3];
let str = arr.join('|');
console.log(str); // 1|hello|3
```

- `reverse()`
  反转数组中所有的元素

```js
let nums = [1, 2, 3, 4];
let nums_rev = nums.reverse();
console.log(nums_rev); // [ 4, 3, 2, 1 ]
```

- `slice(m,n)`
  提取数组中的一部分元素(同 String 对象，左闭右开)
  ::: tip
  当调用`[].slice.call({Array-like})`时，可以将一个`类数组对象`（具有 length 属性的对象）转化为一个数组。
  :::
- `sort(function)`
  对数组中的元素进行排序

```js
//升序
let nums = [1, 5, 4, 2, 6];
let sort_nums = nums.sort((a, b) => {
  return a - b;
});
console.log(sort_nums); //[ 1, 2, 4, 5, 6 ]
```

- `splice(index,amount,item1,item2,...)` (移接)
  ::: warning
  这个方法会修改原数组！
  :::

```js
let nums = [1, 2, 3, 4, 5];
//从第二个位置开始，删除两个元素
let res = nums.splice(2, 2);
console.log(res); // [ 3, 4 ]
console.log(nums); // [ 1, 2, 5 ]
//从第二个位置开始，增加"a","b"
nums.splice(2, 0, 'a', 'b');
console.log(nums); // [ 1, 2, 'a', 'b', 5 ]
```

### 数组降维(扁平化)

#### 二维数组降维

可以采取拿空数组拼接的方法。

```js
function flat(arr) {
  let res = [].concat(...arr);
  return res;
}
let res = flat([1, 2, 3, 4, [5, 6], 7]);
console.log(res); //[ 1, 2, 3, 4, 5, 6, 7 ]
```

#### 高维数组降维

```js
function flat(arr = []) {
  //递归的终止条件:降维到一维,如果isDeep为false，则说明降维到了一维
  const isDeep = arr.some((val) => {
    return val instanceof Array;
  });
  if (!isDeep) return arr;

  //高维处理,每调一次这个方法，便会对原数组降一维
  let res = [].concat(...arr);
  return flat(res);
}
let res = flat([1, 2, 3, 4, [5, 6, [8, 8]], 7]);
console.log(res); //[ 1, 2, 3, 4, 5, 6, 7 ]
```

### 数组去重

直接借助于`Set`容器。

```js
function unique(arr) {
  let set = new Set(arr);
  return [...set];
}
let res = unique([1, 2, 3, 3, 4, 4]);
console.log(res); //[ 1, 2, 3, 4 ]
```

### Array 对象中的纯函数

1. 不改变原数组
2. 返回一个新数组

典型的纯函数有`concat()`,`map()`,`filter()`,`slice()`。

### Array.prototype.reduce()

像 map,filter，find 等方法其本质都是将一个 array 转成另一个特定的 array，只不过功能比较具体。

而 reduce 方法则是以上功能的“super version”，它允许你去自定义以自己的方式操作迭代数组，并返回特定的数组。

这个方法用起来很像 redux 中的 reducer，其实他们之间确实是有一些关联的。

具体使用也很简单，只不过 callback 第一个参数可以指定一个`initState`。这个`initState`也可以通过 reduce 方法的第二个参数手动指定。

```js
//涨价50！
let orders = [
  { amount: 250 },
  { amount: 400 },
  { amount: 100 },
  { amount: 777 },
  { amount: 888 },
];
// 利用map实现
// let priceUp = orders.map((item) => {
//   return { amount: item.amount + 50 };
// });

// console.log(priceUp);

let priceUp = orders.reduce((preState, item) => {
  //返回的结果会作为下一次的state
  let state = preState;
  state.push({ amount: item.amount + 50 });
  return state;
}, []);

console.log(priceUp);
```

#### 一行代码数组求和

```javascript
arr.reduce((pre, cur) => pre + cur);
```

#### 一行代码获取数组最大值

```javascript
arr.reduce((pre, cur) => Math.max(pre, cur));
```

#### 统计数组中元素出现的次数

```javascript
const arr = [1, 2, 1, 1, 1, 3, 1];

function getCount(arr = [], item) {
  const count = arr.reduce((pre, cur) => {
    const addCount = cur === item ? 1 : 0;
    pre += addCount;
    return pre;
  }, 0);
  return count;
}
```

## Function 对象

> 每一个 javascript 的函数其实都是一个函数对象

- `apply(obj,[arg1,arg2,...])`
  `apply()`方法的第一个参数是一个对象，这个对象会强制的将函数执行中的 this 指向自身。第二个参数是要函数传递的参数，只不过这些参数需要打包成数组然后传过去。

```js
let obj = {
  name: 'jason',
  age: 18,
};
function f1() {
  console.log(this.name);
}
f1(); //undefined
f1.apply(obj); //jason
```

在来看一个 MDN 上的一个经典的例子：将一个数组整体 push 到另一个数组中。

```js
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

- `call()`
  和`apply()`函数很类似，无非是传递参数的形式不一样。
- `bind()`
  “bind”顾名思义就是讲函数与对象绑定到一起。
  `bind()`函数也会强制更改 this 的指向，不过它不会执行函数，返回值是一份函数的引用。

```js
let obj = {
  name: 'jason',
  age: 18,
};
function f1() {
  console.log(this.name);
}
let copy = f1.bind(obj);
copy(); //jason
```

### 手写 bind 函数

```js
Function.prototype.bind1 = function() {
  //讲参数拆解为数组
  const args = Array.from(arguments);
  //获取要绑定的对象
  const obj = args.shift();

  //获取调用bind的函数对象
  const fn = this;

  //返回一个闭包函数
  return function() {
    return fn.apply(obj, args);
  };
};
```

### arguments 对象实例

<hide txt="PS：`arguments`照官方那意思应该也算是一个独立的内置对象了，但现在从MDN上看仍然是放在`函数`的目录下，这点我也非常的迷惑"></hide>

每一个函数对象中都会有一个`Arguments`对象实例`arguments`,它指的是函数的实参，是一个“类数组”(Array-like)。

既然是“类数组”，也就意味着可以用`Array.from()`或`[].slice.call()`方法将其转化为数组。

在函数内部，可以用`arguments[i]`来访问函数的某个实参。

那这个对象有啥用呢？

个人觉得最大的作用就是实现了**模拟重载**,关于重载，详见[JS 中的面向对象](./Js模拟面向对象.md)。
