---
title: js对象常用api整理
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
sidebar: "auto"
---

## js中常用的bom方法
### history全局对象
> history对象里保存用户的上网记录

- `history.back()`
加载 history 列表中的前一个 URL
- `history.forward()`
加载 history 列表中的后一个 URL
- `history.go(-3)`
加载 history 列表中的某个具体页面,这个例子中是后退三页(作用等效于按三次返回键)
### localStorage全局对象
> localStorage对象用于在浏览器中存储键值对数据

``` js
localStorage.setItem("name", "jason");
var name = localStorage.getItem("name");
```
### location全局对象
> location对象中会包含当前的url信息
- `location.hostname`
返回当前url的主机名
- `location.port`
返回当前url的端口号
- `location.href`
返回完整的url
- `location.pathname`
返回完整的目录和文件名
- `location.search`
返回url中查询字符串（'？name=fafa&sex=male'）
- `location.protocol`
返回当前url使用的协议
- `location.assign(url)`
打开一个新的url，并创建记录
- `location.reload();`
刷新当前页面
- `location.replace(newURL)`
用一个新的页面来替换当前的页面
### navigator全局对象
> navigator对象中会保存当前正在使用的浏览器中的一些属性
- `navigator.appName`
返回当前浏览器的名称
- `navigator.appVersion`
返回浏览器的平台和版本信息
- `navigator.platform`
返回浏览器所运行的操作系统平台
- `navigator.userAgent`
返回http中用户代理头的值，通常用来判断操作系统平台
### screen全局对象
- `screen.availHeight`
返回当前屏幕的可用高度(单位:px)
- `screen.availWidth`
返回当前屏幕的可用宽度(单位:px)
- `screen.height`
返回当前屏幕的总高度
- `screen.width`
返回当前屏幕的总宽度
### Window全局方法
- `window.open(url)`
打开一个新的页面
- `window.close()`
关闭当前窗口
- `setInterval(function, milliseconds, [param1, param2, ...])`
setInterval方法会按照milliseconds的时间间隔调用内部函数,返回值是一个ID，这个id可以传给clearInterval()函数来取消执行。
- `setTimeout(function, milliseconds, [param1, param2, ...])`
延时器，会按照milliseconds的时间延时执行内部函数，具体执行机制请见下一篇博客[js执行过程分析]()
- `alert(str)`
用于向用户展示一些用户不可控的警告信息
- `confirm(str)`
用于向用户展示一段信息并确认结果
## String对象的常用方法
``` js
var str = "abcde";
```
- `str.length`
返回字符串的长度
- `str.charAt(2)`
返回字母"c"
- `str.indexOf('e');`
返回索引4(number)
- `str.concat()`
concat()方法用来拼接字符串
``` js
var str1 = "Hello ";
var str2 = "world!";
var n = str1.concat(str2);//Hello world!
```
- `substring()`
截取字符串中[start,end)的连续字符(从0数，左闭右开)
``` js
var str = 'abcdefg';
str.substring(1, 4); //"bcd"
str.substring(1); // "bcdefg"
```
- `slice()`
用法同上，不过更为灵活，当第二个参数为负数时，则该参数规定的是从字符串的尾部开始算起的位置。
``` js
var str = 'abcdefg';
str.slice(-1) //g
str.slice(1, -2) //bcde
```

