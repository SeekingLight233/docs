---
title: 前端面试手写合集
date: 2020-3-14
categories:
  - 前端
tags:
  - 面试
sidebarDepth: 5
sidebar: 'auto'
---

## 函数柯里化

```js
function sum(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  // 返回一个科里化后的函数
  return function curried(...args) {
    // 接收剩余参数
    if (args.length === fn.length) return fn(...args);
    return function() {
      // arguments是被科里化后的剩余参数
      // args是第一次传进来的参数
      return curried(...args.concat(Array.from(arguments)));
    };
  };
}

const currySum = curry(sum);

// 第一种情况  直接传递全部参数
// console.log(currySum(1, 2, 3));
// 第二种情况  传递部分参数
console.log(currySum(1)(2, 3));
```

## 手写 new 操作符

```js
function newOperate(func, ...args) {
  if (typeof func !== 'function') {
    throw new Error('not function');
  }

  const newObj = Object.create(func.prototype);
  // 将构造函数里的this指向这个对象，并执行构造函数
  const result = func.apply(newObj, args);
  // 注意  如果构造函数里面返回了一个对象，那么就优先返回这个对象
  return result instanceof Object ? result : newObj;
}
```

## 深拷贝

```js
function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) {
    // 基本类型没必要深拷贝
    return obj;
  }
  let result = null;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }

  for (let key in obj) {
    // 保证key不是原型上的属性
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
```

## 手写深度比较

```js
function isObject(obj) {
  if (obj && typeof obj === 'object') {
    return true;
  } else {
    return false;
  }
}

function isEquel(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key in obj1) {
    const res = isEquel(obj1[key], obj2[key]);
    if (!res) return false;
  }
  return true;
}
```

## 手写 instanceof

```js
function myInstanceof(ins, obj) {
  const __proto__ = ins.__proto__;
  if (__proto__) {
    if (__proto__ === obj.prototype) {
      return true;
    } else {
      return myInstanceof(ins, __proto__);
    }
  }
  return false;
}
```

## 手写继承

```js
function Animal(name, age) {
  this.name = name;
  this.age = age;
}

Animal.prototype.run = function() {
  console.log('running!!!');
};

function Cat(name, age, weight) {
  Animal.call(this, name, age);
  this.weight = weight;

  //@override
  Cat.prototype.run = function() {
    console.log('cat running!!!');
  };
}

// core code

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
```

## 手写 call 函数

```js
Function.prototype.myCall = function(thisArg = window, ...args) {
  // 防止覆盖原有属性
  const fn = Symbol('fn');
  // core code
  thisArg[fn] = this; // 把真正的this对象存到穿进来的对象的函数上
  // 执行并返回结果
  const result = thisArg[fn](...args);
  delete thisArg[fn];
  return result;
};

const obj = { a: 1111 };
function foo() {
  console.log(this.a);
}

foo.myCall(obj);
```

## 手写 apply 函数

一模一样 只不过传参的形式不一样（没有那三个点了）

## 手写 bind 函数

```js
Function.prototype.mybind = function() {
  const args = Array.from(arguments);
  const obj = args.shift();
  return () => {
    return this.apply(obj, args);
  };
};
```

## 手写一个通用的事件绑定函数，考虑事件委托

```js
/**
 *
 * @param {*} elem 绑定事件的元素
 * @param {string} type 事件类型
 * @param {*} selector 范围
 * @param {*} fn 触发的事件
 */
const bindEvent = (elem, type, selector, fn) => {
  if (fn == null) {
    fn = selector;
    selector = null;
  }

  elem.addEventListener(type, (e) => {
    const target = e.target;
    if (selector) {
      if (target.matches(selector)) {
        fn.call(target, e);
      }
    } else {
      fn.call(target, e);
    }
  });
};

const father = document.getElementById('#father');
bindEvent(father, 'click', '.green-btn', (e) => {
  console.log(e.target.innerHtml);
});
```

## 手动封装 ajax

```js
const ajax = (url, method) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject('网络异常');
      }
    };
    xhr.send();
  });
};

(async () => {
  const res = await ajax('https://www.jixieclub.com:3002/list?Pnum=1', 'GET');
  console.log(res);
})();
```

## 防抖/节流

利用闭包来保存 setTimeout 的返回值。

每当有新的动作时，都将前一个返回值给 clear 掉。

```js
function debounce(fn, delay) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
```

节流的话 timer 条件内部 return 并且要在 setTimeout 后置位 null

## 数组扁平化

### 递归

```js
function flat(arr) {
  const isDeep = arr.some((item, index) => {
    return item instanceof Array;
  });
  if (!isDeep) return arr;

  const res = [].concat(...arr);
  return flat(res);
}
```

### reduce

```js
function flat(arr = []) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
}
```

## 数组中的各种方法

### filter

