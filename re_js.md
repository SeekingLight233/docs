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
## instanceof的实现原理
看代码其实很好理解，就是一个递归往上进行判断的过程。
``` js
function myinstantof(ins, origin_obj) {
    //首先第一步先拿到判断实例的原型对象
    const proto = ins.__proto__;
    //如果这个实例对象存在...
    if (proto) {
        if (proto === origin_obj.prototype) {
            return true;
        } else {
            //如果判断不等的话让这个判断对象继续递归往原型链上判断
            return myinstantof(proto, origin_obj);
        }
    }
    return false;
}
```
## 类型转换
### 转boolean
通过`Boolean()`方法可以强制转换任意值为boolean类型，除了`undefined`,`null`,`-0`,`+0`,`NaN`,`""`以外，其余的值都是true。
### 转数字
通过`Number()`方法可以强制转换任意类型为number类型。
### 转字符串
通过`String()`方法可以强制转换任意类型为字符串，具体的转换效果可以参考下表
![](./re_js/02.png)
## `==`和`===`
==只会比较value，===更加严格，除了比较value还会检查类型。
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
## 执行上下文
> 解释下“全局执行上下文“和“函数执行上下文”。
### 全局执行上下文
当js引擎第一次遇到你的script时，会先创建一个全局执行的"小环境",这个全局执行的“小环境”就是所谓的Global Execution Context，此时这个执行的全局context会被压入执行栈。
### 函数执行上下文
当js引擎遇到函数调用时，会为该函数创建一个独立的context并压入执行栈中。
### 执行上下文具体创建的过程
会经历创建阶段和执行阶段，在创建阶段会去绑定this的指向，分配词法环境与变量环境；在执行阶段会先去完成对变量的分配，最后执行代码。
## 深拷贝与浅拷贝
首先先看这样的一个问题。

我需要将一个对象拷贝到另一个对象上。
<hide txt="以下内容皆为真实案例"></hide>
我刚学js的时候，理所当然会想到用等号，最开始还没什么大问题，直到有一天，我遇到了下面这个对象。。。

``` js
let obj1 = {
        a: 1,
        b: ["1", "2", "3"],
        c: "hello"
    }
let obj2 = {};
```
我的目标很简单，就是将`obj1`拷贝到`obj2`上，让`obj2`作为一个临时的**snapshot**(快照)。

我像往常一样，写下了`obj2 = obj1`。

但接下来当我修改`obj1`的值的时候，`obj2`竟然也发生了变化。
``` js
obj2 = obj1;
// obj1.b[2] = "33333";
obj1.a = 111111;
console.log(obj1);//{ a: 111111, b: [ '1', '2', '3' ], c: 'hello' }
console.log(obj2);//{ a: 111111, b: [ '1', '2', '3' ], c: 'hello' }
```
很明显，这和我的需求是违背的。

最终经过查阅资料和验证，我得到了下面的结论。

**在javascript中，当用=进行赋值操作时，只有基础的数据类型传递的是值，而对象(包括函数对象)传递的只是引用！**

那有什么方法来解决上面的问题呢？
### `Object.assign()`实现对象内元素浅拷贝
第一种方法，就是使用`Object.assign()`方法进行拷贝操作。
``` js
let obj1 = {
    a: 1,
    b: ["1", "2", "3"],
    c: "hello"
}
let obj2 = {};

for (let x in obj1) {
    obj2[x] = obj1[x];
}
Object.assign(obj2, obj1);
obj1.a = 111111111111;
console.log(obj1); //{ a: 111111111111, b: [ '1', '2', '3' ], c: 'hello' }
console.log(obj2); //{ a: 1, b: [ '1', '2', '3' ], c: 'hello' }

obj1.b[2] = "3333333333";
console.log(obj1);//{ a: 111111111111, b: [ '1', '2', '3333333333' ], c: 'hello' }
console.log(obj2);//{ a: 1, b: [ '1', '2', '3333333333' ], c: 'hello' }
```
这种方法本质上只是迭代对象中的每一个键值对，然后给赋值过去，如果对象里都是基本类型那还好，万一有对象还是要GG。所以实现深拷贝才是根本途径。

第二种方法就是用`JSON.parse(JSON.stringify(obj))`,但这种方法也有局限性，如果要拷贝的目标是一个**函数对象**或者**类的实例**，就会报错。

所以说，实现深拷贝是很有必要的一件事，实现起来也并不是很难。
### 手写深拷贝
实现的逻辑很简单，还是进行遍历赋值，如果遇到了对象类型就递归下去，直到最里层都为基本类型为止。
``` js
function deepClone(target_obj, source_obj) {
    for (let key in source_obj) {
        //首先先将要拷贝的内容拿出来并判断类型
        let item = source_obj[key];
        //如果是数组或者是对象，就递归下去进行赋值，直到“头”是基本类型为止
        if (item instanceof Array) {
            target_obj[key] = [];
            deepClone(target_obj[key], item);
        } else if (item instanceof Object) {
            target_obj[key] = {};
            deepClone(target_obj[key], item);
        } else {
            target_obj[key] = item;
        }
    }
}

let obj1 = {
    a: 1,
    b: ["1", "2", "3"],
    c: "hello"
}
let obj2 = {};

deepClone(obj2, obj1);
obj1.b[0] = "111111111";
console.log(obj2);
//{ a: 1, b: [ '1', '2', '3' ], c: 'hello' }
```

## js的垃圾回收机制
总的来说就是定时去检查程序中不再被引用的内存，然后将其释放。
``` js
var a = "苟利国家生死以";
var b = "岂因祸福避趋之"；
var a = b;
```
当系统检测到`苟利国家生死以`没有被引用时，就会自动将其释放。
### 标记清除
js中最常用的一种GC方法。
给处于在运行阶段的变量加上一个**进入环境**的标记，当这个变量不再被需要的时候，就将其标记为**离开环境**，并等待垃圾回收。
``` js
// 在预编译阶段，将m,n,add() 标记为进入环境。
var m = 0,n = 19 
add(m, n) // 在函数执行阶段，将a, b, c标记为进入环境。
console.log(n) // 函数执行结束后，a,b,c标记为离开环境，等待垃圾回收。
function add(a, b) {
  a++
  var c = a + b
  return c
}
```
---
*下面这块算es6的部分了*
## let、var和const
## 解构赋值
## 箭头函数
## promise
## Proxy
## set和map
## generator
## es6中的模块化
## es6中新增的正则符号