- `substr()`
从第m个数开始，往后截取n个字符
``` js
var str = "Just give me a reason";
str.substr(5, 10); // "give me a "
```
- `replace()`
查找"love"，并将其替换成"hate"
``` js
var str = "do you love me";
str.replace('love','hate'); // "do you hate me"
```
- `split()`
将字符串分割为字符数组
``` js
var str="How are you doing today?";
str.split("");//H,o,w, ,a,r,e, ,y,o,u, ,d,o,i,n,g, ,t,o,d,a,y,?
// 使用limit参数
str.split(" ",3);//How,are,you
// 自定义分隔规则
str.split("o");//H,w are y,u d,ing t,day?
```
- `trim()`
去除字符串两边的空白
``` js
var str = ' abc ';
str.trim(); // 'abc'
```
- `toLowerCase()`
将字符串转成小写
``` js
var str = 'JavaScript';
str.toLowerCase(); // 'javascript'
```
- `toUpperCase()`
将字符串转成大写
``` js
var str = 'JavaScript';
str.toUpperCase(); // 'JAVASCRIPT'
```
- `str.search(regexp)`
用于搜索指定匹配的字符串,返回该匹配字符串第一次出现的位置
``` js
var str="Visit Runoob!"; 
var n=str.search("Runoob"); //6
//忽略大小写
var str="Mr. Blue has a blue house";
str.search(/blue/i); //4
```
- `str.match(regexp)`
match()函数会根据正则规则匹配字符串
``` js
// 全局匹配"ain",且不分大小写
var str="The rain in SPAIN stays mainly in the plain"; 
var n=str.match(/ain/gi);//[ain,AIN,ain,ain]
```
## Array对象的常用方法
- `arr.length`
返回数组的长度
- `arr.concat(arr1,arr2,...)`
concat()方法可用来拼接数组
``` js
let a = [1, 2]
let b = [3, 4, 5]
let c = [6, 7]
let sum = a.concat(b, c);
console.log(sum) // [ 1, 2, 3, 4, 5, 6, 7 ]
```
- `foreach()`
foreach用于取出数组中的值并进行操作
``` js
// 将土豆的重量都加20
var potatos = [{ id: '1001', weight: 50 },
    { id: '1002', weight: 80 },
    { id: '1003', weight: 120 },
    { id: '1004', weight: 40 },
    { id: '1005', weight: 110 },
    { id: '1006', weight: 60 }
]

potatos.forEach(potato => potato.weight += 20);
console.log(potatos)
```
::: tip
`map()`方法也可以实现上述操作，但`foreach()`更加语义化。
:::
- `map()`
map()函数主要用来提取数组信息
``` js
//返回potatos数组中每个土豆的重量
let w = potatos.map(potato => {
    return potato.weight;
})
console.log(w);//[ 50, 80, 120, 40, 110, 60 ]
//将nums中的元素批量加10并返回
let nums = [1, 2, 3, 4, 5];
let y = nums.map(num => {
    return num + 10
})
console.log(y);//[ 11, 12, 13, 14, 15 ]
```
- `filter()`
filter()函数主要用来筛选过滤信息
``` js
let nums = [1, 2, 3, 4, 5]
let y = nums.filter(num => {
    return num > 3
})
console.log(y);//[ 4, 5 ]
```
- `some()`
some()函数主要用来判断数组中是否有符合某个条件的(一个就行)
``` js
let nums = [1, 2, 3, 4, 5];
let res = nums.some(num => {
    return num > 3
})
console.log(res);// true
let res2 = nums.some(num => {
    return num > 6
});
console.log(res2);// false
```
- `every()`
对应some(),全符合条件最终才为true
``` js
let nums = [1, 2, 3, 4, 5]

let res = nums.every(num => {
    return num > 0
})
console.log(res);// true
let res2 = nums.every(num => {
    return num > 2
});
console.log(res2);// false
```
- `find()`
find()函数会去查找符合条件的第一个元素，并将其value返回
``` js
let nums = [1, 2, 3, 4, 5]
let res = nums.find(num => {
    return num > 3
})
console.log(res); //4
```
- `findIndex()`
对应find(),不过返回的是index
``` js
let nums = [11, 12, 13, 14, 15]
let res = nums.findIndex(num => {
    return num > 13
})
console.log(res); //3
```
- `from()`
将拥有length属性的对象转化为一个新的数组
``` js
let obj = "abcdef"
arr = Array.from(obj);
console.log(arr);//[ 'a', 'b', 'c', 'd', 'e', 'f' ]
let set = new Set([1,2,3])
arr2 = Array.from(set);
console.log(arr2);//[ 1, 2, 3 ]
```
- `join()`
将数组中的所有元素拼接为一个字符串
``` js
let arr = [1, "hello", 3]
let str = arr.join("|");
console.log(str) // 1|hello|3
```
- `reverse()`
反转数组中所有的元素
``` js
let nums = [1, 2, 3, 4];
let nums_rev = nums.reverse();
console.log(nums_rev);// [ 4, 3, 2, 1 ]
```
- `slice(m,n)`
提取数组中的一部分元素(同String对象，左闭右开)
- `sort(function)`
对数组中的元素进行排序
``` js
//升序
let nums = [1, 5, 4, 2, 6];
let sort_nums = nums.sort((a, b) => {
    return a - b;
})
console.log(sort_nums);//[ 1, 2, 4, 5, 6 ]
```
- `splice(index,amount,item1,item2,...)`
::: warning
这个方法会修改原数组！
:::
``` js
let nums = [1, 2, 3, 4, 5];
//从第二个位置开始，删除两个元素
let res = nums.splice(2, 2);
console.log(res); // [ 3, 4 ]
console.log(nums); // [ 1, 2, 5 ]
//从第二个位置开始，增加"a","b"
nums.splice(2, 0, "a", "b");
console.log(nums); // [ 1, 2, 'a', 'b', 5 ]
```