```js
Array.prototype.myFilter = function(cb) {
  if (!Array.isArray(this)) {
    throw new Error('This method only be used on Array!');
  }
  const res = [];
  for (let index = 0; index < this.length; index++) {
    if (cb(this[index], index)) {
      res.push(this[index]);
    }
  }
  return res;
};
```

### map

```js
Array.prototype.myMap = function(cb) {
  if (!Array.isArray(this)) {
    throw new Error('This method only be used on Array!');
  }
  const res = [];
  for (let index = 0; index < this.length; index++) {
    const item = cb(this[index], index);
    res.push(item);
  }
  return res;
};
```

### foreach

比 map 还简单 连返回值都没有

```js
Array.prototype.myForeach = function(cb) {
  if (!Array.isArray(this)) {
    throw new Error('This method only be used on Array!');
  }
  for (let index = 0; index < this.length; index++) {
    cb(this[index], index);
  }
};
```

### reduce

```js
Array.prototype.myReduce = function(cb, pre) {
  if (!Array.isArray(this)) {
    throw new Error('This method only be used on Array!');
  }
  for (let index = 0; index < this.length; index++) {
    if (pre == null) {
      // 如果没有初始值，就把第一项作为pre
      pre = cb(this[index], this[index + 1], index + 1);
    } else {
      pre = cb(pre, this[index], index);
    }
  }
  return pre;
};
```

## 单例模式

```ts
class Singleton {
  private static instance: Singleton;
  private constructor() {
    console.log('init!!!');
  }
  public static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  otherMethods() {}
}
// usage
const ins = new Singleton(); //error
const ins2 = Singleton.getInstance();
```

## 数组去重

```js
[...new Set(sourceArr)];
```

## Promise.all & Promise.race

```js
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.value = null;
    try {
      executor(this.resolve.bind(this), this.resolve.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.value = value;
      this.status = MyPromise.FULFILLED;
    }
  }

  reject(value) {
    if (this.status === MyPromise.PENDING) {
      this.value = value;
      this.status = MyPromise.REJECTED;
    }
  }
  // 模拟实现all方法
  static all(promises) {
    return new Promise((resolve, reject) => {
      const values = [];

      promises.foreach((promise) => {
        promise.then(
          (value) => {
            values.push(value);
            if (promises.length === values.length) {
              resolve(values);
            }
          },
          (reason) => {
            // 有任何一个失败都会出发reject
            reject(reason);
          }
        );
      });
    });
  }

  // 模拟实现race
  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.foreach((promise) => {
        promise.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }
}
```

## 实现一个 sleep/timeout 函数

```js
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

function sleep(n) {
  let start = new Date().getTime();
  while (true) {
    if (new Date().getTime() - start > n) {
      break;
    }
  }
}
```

## Promise 并发控制

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.workingNums = 0; // 记录当前正在执行的任务数
    this.list = []; // 存储所有待执行的异步任务
  }
  add(promiseFn) {
    // 注意  add函数传进来的是一个promiseFn，调用后才是一个promise
    this.list.push(promiseFn);
  }

  start() {
    // 首先上来同时执行limit个next任务
    for (let i = 0; i < this.limit; i++) {
      this.next();
    }
  }

  next() {
    if (this.list.length && this.workingNums < this.limit) {
      this.workingNums++;
      const curTask = this.list.shift();
      curTask().then(() => {
        // 执行完了更新this.workingNums
        this.workingNums--;
        // 空出了位置  继续调用
        this.next();
      });
    }
  }
}

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  scheduler.add(() =>
    timeout(time).then(() => {
      console.log(order);
    })
  );
};

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);

scheduler.start();
```

## 手写千分位分隔符

```js
function numFormat(num) {
  num = num.toString().split('.'); // 分隔小数点
  let arr = num[0].split(''); // 转换成字符数组
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(','); // 添加分隔符
    }
    res.push(arr[i]);
  }
  if (num[1]) {
    res = res.join('').concat('.' + num[1]);
  } else {
    res = res.join('');
  }
  return res;
}

let b = 673439.45421515;
console.log(numFormat(b)); // "673,439.4542"
```

## 观察者模式

```ts
// 发布者
class Subject {
  state: number;
  observers: Array<Observer>;
  constructor() {
    this.state = 0;
    this.observers = []; //订阅人列表
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }
  /**
   * @description 更新状态后  需要通知所有订阅人
   */
  notifyAllObservers() {
    this.observers.forEach((observer) => {
      observer.update();
    });
  }

  /**
   * @description 添加新的订阅人(观察者)
   */
  addObserver(observer) {
    this.observers.push(observer);
  }
}

// 订阅人
class Observer {
  name: string;
  subject: Subject;
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    // 在构造器中将当前的订阅人推入订阅列表中
    this.subject.addObserver(this);
  }
  update() {
    console.log(`${this.name} update,state is ${this.subject.getState()}`);
  }
}

