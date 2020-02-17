---
title: 基础算法与剑指offer刷题笔记
date: 2020-2-4
categories: 
 - 算法
sidebarDepth: 5
sidebar: "auto"
---
主要参考文章[前端该如何准备数据结构和算法？](https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-7)
## 排序算法
### 选择排序
![](http://www.conardli.top/docs/%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F.gif)
> 思路
> 插入排序的思路很简单，就是每次一眼扫过去，把最小的“拎”出来插到头上，然后对剩余的元素重复刚才的动作。
> 但这一句话用代码实现却需要很多细节。
``` js
function selectSort(arr) {
    for (let j = 0; j < arr.length; j++) {
        //先默认第一个位置是最小的
        let min_index = j;
        //然后向后进行比较，小的话更新minIndex
        for (let i = j + 1; i < arr.length; i++) {
            if (arr[i] < arr[min_index]) {
                min_index = i;
            }
        }
        //找出来以后，将最小元素与头部元素进行交换
        [arr[j], arr[min_index]] = [arr[min_index], arr[j]];
    }
    return arr;
}
let res = selectSort([5, 3, 6, 8, 1, 7, 9, 4, 2]);
console.log(res)//  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```
::: tip
在写算法题一定要遵循**从具体到抽象**。
同时在**抽象化**过程中一定要重新读一遍之前写过的代码，千万不能“漏”。
:::
**时间复杂度: O(n2)
空间复杂度: O(1)**

### 冒泡排序
![](./algorithm/01.png)
> 思路：从**头**扫一遍元素，在扫的过程中，如果发现**左边的比右边的大**，就让大的“沉到右边”。
``` js
function bubbleSort(arr) {
    for (let finish = arr.length; finish > 0; finish--) {
        for (let i = 0; i < finish; i++) {
            if (arr[i - 1] > arr[i]) {
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
            }
        }
    }
    return arr;
}
let res = bubbleSort([9, 3, 1, 4, 6, 8, 7, 2, 5]);
console.log(res); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```
::: tip
如果不知道怎么抽象化，可以多写几下具体的情况，但请注意在写**第二个**具体情况时一定要谨慎！一定要想好！就像这道题，先是“最右边的元素”落定之后再开始处理“从头到倒数第二个元素”。多去思考这个动态的过程。
:::

**时间复杂度: O(n2)
空间复杂度: O(1)**

### 插入排序
![](./algorithm/02.png)
> 思路：就和平时打牌一样，每抓到一张牌，就将其插入到响应的位置。
``` js
function insertSort(arr) {
    for (let start = 1; start < arr.length; start++) {
        //抽出第start张牌，然后将其与前面的数进行比较
        for (let i = start; i > 0; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
            }
        }
    }
    return arr;
}
let arr = insertSort([9, 3, 1, 4, 6, 8, 7, 2, 5]);
console.log(arr); //[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```
**时间复杂度：O(n2)
空间复杂度: O(1)**
### 归并排序
归并排序是分治法的典型应用。

所谓分治法，就是讲一个复杂的问题分解成小问题然后逐步求解，求完解之后再将答案**组织**到一起，其中求解并组织子问题的过程是最核心也是最复杂的。

![](https://user-gold-cdn.xitu.io/2019/7/23/16c1f400a943f4fc?imageslim)

``` js
function mergeSort(arr) {
    //
    if (arr.length < 2) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left_arr, right_arr) {
    let tmp = [];
    let i = 0; //i指向前半数组的头
    let j = 0; //j指向后半数组的头
    let k = 0; //k指向缓存数组
    while (i < left_arr.length && j < right_arr.length) {
        if (left_arr[i] < right_arr[j]) {
            tmp[k++] = left_arr[i++];
        } else {
            tmp[k++] = right_arr[j++];
        }
    }
    //有可能上述操作完成之后left_arr或right_arr还没有跑完。
    while (i < left_arr.length) {
        tmp[k++] = left_arr[i++];
    }
    while (j < right_arr.length) {
        tmp[k++] = right_arr[j++];
    }
    return tmp;
}
let res = mergeSort([1, 5, 0, 9, 5, 4, 8, 15]);
console.log(res); //[ 0, 1, 4, 5, 5, 8, 9, 15 ]
```
**时间复杂度：O(nlogn)
空间复杂度:O(n)**
### 快速排序
在开始学习这个排序算法之前，建议先看下这个几分钟的小视频：[【TED-ed】快速排序是什么【6小时字幕组】](https://www.bilibili.com/video/av10076626)

快速排序是我个人比较喜欢的一个算法，和归并相比，它的稳定性欠佳，但一般情况下都要比归并排序要快，空间复杂度也稍微有点大。但是它好写啊！逻辑清晰，转化成代码很容易。

> 思路:将数组的第一个数作为`compared_num`,然后遍历一遍数组，比这个数小的放左边，比这个数大的放右边，最后递归返回。
``` js
function quickSort(arr) {
    //边界条件
    if (arr.length < 2) return arr;
    //把数组中的第一数选出来作为要比较的数
    let compared_num = arr[0];
    let letf_arr = [];
    let right_arr = [];
    //然后遍历一遍arr，讲比compared_num小的数放左边，比他大的放右边
    //注意是从第二个数开始
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < compared_num) {
            letf_arr.push(arr[i])
        } else {
            right_arr.push(arr[i])
        }
    }
    return quickSort(letf_arr).concat([compared_num], quickSort(right_arr));
}
let res = quickSort([3, 1, 2, 4, 5, 7, 7, 7]);
console.log(res); //[ 1, 2, 3, 4, 5, 7, 7, 7 ]
```
**时间复杂度：平均O(nlogn)，最坏O(n2)，实际上大多数情况下小于O(nlogn)
空间复杂度: O(logn)**
### 堆排序

## 二分搜索
- 二维数组中的查找
- 旋转数组中的最小数字
- 统计一个数字在排序数组中出现的次数(知识迁移)
## 二叉树
### 前后遍历
- 前序遍历
- 后序遍历
- 重建二叉树
### 二叉树的对称性
- 对称的二叉树
### 二叉搜索树
- 二叉搜索树的第K个节点
- 二叉搜索树的后序遍历
### 二叉树的深度
- 二叉树的最大深度
- 平衡二叉树(知识迁移)
### 广度优先搜索
- 从上往下打印二叉树
### 深度优先搜索
- 二叉树的深度
- 二叉树中序遍历
## 数组
- 反转数组
- 去掉数组中重复的元素
## 栈与队列
- 队列与栈的互相实现
- 包含min函数的栈
- 滑动窗口的最大值
## 哈希表
- 常数时间插入、删除和获取随机元素
- 字符流中第一个不重复的字符

## 递归
- 斐波那契
- 跳台阶
## 贪心、回溯、动态规划