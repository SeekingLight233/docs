---
title: Js基础知识点二周目整理
date: 2020-1-12
categories: 
 - 前端
tags: 
 - 待定
sidebarDepth: 5
sidebar: "auto"
---
## Js中类型分类
### 原始类型
- 包括number/string/boolean/null/undefined/symbol;

- 原始类型中存的都是值，是不可能调出任何函数的。
但 `2333.3333.toFixed(2)` 之所以能调用是因为被js强制转型成了**Number对象**。

- null如果用typeof检查类型发现是Object，其实这是js的一个老bug。。。

- symbol是ES6中新增的原始类型，它可以用来生成唯一的标志来避免命名冲突。
``` js
  let obj = {
    [Symbol(01)]: "hello",
    [Symbol(01)]: "world",
};

console.log(Object.getOwnPropertySymbols(obj).map(sym => obj[sym]));
 // [ 'hello', 'world' ]
```
通过调用`Symbol()`方法来创建symbol实例，即便传入参数一样也不影响。

最终如果要拿对象中**symbol作为键的值**的话可以用`Object.getOwnPropertySymbols(obj).map(sym => obj[sym])`。
### 对象类型
- 对象类型里面存的是地址
- 如果函数参数是对象的话（假设传过来的这个对象叫p1），千万不要用`person = {...}`的形式修改传进来的对象(person是函数的形参)，你会发现根本修改不了。
``` js
function test(person) {
    person = {
        name: 'yyy',
        age: 30
    }
}
const p1 = {
    name: 'yck',
    age: 25
}
test(p1)
console.log(p1.age) // 25
```
> 最终可以发现，p1.age的值仍然是25。
> 
因为这等于是重新为person分配了一个新的对象，已经和p1没有关系了，请看下图
![](./re_js/01.png)
## typeof和instanceof
- typeof可以检查原始类型(除了null)，但是在检查对象类型的时候，除了函数能显示出一个function以外，其他的统统显示的是object
- 如果要判断对象到底是什么类型，可以用`instanceof `,但是需要提前知道对象的具体类型，因此也不是非常的灵活。
``` js
function Foo() {};
let foo = new Foo();
//foo是否是Foo的实例呢？
console.log(foo instanceof Foo); // true
```
## 类型转换
### 转boolean
通过`Boolean()`方法可以强制转换任意值为boolean类型，除了`undefined`,`null`,`-0`,`+0`,`NaN`,`""`以外，其余的值都是true。
### 转数字
通过`Number()`方法可以强制转换任意类型为number类型。
### 转字符串
通过`String()`方法可以强制转换任意类型为字符串，具体的转换效果可以参考下表
![](./re_js/02.png)
## js的作用域与作用域链
js中的每一个变量或者说函数都会有一个作用的范围，这个范围就叫作用域。
而作用域链指的是在js中查找一个变量的过程，会从最内层开始找，逐步找到最外层。
``` js
var a = 1;
function f1() {
    var b = 200;
    console.log(a);
    console.log(b);
}
f1();
//1
//200
```
## 闭包
*不得不承认闭包这个概念对于我这种“一句话描述党”真的是个灾难。*
简单理解为有权限访问另一个函数作用域的函数,通常表现为对另一个被返回函数的引用。
下面代码中的 ==closure()== 就是一个闭包。
```js
function makefunc() {
    var name = "jason2";

    function closure() {
        console.log(name);
    }
    return closure;
}
var clo = makefunc();
clo();//jason2
```
闭包有一个重要的特性。
- 创建了闭包之后，一旦调用，会延长作用域链，直到闭包不存在。
```js
function makeAdder(x) {
    return function(y) {
        return x + y;
    }
}
var add5 = makeAdder(5);
var add10 = makeAdder(10);
console.log(add5(2));
console.log(add10(2));
// 释放对闭包的引用
add5 = null;
add10 = null;
```
在上面这段代码中，add5和add10都是**对闭包的引用**，按理来说在别的语言中，==clo(),add5(),add10()== 都是不可能执行成功的——makeAdder()已经执行完了啊，内部的变量不应该已经被销毁了么？但最后“jason2”和下面的两个结果都打印出来了说明javascript中由于函数创建产生闭包的机制延长了函数的作用域链。

闭包最大的作用就是用来模拟一个类，从而间接实现面向对象编程。
``` js
// 实现一个模拟的name类，包含set和get方法
var Name = function() {
    var name = "未定义";
    return {
        getName() {
            return name;
        },
        setName(new_name) {
            name = new_name;
        }
    }
}(); //加小括号直接执行这个闭包引用
console.log(Name.name);
Name.setName("Jasonlee");
console.log(Name.getName());
```
## this的指向判断问题
一句话：this永远指向**最后调用this的函数所处的对象**
::: warning
这里的对象指的是"狭义"的对象，不包括函数对象(Function Object)。
:::
看下面几个demo，然后问自己两个问题。
最后调用this的函数是谁？它所处的**对象**在哪？
```js
var name = "windowsName";
    function a() {
        var name = "Cherry";
        console.log(this.name);          // windowsName
        console.log("inner:" + this);    // inner: Window
    }
a();
//调用this的函数是谁？是a()
//a()所处的对象在哪？在全局

var name = "windowsName";
    var a = {
        name: "Cherry",
        fn : function () {
            console.log(this.name);      // Cherry
        }
    }
a.fn();
//调用this的函数是谁？是fn()
//fn()所处的对象在哪？在对象a里面

var name = "windowsName";
    var a = {
        name: "Cherry",
        fn : function () {
            console.log(this.name);      // Cherry
        }
    }
window.a.fn();
//调用this的函数是谁？是fn()
//fn()所处的对象在哪？在对象a里面
```
## js中常用的dom操作
### 创建
- **createElement创建元素**
``` js
var elem = document.createElement("div");  
elem.id = 'haorooms';  
elem.style = 'color: red';  
elem.innerHTML = '我是新创建的haorooms测试节点';
//创建完之后不要忘了给追加上去
document.body.appendChild(elem);
```
### 查找
- **document.getElementById**
根据ID查找元素，大小写敏感，如果有多个结果，只返回第一个。
- **document.getElementsByClassName**
根据类名查找，会返回一个集合。
- **document.getElementsByTagName**
根据标签名查找，会返回一个集合。
- **document.getElementsByName**
根据元素的name属性查找，返回一个 NodeList
- **document.querySelector**
通过制定选择器返回单个元素，挺灵活的一个方法。

### 修改
- **appendChild**
用于向节点的子节点列表追加新的子节点。
- **appendChild**
用于向节点的子节点列表前追加新的子节点。
- **insertAdjacentHTML**
也是一个用于追加的挺好用的api，具体使用参考[原生js操作dom方法之insertAdjacentHTML](https://www.jianshu.com/p/112bc211c39e)
### 删除
- **removeChild**
removeChild用于删除指定的子节点并返回子节点
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

## Math对象的常用方法
## Array对象的常用方法
## 事件委托、事件冒泡、事件捕获
## 谈一谈js方法参数argument
## addEventlistener和正常的onclick=()=> 有什么区别
## 为什么 0.1 + 0.2 != 0.3
## `==`和`===`
## 深拷贝与浅拷贝
## 原型
## instanceof 的原理
## call，apply，bind函数的区别
## new和object.creat的区别
## js的垃圾回收机制
---
*下面这块算es6的部分了*
## 箭头函数
## 手写promise
## set和map
## 解构赋值
## var，let和const
## generator
## class继承和原型继承
## es6中的模块化
## es6中新增的正则符号
## Proxy
## map,filter，reduce
