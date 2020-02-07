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
时间复杂度: O(n2)
空间复杂度: O(1)

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

时间复杂度: O(n2)
空间复杂度: O(1)

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
### 堆排序
### 快速排序
### 归并排序
## 二分搜索
- 二维数组中的查找
- 旋转数组中的最小数字
- 统计一个数字在排序数组中出现的次数(知识迁移)
- 
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