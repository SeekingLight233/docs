---
title: React源码学习笔记
date: 2021-1-29
categories:
  - 前端
---

## JSX

JSX 是 `React.createElement`的语法糖.

它接收三个参数,并且返回一个名为 ReactElement 的新函数作为返回值,该函数返回一个包含组件数据的对象

```ts
function createElement(type, config, children) {
  //...
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}
```

- 第一个参数为 type, type 为原生 html 节点字符串或者 Component (Component 有可能为 classComponent,也有可能为 functionComponent)

- 第二个参数为节点上的属性,第三个参数为 jsx 上的子元素

当调用完`React.createElement`之后,此次就有了组件的内容和结构,这为接下来创建 fiber 做了铺垫.

## render 阶段

### 挂载阶段

会对 dom 上的每一个节点进行 dfs,也就是说每一个节点都会执行 beiginWork 和 completeWork

在递进去的时候会执行 beginWork
在归出来的时候会执行 completeWork,最终会返回 fiber

### 更新阶段

更新时 current 已经存在了,此时要根据 current 中的 fiber 进行对比创建 workInprogress fiber.

在 render 的整个过程中,会对要操作的 dom 打上 tag,这些 tag 会串成一根双向链表,然后放到 commit 阶段统一处理.
