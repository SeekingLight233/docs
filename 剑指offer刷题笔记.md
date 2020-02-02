---
title: 剑指offer类型题刷题笔记
date: 2020-2-2
categories: 
 - 算法
tags: 
 - 待添加
---
## 数据结构
### 数组中重复的数字
给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 其中有些元素出现两次而其他元素出现一次。

找到所有出现两次的元素。

你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？
::: tip
输入:
[4,3,2,7,8,2,3,1]

输出:
[2,3]
:::
```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function(nums) {
    let number = [];
    let status = [];
    for(let i = 0;i<=nums.length;i++){
        status[i] = 0;
    }
    console.log(status);
    
    //将每一个数都放到相应的位置上
    for(let i = 0;i<nums.length;i++){
        let value = nums[i];
        status[value]++;
    }
    for(let i = 0;i<=nums.length;i++){
        if(status[i]==2){
            number.push(i);
        }
    }
    console.log(status);
    return number;
};

```
**思路**

>再搞一个数组，当“状态机”，初始化“状态机”的值都为0，然后将样例数组中的每一个值都对应到“状态机”的索引上，并对其进行+1操作。
>最后检查一遍“状态机”，看看有谁的值被加到了2就将其打包返回。
### 二维数组中的查找
### 替换空格
### 从头到尾打印链表
### 重建二叉树
### 二叉树的下一个节点
### 用两个栈来实现队列
## 算法与数据操作
### 斐波那契数列
### 旋转数组的最小数字
### 矩阵中的路径
### 机器人的运动范围
### 剪绳子
### 二进制中1的个数

## 高质量的代码
## 解决问题的思路
## 算法性能优化
## 知识迁移、抽象建模、发散思维