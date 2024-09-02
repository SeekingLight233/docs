---
title: Rxjs火速上手
date: 2022-3-19
categories:
  - 前端
  - 编程范式
tags:
  - Observable
  - 响应式编程
sidebarDepth: 5
sidebar: 'auto'
---

## 核心概念

### Observable

可观察的对象。可以理解为一个盒子，里面包装了需要被观察的**东西**。这些东西可以是`网络请求`、`鼠标点击事件`等这样的`异步逻辑`，也可以是`1`,`"abc"`,`{name:jason}`这样的静态值。

行为上和 Promise 有些类似，但具备更多的能力。

### Observer

观察者。既然有 Observable，必然有一个发起观察的`观察者`。它是一个包含了三个回调函数的对象，这些回调函数定义了`Observable`在不同阶段的行为。

### subscribe

订阅。用来连接`Observable`和`Observer`。 

```ts
import { Observable } from 'rxjs';

const observerable = new Observable((observer) => {
  setTimeout(() => {
    observer.next('hello rxjs');
  }, 3000);
});

const observer = (val: string) => {
  console.log(val);
};

observerable.subscribe(observer);
```

### 数据流

rxjs 是一种流式编程的框架，每一次调用 next 方法等于是在时间线上 emit 了一个 value。

在 rxjs 的官网中经常会用 [marble diagrams](https://rxmarbles.com/) 来描述这种编程模型。

## 可观察对象(Observable)

### Observable.constructor

Observable 的构造器和 Promise 的构造器有些不同，Observable 的构造器是惰性加载的，如果没有观察者进行订阅，构造器中的逻辑不会触发。

```ts
import { Observable } from 'rxjs';

const observerable = new Observable((observer) => {
  console.log('这段打印不会被执行');
});
```

当然如果有多个订阅者，构造器会执行多次。

```ts
import { Observable, Observer } from 'rxjs';

const observerable = new Observable((observer) => {
  observer.next('Hello rxjs');
});

const observer1 = (value) => {
  console.log('observer1:' + value);
};

const observer2 = (value) => {
  console.log('observer2:' + value);
};

observerable.subscribe(observer1);
observerable.subscribe(observer2);
/**
 * observer1:Hello rxjs
 * observer2:Hello rxjs
 */
```

### next 方法

next 方法和 promise.resolve 有些不太一样，promise 中每个 promise 的状态一旦被处理将无法回滚，也就是说你只能调用一次 resolve。

但是 rxjs 的 next 方法可以执行多次。

```ts
import { Observable } from 'rxjs';

const observerable = new Observable((observer) => {
  let i = 0;
  setInterval(() => {
    observer.next(++i);
  }, 3000);
});

const observer = (val: number) => {
  console.log(val);
};

observerable.subscribe(observer);
```

### complete/error

可以调用 observer.complete/error 手动结束一个响应式对象。
observer.error 可以将错误对象传递出去，类似 Promise.reject

```ts
import { Observable } from 'rxjs';

const observerable = new Observable((observer) => {
  let i = 0;
  const timer = setInterval(() => {
    observer.next(++i);

    if (i === 5) {
      observer.complete();
      clearInterval(timer);
    }
  }, 3000);
});

const observer = (val: number) => {
  console.log(val);
};

observerable.subscribe(observer);
```

### Subject

```ts
class Subject<T> extends Observable<T> implements SubscriptionLike {
  constructor() {
    // NOTE: This must be here to obscure Observable's constructor.
    super();
  }
  next(value: T) {}
  error(err: any) {}
  complete() {}
  unsubscribe() {}
}
```

从类型定义中我们得知，Subject 也是一个 Observable，不过的构造器是空的，订阅后并**不会立即通知**观察者，只有当手动调用 next 方法时才会发起通知。

适用于广播的情况。

```ts
import { Subject, Observable } from 'rxjs';

const subject = new Subject();

const observer1 = (value) => {
  console.log('observer1:' + value);
};

const observer2 = (value) => {
  console.log('observer2:' + value);
};

subject.subscribe(observer1);
subject.subscribe(observer2);

setTimeout(() => {
  subject.next('server data');
}, 3000);
```

### BehaviorSubject

一个具有`Behavior`的 Subject。这个Behavior我们可以理解为当前的状态或当前的行为。
在初始化BehaviorSubject，必须要有一个初始的行为。

聪明的你肯定想到了，这不就是`状态管理`嘛。

```ts
import { Subject, Observable, BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject('initial value');

const observer1 = (value) => {
  console.log('observer1:' + value);
};

const observer2 = (value) => {
  console.log('observer2:' + value);
};

subject.subscribe(observer1);
subject.subscribe(observer2);
```

### ReplaySubject

我们先看下下面这段代码。

```ts
import { Subject } from 'rxjs';

const subject = new Subject();

const observer1 = (value) => {
  console.log('observer1:' + value);
};

const observer2 = (value) => {
  console.log('observer2:' + value);
};

subject.subscribe(observer1);

// emit
subject.next(1);

setTimeout(() => {
  subject.subscribe(observer2);
}, 3000);
```

运行后我们发现，observer2 没有收到通知。

其实很好理解，因为我们是三秒后才对 subject 发起订阅。

那有没有办法让 observer2 收到通知呢？

很简单，我们只需要将 Subject 换成 ReplaySubject。

```ts
import { ReplaySubject } from 'rxjs';

const subject = new ReplaySubject();
//...
```

## 观察者(observer)

subscribe 的参数中要传入 observer。通过类型我们得知，observer 如果直接传入 function 的话，默认就是 next 方法。

```ts
export interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

subscribe(observer?: Partial<Observer<T>>): Subscription;
subscribe(next: (value: T) => void): Subscription;
```

在之前的例子中，如果我们想要监听 complete,我们需要这样改造 observer.

```ts
const observer: Partial<Observer<number>> = {
  next: (value) => {
    console.log(value);
  },
  complete: () => {
    console.log('complete');
  },
};
observerable.subscribe(observer);
```

## 冷观察与热观察

Cold Observables 就好像是一个很冷的冰块，只有你发起订阅时，才会开始发射数据，冷观察的类型为unicast。
比如Http请求。

Hot Observables 就好像是一个太阳，无论是否发起订阅都会发射数据，类型为multicast。
比如鼠标键盘事件。

## 创建 Observerable 的辅助方法

在前面的 demo 中我们都是通过 new 的方法手动创建 Observerable，rxjs 内部也为我们提供了很多的辅助函数。

### range

传入一个范围，订阅后会发出发射出指定范围的数值。

```ts
import { range } from 'rxjs';

range(1, 10).subscribe((x) => console.log('result', x));
```

### from

传入一个数组或者 promise，并将其转换为 Observerable。

```ts
import { from } from 'rxjs';

from(['a', 'b', 'c']).subscribe(console.log);

const promise = new Promise((res) => {
  res('promise resolved');
});
from(promise).subscribe(console.log);
```

### of/forkJoin

of 可以将参数列表作为数据流返回。
forkJoin 类似于 Promise.all,可以合并多个 Observerable。

```ts
import { forkJoin, of } from 'rxjs';

const observalbe1 = of(1, 2, 3);
const observalbe2 = of([4, 5, 6]);

forkJoin({ observalbe1, observalbe2 }).subscribe(console.log);
```

### fromEvent

将事件转换为 Observerable。

```ts
import { fromEvent } from 'rxjs';

const btn = document.getElementById('btn');
fromEvent(btn, 'click').subscribe(console.log);
```

### interval

传入一个时间间隔(ms)，从 0 开始每隔一个时间发出一个新的值。

```ts
import { interval } from 'rxjs';

interval(1000).subscribe(console.log);
```

## 操作符

rxjs 提供了很多的操作符，方便我们对数据流进行操作。

### map

对数据流中的原有值进行转换。

```ts
range(1, 10)
  .pipe(map((x) => x * 10))
  .subscribe((x) => console.log('result', x));
```

### fliter

对数据流进行过滤。

```ts
import { range, filter } from 'rxjs';

range(1, 10)
  .pipe(filter((x) => x % 2 === 1))
  .subscribe((x) => console.log('result', x));
```

![](https://rxjs.dev/assets/images/marble-diagrams/filter.png)

### switchMap

很有用的一个操作符，可以用来切换 Observable。

```ts
import { interval, switchMap, timer } from 'rxjs';

const delay$ = timer(3000);

const output$ = interval(1000);

// switchMap回调中可以拿到上一个Observerable的值
delay$.pipe(switchMap((v) => output$)).subscribe(console.log);

// 三秒后开始输出0,1,2,3...
```

### take

摄取。传入几就会拿出前几次的数据流。

```ts
import { range, map, take } from 'rxjs';

range(1, 10)
  .pipe(take(3))
  .subscribe(console.log);
```

![](https://rxjs.dev/assets/images/marble-diagrams/take.png)

### takeWhile

类似 take，返回的是一个条件，摄取的是满足条件的数据流

```ts
import { range, map, from, takeWhile } from 'rxjs';

from([2, 3, 4, 5, 6])
  .pipe(takeWhile((x) => x <= 5))
  .subscribe(console.log);
```

![](https://rxjs.dev/assets/images/marble-diagrams/takeWhile.png)

### takeUtil

传入 Observable，当这个 Observable 开始 emit 值的时候，就摄取主 Observable 中的值。

```ts
import { timer, interval, takeUntil } from 'rxjs';

const timer$ = timer(3000);

interval(1000)
  .pipe(takeUntil(timer$))
  .subscribe(console.log);

//   interval(1000): 0---1---2
//           timer$: --------|

// 最终会打印出0，1
// 因为第三秒的时候timer$触发了，此时2之前的值会被摄取。
```

### throttleTime

当 Observable 中的值 emit 很频繁的时候，可以通过 throttleTime 进行节流。

```ts
import { interval, throttleTime } from 'rxjs';

interval(10)
  .pipe(throttleTime(1000))
  .subscribe(console.log);
/**
 * 
0
83
165
249
...
 */
```

### distinctUntilChanged

判断数据流是否和上次的相同，相同的话就不会 emit。

```ts
import { of, distinctUntilChanged } from 'rxjs';

of(1, 1, 1, 3, 3, 5, 5)
  .pipe(distinctUntilChanged())
  .subscribe(console.log);
//1 3 5
```
