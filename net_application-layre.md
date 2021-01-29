---
title: 前端层面必须要掌握的网络知识
date: 2019-11-23
categories:
  - 计算机网络
tags:
  - DNS
  - HTTP
  - HTTPS
---

## 域名系统 DNS

## HTTP 协议

### 手写 ajax

```js
//手写ajax
//请求地址 https://www.jixieclub.com:3002/list?Pnum=1
const xhr = new XMLHttpRequest();
//第三个参数为true说明是异步请求
xhr.open('GET', 'https://www.jixieclub.com:3002/list?Pnum=1', true);
//当readState变化时触发
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    //readyState代表数据流的状态
    //4的意思是数据量全部下载完成
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      alert('其他情况');
    }
  }
};
//get请求发送null
xhr.send(null);
```

### 状态码

#### 1xx 服务器受到请求

#### 2xx 请求成功

- 200 请求成功

#### 3xx 重定向(配合相应头里的 location)

- 301 永久重定向，域名快过期的时候可以整一个
- 302 临时重定向 （跳外链，搜索结果，短网址）
- 304 资源未修改

#### 4xx 客户端错误

- 404 找不到资源
- 403 没有权限

#### 5xx 服务端错误

- 500 服务端错误
- 504 网关超时（服务器集群）

### http methods

- get: 获取数据
- post: 新建数据
- patch/put: 更新数据
- delete: 删除数据

#### Restful API

- 传统 api: 把每个 url 当作一个功能
- Restful: 把每个 url 当做一个唯一的资源（不传参数，明确 method）

### header

#### 常见的 Request Headers

- Accept
- Accept-Encoding
- Accept-Language
- Connection: keep-alive
- cookie
- Host:请求的域名
- User-Agent： 用户代理(浏览器信息)
- Content-type: application/json 发送的数据格式

#### 常见的 Response Headers

- Content-type：返回的数据格式
- Content-length: 返回数据的长度
- Content-Encoding
- Set-Cookie

### 缓存机制

#### 强制缓存

- 可以简单理解为在 max-age 中都会触发强制缓存。

- Cache-Control:max-age/no-cache/no-store
  ::: tip
  no-cache 和 no-store 的区别
- no-cache：不使用强制缓存，缓存的事情交给服务端处理
- no-store: 不使用强制缓存，同时也不让服务器做缓存，直接从服务器上返回最新的资源(比较彻底)
  :::
- expires 已被 cache-control 代替

#### 协商缓存

- max-age 过期就会触发协商缓存

- 浏览器在**再次**发送请求时，会带上**资源标识**。服务器可以根据这些资源标识进行判断，相同返回 304（body 为空），否则返回 200（body 里有最新的资源）。

- 有哪些资源标识？

  1. last-Modified: 资源的最后修改时间（精确到秒），请求的时候用的是`if-Modified-Since`,value 还是`last-Modified`中的 value
  2. Etag：资源的唯一标识，请求的时候用的是`if-None-Match`,value 还是`etag`中的 value

- 两者都有的话优先 Etag，更精确。

#### 刷新操作对缓存的影响

- 手动刷新(F5)：强制缓存失效，协商缓存有效。
- 强制刷新(Ctrl+F5): 强制缓存和协商缓存全部失效。

## HTTPS

## HTTP 各个版本