// Test
let subject = new Subject();

let observer1 = new Observer('订阅人1', subject);
let observer2 = new Observer('订阅人2', subject);

subject.setState(0); // 会通知所有订阅人
// 订阅人1 update,state is 0
// 订阅人2 update,state is 0
setTimeout(() => {
  // 订阅人1 update,state is 1
  // 订阅人2 update,state is 1
  subject.setState(1);
}, 2000);
```

## eventEmitter

```js
class EventEmitter {
  constructor() {
    // 维护所有的监听者
    this.listeners = {};
  }
  // 注册事件,并添加监听者，每一个监听者就是一个cb
  on(type, cb) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(cb);
  }

  // 发布事件
  emit(type, ...args) {
    if (this.listeners[type]) {
      // 执行每一个监听者
      this.listeners[type].forEach((cb) => cb(...args));
    }
  }

  // 解绑事件中的某个监听者
  off(type, cb) {
    if (this.listeners[type]) {
      const targetIndex = this.listeners[type].findIndex((item) => item === cb);
      // 如果这个事件的监听者存在
      if (targetIndex !== -1) {
        this.listeners[type].splice(targetIndex, 1);
      }
      if (this.listeners[type].length === 0) {
        delete this.listeners[type];
      }
    }
  }

  // 移除某个事件的所有监听者
  offAll(type) {
    if (this.listeners[type]) {
      delete this.listeners[type];
    }
  }
}

const event = new EventEmitter();
event.on('event1', () => {
  console.log('This is event 1');
});

event.emit('event1');
```

## split 和 join 的区别

可以实现数组和字符串的互换。
`split`可以将字符串分成数组，`join`反之。

## slice 和 split 的区别

`slice(start,end)`: 切片，是纯函数，可以将字符串(数组)指定的部分裁剪下来。
`splice(start,deleteLength,...[params])`: 移接，不是纯函数，可以将字符串(数组)指定的部分替换下来。

## Object.create()

可以创建一个对象，并且指定原型

## 滚动加载的实现

```js
window.addEventListener('scroll', function() {
  // 视口高度
  const clientheight = document.documentElement.clientHeight;
  // 视口顶部距离最上层的高度
  const scrollTop = document.documentElement.scrollTop;
  // 整个body的滚动高度
  const scrollHeight = document.documentElement.scrollHeight;

  if (clientheight + scrollTop >= scrollTop) {
    // 触发相应操作
  }
});
```

## 图片懒加载

思路一：`img`标签上设置`loading="lazy"`.
思路二：图片设置一个默认的 url，判断图片出现在可视区域内，替换为真实的 url

利用`element.getBoundingClientRect()`可以获取元素相对于 body 的位置，如果滚动高度>它，就说明出现在了可视区域内部

## 打印当前网站用了多少种 HTML 元素

```js
const allTag = [...document.querySelectorAll('*')].map((el) => el.tagName);
const res = [...new Set(allTag)].length;
console.log(res);
```

### 将 vdom 转变为真实的 dom 结构

```js
const vdom = {
  tag: 'div',
  attrs: {
    class: 'red',
  },
  children: [
    {
      tag: 'span',
      attrs: {
        class: 'bold',
      },
      children: ['This is text node'],
    },
    192,
  ],
};

function render(vdom, container) {
  const dom = convert(vdom);
  container.appendChild(dom);
}

function convert(vnode) {
  // 子节点
  if (typeof vnode === 'number') {
    vnode = String(vnode);
  }
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // 普通节点转换
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  // 此时以当前节点为父容器  进行递归转换
  vnode.children.forEach((child) => render(child, dom));
  return dom;
}
// #######################################################
// test
const container = document.querySelector('#app');

render(vdom, container);
```

### 数组转树

```ts
const arr = [
  { id: 1, name: '部门A', parentId: 0 }, // 0代表根节点
  { id: 2, name: '部门B', parentId: 1 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 2 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
];

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

type Item = typeof arr[0];

const convert = (arr: Item[]) => {
  const idToTreeNode = new Map<number, TreeNode>();

  let root = null;

  arr.forEach((item) => {
    const pNode = idToTreeNode.get(item.parentId);
    if (!pNode) {
      // 说明此节点为根节点
      root = {
        id: item.id,
        name: item.name,
        children: [],
      };
      idToTreeNode.set(item.id, root);
    } else {
      const curNode = {
        id: item.id,
        name: item.name,
        children: [],
      };
      pNode.children.push(curNode);
      idToTreeNode.set(item.id, curNode);
    }
  });

  return root;
};

const res = convert(arr);
console.log(JSON.stringify(res));
```

## 获取详细的数据类型

```ts
Object.prototype.toString.call(someType);
```

## reduce系列
### getRever