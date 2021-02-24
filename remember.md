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
    let item = obj[key];
    result[key] = deepClone(item);
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
function myinstanceof(ins, obj) {
  const proto = ins.__proto__;
  if (proto) {
    if (proto === obj.prototype) {
      return true;
    } else {
      return myinstanceof(ins, proto);
    }
  }
  return false;
}
```

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

## 手写 call 函数

```js
Function.prototype.myCall = function(thisArg, ...args) {
  const fn = Symbol('fn');
  const _this = thisArg || window;
  _this[fn] = this;
  const result = _this[fn](...args);
  delete _this[fn];
  return result;
};

const obj = { a: 1111 };
function foo() {
  console.log(this.a);
}

foo.myCall(obj);
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

```js
function debounce(fn, delay) {
  let timer = null;
  return () => {
    if (timer) {
      clearTimeout(timer); //实现节流这里直接return
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  };
}
```

## 数组扁平化

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

## split 和 join 的区别

可以实现数组和字符串的互换。
`split`可以将字符串分成数组，`join`反之。

## slice 和 split 的区别

`slice(start,end)`: 切片，是纯函数，可以将字符串(数组)指定的部分裁剪下来。
`splice(start,deleteLength,...[params])`: 移接，不是纯函数，可以将字符串(数组)指定的部分替换下来。

## Object.create()

可以创建一个对象，并且指定原型
