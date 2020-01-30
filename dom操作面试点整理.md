---
title: dom操作面试点整理
date: 2020-1-18
categories: 
 - 前端
tags: 
 - 待定
sidebarDepth: 5
sidebar: "auto"
---
## document对象中方法的继承关系
## 遍历节点树与遍历元素节点树
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
## 事件处理函数与绑定机制
## 事件委托、事件冒泡、事件捕获
## addEventlistener和正常的onclick=()=> 有什么区别