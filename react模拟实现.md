---
title: react原理分析（模拟实现）
date: 2020-1-17
categories:
  - 前端
---

## jsx

用户自己写的 jsx 本质就是 createElement 的语法糖，无非是被 babel 转义了。

通过 createElement 创建出 vdom,是 react 渲染流程的第一步。

## createElement

其实 createElement 的目的很明确，就是将用户传进来的核心参数（标签类型，标签属性，子元素）转成 js 的对象。
一下是一个简单的模拟实现。

```js
/**
 * @param {str|function} 类型，是字符串div 还是函数
 * @param {*} jsx传递的属性
 * @param  {...any} 子元素
 */
function createElement(type, props, ...children) {
  delete props.__source;
  return {
    type,
    props: {
      ...props,
      //把props透传进来
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}
```

## 最朴素的 render 实现

渲染的话，如果仅仅是将 vdom 转成真实的 dom 且不考虑性能，其实并不是很麻烦，直接暴力遍历 vdom 节点，然后一个个 append 上去。

```js
function render(vdom, container) {
  const dom =
    vdom.type == 'TEXT'
      ? document.createTextNode('')
      : document.createElement(vdom.type);
  // 暴力遍历
  Object.keys(vdom.props).forEach((name) => {
    if (name !== 'children') {
      dom[name] = vdom.props[name];
    }
  });

  // 递归渲染⼦元素
  vdom.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}
```

## 异步调度逻辑

浏览器提供了一个叫`requestIdleCallback()`的 api,这个 api 接受一个函数作为参数，这个函数就能够在浏览器的 idle period 被调用。

于是我们就可以将 vdom 的渲染和 diff 放到这个函数中，从而就不会阻塞前台的高优先级任务。

最新的 react 为了保证兼容性自己实现了一套空闲时间的调度逻辑。

```js
requestIdleCallback(myNonEssentialWork);
function scedule(deadline) {
  // 如果帧内有富余的时间，或者超时 参数是
  requestIdleCallback传递的;
  while (deadline.timeRemaining() > 0 && tasks.length > 0) doWorkIfNeeded();
  if (tasks.length > 0) requestIdleCallback(myNonEssentialWork);
}
let nextUnitOfWork = null;

// diff和渲染都会放进来
function workLoop(deadline) {
  // 有下一个任务要做，但是当前的任务又慢的要死，这时候就不做了，先去做下一个任务
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 获取下⼀个任务单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function performUnitOfWork(nextUnitOfWork) {
  // ⼲活的代码
}
```

现在面临一个问题，如何去找到下一个单元的任务呢？

在前面我们已经看到，vdom 是一个很简单的树形结构，假如我们在遍历 vdom 树的时候中断了，此时如果想再继续的话只能重新遍历（因为在数据结构的层面，遍历树具有不可中断性）。

那要怎么办呢？

其实道理很简单，我们只需要为每个 vdom 加两个指针，一个指向父节点，一个指向兄弟结点，这样的话我们就能够利用这两个指针作为上下文来对断点进行定位。

如果我们从宏观上去观察这颗”树“，就会发现这颗树已经变成了”fiber（网/纤维）“。

## fiber

![](https://pic1.zhimg.com/80/v2-d629ff51df8b827d6465514c31467179_720w.jpg)

> 将之前暴力遍历的逻辑抽一下

```js
function createDom(vdom) {
  const dom =
    vdom.type == 'TEXT'
      ? document.createTextNode('')
      : document.createElement(vdom.type);
  // 设置属性
  Object.keys(vdom.props).forEach((name) => {
    if (name !== 'children') {
      dom[name] = vdom.props[name];
    }
  });
  return dom;
}

function render(vdom, container) {
  // 设置全局 nextUnitOfWork
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    },
  };
}
```

接下来我们就可以去实现`performUnitOfWork`中的逻辑了。

全局对象`nextUnitOfWork`就可以看作是一个`fiber`。

```js
function performUnitOfWork(fiber) {
  // TODO add dom node
  // TODO create new fibers
  // TODO return next unit of work
  // 如果没有dom 就不是⼊⼝，直接创建dom
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // fiber⽗元素
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 核心代码
  // 处理子元素，构建成fiber

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    // 取出当前元素
    const element = elements[index];
    // 包装，指向父元素
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber, // 因为const elements = fiber.props.children;
      dom: null,
    };
    // 处理兄弟指针
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 其他通过sibling
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // fiber遍历顺序
  // 向下递归时优先找子元素和兄弟元素
  // 回来的时候优先找父元素和兄弟元素
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

> fiber 遍历顺序
> ![fiber遍历顺序](https://www.jixieclub.com/res/imgs/fiber.png)

## 提交 commit

假设在渲染的时候被中断了，这时候的 ui 就会变得非常奇怪，所以我们要在任务都跑完了最后一块提交。

```js
function workLoop(deadline) {
  //...
  // 没有下个任务了 提交修改
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 取消wip
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  // 递归commit
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

## 更新和删除节点

首先我们需要在上文中将中断前的`currentRoot`保存起来，方便恢复。

```js
function render(vdom, container) {
  // 设置全局 nextUnitOfWork
  wipRoot = {
    dom: container,
    props: {
      children: [vdom],
    },
    base: currentRoot, // 保存的上一个currentRoot
  };
  nextUnitOfWork = wipRoot;
}
```

> 然后在构建 fiber 之前，对子元素进行 reconcilation

```js
function performUnitOfWork(fiber) {
  // ...
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
  // ...
}
```

> 更新节点核心逻辑

```js
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    // 对⽐old和new  diff算法
    const sameType = oldFiber && element && element.type == oldFiber.type;
    if (sameType) {
      // TODO update the node
    }
    if (element && !sameType) {
      // TODO add this node
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

// dom更新
function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter((name) => name !== 'children')
    .filter((name) => !(name in nextProps))
    .forEach((name) => {
      // 删除
      if (name.slice(0, 2) == 'on') {
        dom.removeEventListener(
          name.slice(2).toLowerCase(),
          prevProps[name],
          false
        );
      } else {
        dom[name] = '';
      }
    });

  Object.keys(nextProps)
    .filter((name) => name !== 'children')
    .forEach((name) => {
      // 删除
      if (name.slice(0, 2) == 'on') {
        dom.addEventListener(
          name.slice(2).toLowerCase(),
          nextProps[name],
          false
        );
      } else {
        dom[name] = nextProps[name];
      }
    });
}
```

## 函数组件

对于函数组件来说，也会创建出 vdom，只不过 vdom 上的 type 不是字符串，而是函数，因此需要做一些额外的处理。

```js
const isFunctionComponent = fiber.type instanceof Function;
if (isFunctionComponent) {
  updateFunctionComponent(fiber);
} else {
  updateHostComponent(fiber);
}
function updateFunctionComponent(fiber) {
  // 取出函数组件的children
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}
```

还有一点需要注意，由于在`updateFunctionComponent`没有执行`createDom`操作，因此在 commit 的时候需要递归往上找到真正的 dom 容器。
