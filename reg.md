---
title: 正则表达式火速上手指北
date: 2020-1-5
categories: 
 - 前端
tags: 
 - 正则表达式
sidebarDepth: 5
sidebar: "auto"
---
## 匹配任意字符

`/王../g`
会匹配出第一个字是王，并且是三个字的字符
> . 是一个占位符，意为匹配任意一个字符。
 
::: tip
如果要在字符串中匹配“真的.”可以在 "."的前面加上一个反斜杠
:::
## 匹配字母数字和下划线
`/\w2/g`
会匹配出`abcde12345__`中的`12`
> \w是一个占位符，意为匹配任意的字符，数字，下划线
> 
::: tip
\W意为匹配除了字符，数字，下划线之外的所有东西
:::

## 匹配所有的数字
`/\d2\d4/g`
会匹配出`abcde12345__`的`1234`
> \d意为匹配所有的数字

## 匹配所有的空格
`/s`

会匹配出字符串中的空格，断行和制表符
## 匹配字符集合
`/[ace2]/g`
会匹配出`abcde12345__aaccee`中所有的“a”，“c”，“e”，“2”。

> [] 会匹配括号内的任意一个字符
## +匹配重复一次或多次的字符
`/jasonle+/`
会匹配全部的`jasonleeeeeeeeeeeeee`。
## *匹配重复零次或多次的字符
`/jason[led]*/g`
会匹配全部的`jasonllllllleeeeeeeeeeeeee`
## ?匹配出现1次或0次的字符
`/jasonf?[led]*/g`
会匹配全部的`jasonfllllllleeeeeeeeeeeeee`
## {}匹配更复杂的出现规则
<!-- ![](./reg/01.PNG) -->
![](./os-memory/20.png)
`/yo{2,4}/g`会匹配出字母o最后出现2次或4次的情况。

## 边界符
- `^`
匹配以谁为开始。
::: warning
如果这个符号写到了中括号里面代表的意思是范围取反。
:::
- `&`
匹配以谁为结束。
::: warning
如果匹配规则是`/^abc$/`,那么只能匹配`abc`为`true`,其余的(`abcabc`)都为false。
<hide txt="实话实说，我也没想明白。。。"></hide>
:::

---
## JS中的正则表达式
### 创建一个正则对象
``` js
let reg = new RegExp(/李../);
```
或者
``` js
let reg = /李../;
```
- `test()`方法
用来判断一个一个正则规则能否在指定字符串中匹配到字符
``` js
let reg = /李../;
let str = "李小明";
console.log(reg.test(str));//true
str = "王小明";
console.log(reg.test(str));//false
```
