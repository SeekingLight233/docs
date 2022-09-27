---
title: leetcode每日一题
date: 2020-9-7
sidebarDepth: 5
categories:
  - 算法
sidebar: 'auto'
---

## 栈

### 有效的括号

// stack 里是右括号

```ts
/**

()[]{}
l

"(]"
[")"]
 */

function isValid(s: string): boolean {
  const map = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const stack = [];

  for (let char of s) {
    // 如果右括号可以找到，说明当前的char是可以作为key的左括号
    const isLeft = map[char] != null;
    if (isLeft) {
      stack.push(map[char]);
    } else {
      const right = stack.pop();
      if (right != char) return false;
    }
  }

  return stack.length > 0 ? false : true;
}
```

### 删除字符串中的所有相邻重复项

```js
/**
 * @param {string} S
 * @return {string}
 输入："abbaca"
 输出："ca"
 */
var removeDuplicates = function(S) {
  const stack = [S[0]];
  // 利用栈  遍历字符，如果当前字符和栈顶元素相等，就消去栈顶元素（出栈），反之将当前元素压入栈
  for (let i = 1; i < S.length; i++) {
    if (stack[stack.length - 1] !== S[i]) {
      stack.push(S[i]);
    } else {
      stack.pop();
    }
  }

  return stack.join('');
};
```

## 堆

### 数组中的第 K 个最大元素

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftIndex(index) {
    return index * 2 + 1;
  }

  getRightIndex(index) {
    return index * 2 + 2;
  }

  swap(a, b) {
    [[this.heap[a], this.heap[b]]] = [[this.heap[b], this.heap[a]]];
  }

  shiftUp(index) {
    if (index === 0) return;
    const parentIndex = this.getParentIndex(index);
    // 如果父节点的值大于当前的值，堆解构是不对的，此时需要交换
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index);
      // 交换完以后有可能解构仍然不对，此时需要继续上移
      this.shiftUp(parentIndex);
    }
  }
  shiftDown(index) {
    if (index === this.heap.length - 1) return;
    const leftIndex = this.getLeftIndex(index);
    if (this.heap[index] > this.heap[leftIndex]) {
      this.swap(index, leftIndex);
      this.shiftDown(leftIndex);
    }

    const rightIndex = this.getRightIndex(index);
    if (this.heap[index] > this.heap[rightIndex]) {
      this.swap(index, rightIndex);
      this.shiftDown(rightIndex);
    }
  }

  insert(val) {
    this.heap.push(val);
    // 上移操作
    this.shiftUp(this.heap.length - 1);
  }
  pop() {
    // 直接删除堆顶会破坏堆的结构,要把最后一个元素先挪上来
    this.heap[0] = this.heap.pop();
    // 然后让换上来的值下沉
    this.shiftDown(0);
  }

  getSize() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
  const minHeap = new MinHeap();

  for (let num of nums) {
    // 往堆上插
    minHeap.insert(num);
    // k作为堆的limit限制  如果超出，就停止插入
    if (minHeap.getSize() > k) {
      minHeap.pop();
    }
  }

  return minHeap.peek();
};
```

## Map

### 字母异位词分组

```ts
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
  if (strs.length === 0) return [];

  const map = new Map();
  for (let str of strs) {
    const characters = Array(26).fill(0); // 将里面填充26个0,用来统计字母出现的频率
    for (let i = 0; i < str.length; i++) {
      // 取出当前字母的ascii码
      const ascii = str.charCodeAt(i) - 97;
      characters[ascii]++; // 记录
    }
    const key = characters.toString(); //[0,1,0,1,1]转成字符串

    //利用map实现分组操作
    if (!map.has(key)) {
      map.set(key, [str]);
    } else {
      const origin_strs = map.get(key);
      // 拼接结果
      const new_strs = origin_strs.concat([str]);
      map.set(key, new_strs);
    }
  }

  // 此时map中会放{"0,1,1":["bc"]}

  const result = [];

  // 使用for of 遍历map 结果是二维数组
  for (let val of map) {
    result.push(val[1]);
  }
  return result;
};
```

### 两数之和

```ts
/**
{2:0}:{[subNum:string]:SubNumIdx}
9
[2,7,11,15]
 */

function twoSum(nums: number[], target: number): number[] {
    const map = {};
    let res = []
    nums.forEach((num,idx)=>{
        const subNum = target - num
        const subNumIdx = map[subNum]
        if(subNumIdx == null){
            map[num] = idx
        }else{
            res = [idx,subNumIdx]
        }
    })
    return res
};
```

## Set

### 只出现一次的数字 III

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var singleNumber = function(nums) {
  const set = new Set();

  for (let num of nums) {
    if (set.has(num)) {
      set.delete(num);
    } else {
      set.add(num);
    }
  }
  return Array.from(set);
};
```

## 链表

### 环状链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  if (!head) return false;

  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    // 快慢指针同时遍历
    slow = slow.next;
    fast = fast.next.next;
    // 相等就说明有环
    if (slow === fast) return true;
  }

  return false;
};
```

### 反转链表中的一部分

```js
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseBetween(
  head: ListNode | null,
  m: number,
  n: number
): ListNode | null {
  if (head == null || m === n) return head;
  let pre = null;
  let cur = head;
  let next = head;

  for (let i = 1; i < m; i++) {
    pre = cur;
    cur = cur.next;
    next = cur;
  }

  // backup
  let originPre = pre;
  let originCur = cur;

  for (let i = m; i <= n; i++) {
    next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }

  if (originPre !== null) {
    originPre.next = pre;
  } else {
    head = pre;
  }
  originCur.next = cur;

  return head;
}
```

### 删除排序链表中的重复元素

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if (head == null) {
    return head;
  }

  let cur = head;
  while (cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return head;
};
```

### 合并两个有序链表

```ts
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  const dummy = new ListNode(null);
  let cur = dummy;
  // 用一个新链表来拼接
  while (l1 && l2) {
    // 同时遍历两个链表，谁小先接谁
    if (l1.val < l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }

  if (l1) {
    cur.next = l1;
  }

  if (l2) {
    cur.next = l2;
  }

  return dummy.next;
};
```

### 删除链表的倒数第 N 个结点

```js
function ListNode(val) {
  this.val = val;
  this.next = null;
}
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  const dummy = new ListNode(0);
  let fast = dummy;
  let slow = dummy;
  dummy.next = head;
  // 先让快指针指到第n个节点
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  // 此时再同时挪动快慢指针
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  // 此时慢指针刚好指向的是倒数第n个节点
  slow.next = slow.next.next;

  return dummy.next;
};
```

### 两数相加

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let dummy = new ListNode();
  let cur = dummy;

  let carry = 0;

  while (l1 || l2) {
    let sum = 0;
    // 步进l1和l2
    if (l1) {
      sum += l1.val;
      l1 = l1.next;
    }
    if (l2) {
      sum += l2.val;
      l2 = l2.next;
    }
    // 处理上一轮的进位
    sum += carry;
    cur.next = new ListNode(sum % 10);
    sum >= 10 ? (carry = 1) : (carry = 0);
    cur = cur.next;
  }

  // 有可能最右边需要进1
  if (carry === 1) {
    cur.next = new ListNode(1);
  }

  return dummy.next;
};
```

## 二叉树

### 二叉树的最大深度

```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0;
  const left = root.left;
  const right = root.right;
  // 二叉树的最大深度 = 左子树的最大深度和右子树的最大深度的最大值 + 1
  return Math.max(maxDepth(left), maxDepth(right)) + 1;
};
```

### 重建二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
  if (preorder.length === 0) return null;

  const rootVal = preorder[0];
  // index是根节点在中序遍历中的位置
  const index = inorder.indexOf(rootVal);

  const leftIn = inorder.slice(0, index);
  const rightIn = inorder.slice(index + 1);

  // 因为前序遍历的数组中要从第一个元素后面开始截取，坐标整体右移了一位
  const leftPre = preorder.slice(1, 1 + leftIn.length);
  const rightPre = preorder.slice(1 + leftIn.length);

  const root = new TreeNode(rootVal);
  root.left = buildTree(leftPre, leftIn);
  root.right = buildTree(rightPre, rightIn);
  return root;
};
```

### 最大二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function(nums) {
  // 和重建二叉树那道题思路差不多，也是划分数组
  if (nums.length === 0) {
    return null;
  }

  const rootVal = Math.max(...nums);
  const root = new TreeNode(rootVal);

  const leftArr = nums.slice(0, nums.indexOf(rootVal));
  const rightArr = nums.slice(nums.indexOf(rootVal) + 1);

  root.left = constructMaximumBinaryTree(leftArr);
  root.right = constructMaximumBinaryTree(rightArr);

  return root;
};
```

### 从上到下打印二叉树

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

 /**
 
queue = [root]
distance.put(root,0); // 1.判断是否访问过  2.记录距离根节点的距离
while(队列里有东西){
	// 这里可以用来收集结果
	记录下当前这一层有多少个节点
	for(遍历当前这一层){
		当前对头元素出队
		if(队头元素有子孩子){
			for(遍历子孩子){
				
			}
		}
	}
}
 
  */


function levelOrder(root: TreeNode | null): number[][] {
    if(root == null) return []

    const queue = [root];
    const res = [];
    while(queue.length){
        res.push(queue.map(n=>n.val))
        const len = queue.length;
        for(let i = 0;i<len;i++){
            const curNode = queue.shift();
            curNode.left && queue.push(curNode.left);
            curNode.right && queue.push(curNode.right)
        }
    }
    console.log(res)
    return res
};
```

### 按层次从上到下打印二叉树

> 有层次

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  // 我们可以在出队前获取一下长度，这样就知道该执行几次操作了
  while (queue.length) {
    const len = queue.length;
    const level = [];
    for (let i = 0; i < len; i++) {
      const curNode = queue.shift();
      level.push(curNode.val);
      curNode.left && queue.push(curNode.left);
      curNode.right && queue.push(curNode.right);
    }
    res.push(level);
  }
  return res;
};
```

### 之字形打印二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  let count = 1;
  while (queue.length) {
    const preLength = queue.length;
    const layer = [];
    for (let i = 0; i < preLength; i++) {
      const curNode = queue.shift();
      curNode.left && queue.push(curNode.left);
      curNode.right && queue.push(curNode.right);
      layer.push(curNode.val);
    }
    count % 2 === 0 && layer.reverse();
    res.push(layer);
    count++;
  }
  return res;
};
```

### 二叉树的中序遍历

```js
var inorderTraversal = function(root) {
  const res = [];
  function dfs(curNode) {
    if (!curNode) return;
    dfs(curNode.left);
    res.push(curNode.val);
    dfs(curNode.right);
  }
  dfs(root);
  return res;
};
```

### 数组转树

用一个 map 来维护 id 和 Node 之间的关系，遍历一边数组，从 map 中寻找他的父节点，没有的话构建，有的话 push。

```ts
const arr = [
  { id: 1, name: '部门A', parentId: 0 }, // 0代表根节点
  { id: 2, name: '部门B', parentId: 1 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 2 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
];

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

type Item = typeof arr[0];

const convert = (arr: Item[]) => {
  const idToTreeNode = new Map<number, TreeNode>();

  let root = null;

  arr.forEach((item) => {
    const pNode = idToTreeNode.get(item.parentId);
    if (!pNode) {
      // 说明此节点为根节点
      root = {
        id: item.id,
        name: item.name,
        children: [],
      };
      idToTreeNode.set(item.id, root);
    } else {
      const curNode = {
        id: item.id,
        name: item.name,
        children: [],
      };
      pNode.children.push(curNode);
      idToTreeNode.set(item.id, curNode);
    }
  });

  return root;
};

const res = convert(arr);
console.log(JSON.stringify(res));
```

## 字符串

### 字符串转换整数 (atoi)

```js
function myAtoi(s: string): number {
  // 匹配前面的正负号
  const reg = new RegExp(/^(\-|\+)?\d+/);
  const matchArr = s.trim().match(reg);
  // 没匹配到就取0
  const res = matchArr ? Number(matchArr[0]) : 0;
  // 越界进行截断处理
  return res > 0 ? Math.min(2 ** 31 - 1, res) : Math.max(-(2 ** 31), res);
}
```

## 子串问题

### 最小覆盖字串

```ts
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  let l = 0;
  let r = 0;
  let res = '';
  // 初始化need
  const need = new Map();
  for (let val of t) {
    need.set(val, need.has(val) ? need.get(val) + 1 : 1);
  }
  //eg:  { 'A' => 1, 'B' => 1, 'C' => 1, 'D' => 1 }
  // 移动右指针
  let needLength = need.size;
  while (r < s.length) {
    const c = s[r];
    // 如果need中有当前字符
    if (need.has(c)) {
      // 就将need中的字符的个数-1
      need.set(c, need.get(c) - 1);
    }
    if (need.get(c) === 0) {
      // 如果减到0了，就更新needLength
      needLength--;
    }
    // 在满足条件的情况下减小子串(移动左指针)
    while (needLength === 0) {
      const newRes = s.substring(l, r + 1);
      if (newRes.length < res.length || res === '') res = newRes;
      const c2 = s[l];
      if (need.has(c2)) {
        // 如果要“即将丢出去”的左边字符刚好是在need列表中
        need.set(c2, need.get(c2) + 1);
      }
      if (need.get(c2) === 1) {
        needLength++;
      }
      l++;
    }

    r++;
  }

  return res;
};
```

### 无重复字符的最长子串

```js
function lengthOfLongestSubstring(s: string): number {
  const map = new Map();
  let tmpIndex = -1; // 需要滚动更新
  let tmpDistance = 0;

  for (let i = 0; i < s.length; i++) {
    // 一边遍历一边打map
    const preIndex = map.get(s[i]) ?? -1;
    tmpIndex = Math.max(tmpIndex, preIndex);
    const distance = i - tmpIndex;
    tmpDistance = Math.max(distance, tmpDistance);
    // 遍历结束后记录当前字符的位置
    map.set(s[i], i);
  }
  return tmpDistance;
}
```

### 最长回文子串

```js
function longestPalindrome(s: string): string {
  if (s.length < 2) {
    return s;
  }
  // 滚动更新
  // 分别记录答案的起始位置和最大长度
  let start = 0;
  let maxLength = 1; // 假如为ab，那么初始值为0肯定不对

  const expend = (left: number, right: number) => {
    // 扩张双指针
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const interval = right - left + 1;
      // 在这个过程中更新答案
      if (interval > maxLength) {
        maxLength = interval;
        start = left;
      }
      left--;
      right++;
    }
  };

  for (let i = 0; i < s.length; i++) {
    // 更新两遍  防止中心出现两次的情况
    expend(i - 1, i + 1);
    expend(i, i + 1); // cbba
  }
  return s.substr(start, maxLength);
}
```

### 最长公共前缀

```ts
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  const firstStr = strs[0]; // 每一个单词都会和第一个词进行比较
  let len = Infinity; // 记录满足要求的公共前缀的长度
  for (let str of strs) {
    let index = 0; // index会用来记录每一个单词和第一个单词的公共前缀的长度
    while (index < firstStr.length && index < str.length) {
      if (firstStr[index] != str[index]) {
        break;
      }
      index++;
    }
    // 然后不断更新
    len = Math.min(len, index);
  }
  return firstStr.substr(0, len);
}
```

## 数学问题

### 下一个排列

### 字符串相加

```js
function addStrings(num1: string, num2: string): string {
  const { n1, n2 } = padNums(num1, num2);
  console.log({ n1, n2 });
  /** 
[]
      p
    099
    199
      q
 */
  const bitNumArr = [];
  let p = n1.length - 1;
  let q = n2.length - 1;
  let curry = 0;

  while (p >= 0 && q >= 0) {
    const curSum = curry + Number(n1[p]) + Number(n2[q]);
    const bitNum = curSum % 10;
    bitNumArr.unshift(bitNum);
    curry = curSum > 9 ? 1 : 0;
    p--;
    q--;
  }

  if (curry === 1) bitNumArr.unshift(1);

  return bitNumArr.join('');
}

function padNums(num1: string, num2: string) {
  if (num1.length > num2.length) {
    const padNum2 = num2.padStart(num1.length, '0');
    return { n1: num1, n2: padNum2 };
  } else {
    const padNum1 = num1.padStart(num2.length, '0');
    return { n1: padNum1, n2: num2 };
  }
}
```

```ts
/**
     Do not return anything, modify nums in-place instead.
    */
function nextPermutation(nums: number[]): void {
  function swap(i, j) {
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  function getNextLarge(index: number) {
    // 进到这个函数中时,从后到index前肯定是升序排列
    for (let i = nums.length - 1; i > index; i--) {
      // 然后在从后往前找到第一个刚好比“拐点值”大的程度最小的值的位置（因为是升序，所以第一个大的就是最小的）
      if (nums[i] > nums[index]) {
        return i;
      }
    }
  }

  function reverse(index: number) {
    // 降序转升序，升序转降序  头尾不断交换即可
    let start = index;
    let end = nums.length - 1;
    while (start < end) {
      swap(start, end);
      start++;
      end--;
    }
  }

  // 12385764
  // 从后往前找到第一个开始下降的位置
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i + 1] > nums[i]) {
      // 找到当前位置下的往后的下一个大的数
      const nextLargeIndex = getNextLarge(i);
      // 此时  交换那个比它大一点点的数
      swap(i, nextLargeIndex);
      // 为了保证是下一个最大   需要将从index往后调成升序
      reverse(i + 1);
      return;
    }
  }

  // 如果已经是将序了,就肯定会跳出循环   此时将他们再转成生序（题目要求）
  nums.reverse();
}
```

### 整数反转

```js
function reverse(x: number): number {
  let res = 0;
  while (x !== 0) {
    // 123
    res = res * 10 + (x % 10); // 取出3
    // 取出12
    x = (x / 10) | 0;
  }
  // 溢出检查
  // 如果是溢出的值，那么对0取或结果不等于自身
  return (res | 0) === res ? res : 0;
}
```

### 罗马数字转整数

```ts
function romanToInt(s: string): number {
  const map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const curChar = s[i];
    const nextChat = s[i + 1];
    // 正常情况下应该是按照罗马数字位数权重的降序排列
    // 如果是升序  就说明是低位在左边的特殊情况，就需要减
    // 4 === IV
    if (map[curChar] < map[nextChat]) {
      sum = sum - map[curChar];
    } else {
      sum = sum + map[curChar];
    }
  }
  return sum;
}
```

### 换酒问题

```js
/**
 * @param {number} numBottles
 * @param {number} numExchange
 * @return {number}
 */
var numWaterBottles = function(numBottles, numExchange) {
  // 假设3个换一瓶  一共20瓶
  let res = numBottles;
  // 假设上来先干掉20瓶酒
  while (numBottles >= numExchange) {
    // 等于的条件别漏掉
    // 计算出能换的数量  也就是第一次进来还能换6瓶
    const change = Math.floor(numBottles / numExchange);
    res += change; // 这6瓶早晚也得被干掉

    // 更新接下来能换的瓶子  是剩下的2瓶加上换来的6瓶
    numBottles = change + (numBottles % numExchange);
  }
  return res;
};
```

### 阶乘后的零

```js
var trailingZeroes = function(n) {
  let res = 0;
  // 有多少个5  就有多少个0
  while (n >= 5) {
    let k = Math.floor(n / 5);
    res += k;
    n = k;
  }
  return res;
};
```

### 数组乱序/洗牌算法

```js
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
  this.nums = nums;
};

/**
 * Resets the array to its original configuration and return it.
 * @return {number[]}
 */
Solution.prototype.reset = function() {
  return this.nums;
};

/**
 * Returns a random shuffling of the array.
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
  const nums = [...this.nums];
  // 获取制定范围内的随机数
  function getRandom(min, max) {
    // random会产生0-1的随机数，乘上range+1就能将其范围放缩，同时将区间向右挪动min个基准
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
  function swap(a, b) {
    [nums[a], nums[b]] = [nums[b], nums[a]];
  }

  for (let i = nums.length - 1; i >= 0; i--) {
    // 不断地从前面选一个数和最后一个数做交换(当然自己交换自己也是有可能的)
    swap(i, getRandom(0, i));
  }
  return nums;
};
```

## 位运算

### 只出现一次的数字

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  let tmp = nums[0];
  // 拿第一个数和数组中的所有元素进行异或运算
  // 相同的元素会被抵消掉
  for (let i = 1; i < nums.length; i++) {
    tmp = tmp ^ nums[i];
  }

  return tmp;
};
```

## 双指针问题

### 合并两个有序数组

```ts
/**
          t
1,2,3,0,0,0
    p
2,5,6
q

三指针
 Do not return anything, modify nums1 in-place instead.
 */

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p = m - 1;
  let q = n - 1;
  let tail = nums1.length - 1;
  while (p >= 0 && q >= 0) {
    if (nums2[q] >= nums1[p]) {
      nums1[tail] = nums2[q];
      q--;
    } else {
      nums1[tail] = nums1[p];
      p--;
    }
    tail--;
  }

  // 说明还有剩下的，把值追加过去

  while (p >= 0) {
    nums1[tail] = nums1[p];
    tail--;
    p--;
  }

  while (q >= 0) {
    nums1[tail] = nums2[q];
    tail--;
    q--;
  }
}
```

### 接雨水

```ts
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let sum = 0;
  const len = height.length;
  for (let i = 1; i < len - 1; i++) {
    // 从第二个元素开始，找到每个元素左边的最大值和右边的最大值
    let l_max = 0,
      r_max = 0;
    for (let j = i; j >= 0; j--) {
      l_max = Math.max(l_max, height[j]);
    }
    for (let j = i; j < len; j++) {
      r_max = Math.max(r_max, height[j]);
    }
    // 单个元素上雨水的面积，只会受到这两个板子的最小值所限制
    const res = Math.min(l_max, r_max) - height[i];
    sum += res;
  }
  return sum;
};
```

### 盛最多水的容器

```js
function maxArea(height: number[]): number {
  let max = 0;
  let l = 0;
  let r = height.length - 1;
  while (l < r) {
    // 当前的面积 = 底*高
    const curArea = (r - l) * Math.min(height[l], height[r]);
    max = curArea > max ? curArea : max;
    // 接下来是关键
    // 如果右边板子低  就让右边板子往左诺  尝试寻找最优解，反之亦然
    if (height[l] > height[r]) {
      r--;
    } else {
      l++;
    }
  }
  return max;
}
```

### 三数之和

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  const result = [];

  nums.sort((a, b) => {
    return a - b;
  });
  // 先处理成升序排列
  // [ -4, -1, -1, 0, 1, 2 ]

  for (let i = 0; i < nums.length - 2; i++) {
    // 因为内部要用三指针遍历
    // 从第二个数开始，如果当前值和前一个值相等，就跳过（因为已经保存到结果中了）
    if (nums[i] === nums[i - 1] && i !== 0) continue;
    // 第二个指针从下一个位置定义
    let start = i + 1;
    // 第三个指针从最后开始遍历
    let end = nums.length - 1;

    while (start < end) {
      if (nums[i] + nums[start] + nums[end] === 0) {
        result.push([nums[i], nums[start], nums[end]]);
        start++;
        end--;
        // 同理，如果说下一个值和前一个值相等，就没必要再进行判断（也是为了防止重复）
        while (nums[start] === nums[start - 1]) {
          start++;
        }
        while (nums[end] === nums[end + 1]) {
          end--;
        }
      } else if (nums[i] + nums[start] + nums[end] > 0) {
        // 因为是升序排列，如果值比0大，就让它变小一点
        end--;
      } else {
        // 同理
        start++;
      }
    }
  }
  return result;
};
```

### 移动零

```ts
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  let read = 0; // read指针用来填非0的数字  从前面开始
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[read++] = nums[i];
    }
  }
  // 此时，read指针已经把所有的非0的数字给填充完毕了，接下来就把后面的数字填上0即可
  for (let i = read; i < nums.length; i++) {
    nums[read] = 0;
  }
  return nums;
};
```

### 比较版本号

```ts
/**

1.3.001
2.1.3.02
 */
function compareVersion(version1: string, version2: string): number {
    const ver1Arr = version1.split(".").map(Number); // [1,3,1,0]
    const ver2Arr = version2.split(".").map(Number)  // [2,1,3,2]
    
    while(ver1Arr.length<ver2Arr.length) ver1Arr.push(0)
    while(ver2Arr.length<ver1Arr.length) ver2Arr.push(0)

    for(let i = 0;i<ver1Arr.length;i++){
        if(ver1Arr[i]>ver2Arr[i]) return 1
        if(ver1Arr[i]<ver2Arr[i]) return -1
    }

    return 0
};
```

## 回溯

### 子集

- 典型的选与不选模型

```ts
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
  const res = [];
  function dfs(path, index) {
    // index记录的选到了第几个元素
    if (index === nums.length) {
      res.push([...path]);
      return;
    }
    // 对每一个元素都执行"选与不选两种操作"
    dfs(path, index + 1);
    path.push(nums[index]);
    dfs(path, index + 1);
    path.pop();
  }
  dfs([], 0);
  return res;
};
```

### 全排列

```ts

function permute(nums: number[]): number[][] {
    const result = [];
    const dfs = (start:number,path:number[])=>{
        if(path.length === nums.length){
            result.push(path);
            return
        }

        const selects = getSelects(start,path,nums)
        console.log(selects)

        selects.forEach(({start,path})=>{
            dfs(start,path)
        })
    }
    dfs(0,[])
    return result
};

function getSelects(start:number,path:number[],nums:number[]){
    const res:{start:number,path:number[]}[] = []
    // [1,2,3,4] - [1,2] => [3,4]
    const selectNums = nums.filter(num=> !path.includes(num))
    selectNums.forEach((selNum)=>{
        res.push({
            start: start + 1,
            path: [...path,selNum]
        })
    })
    return res
}
```

### 括号生成

```js
const check = (str: string) => {
  // 检验生成的括号是否是有效的
  const stack = [];
  for (let char of str) {
    if (char === '(') {
      stack.push(char);
      // 如果上来就是左括号
    } else if (stack.length === 0 && char === ')') {
      return false;
    } else {
      stack.pop();
    }
  }
  if (stack.length === 0) {
    return true;
  } else {
    return false;
  }
};

function generateParenthesis(n: number): string[] {
  const res = [];
  generate(0, '');
  function generate(level: number, curStr: string) {
    if (level === 2 * n) {
      // 因为n代表对数嘛
      const isvalid = check(curStr);
      if (isvalid) {
        res.push(curStr);
        return;
      } else {
        return;
      }
    }
    generate(level + 1, curStr + '(');
    generate(level + 1, curStr + ')');
  }

  return res;
}
```

### 电话号码的字母组合

```js
function letterCombinations(digits: string): string[] {
  if (digits == null || digits.length === 0) return [];
  const map = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  };

  const res = [];

  function dfs(index, path) {
    if (index >= digits.length) {
      res.push(path);
      return;
    }
    // 23
    // (abc)(def)
    for (let letter of map[digits[index]]) {
      // 递归遍历每个按键上的字母
      dfs(index + 1, path + letter);
    }
  }
  dfs(0, '');

  return res;
}
```

## 贪心/动态规划

### 零钱兑换

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  // dp[120] 代表的是当总金额为120的时候，最终问题的答案（最少凑的硬币个数）。
  const dp = new Array(amount + 1).fill(Infinity); // 因为多了0这种情况，所以要多开一个格子
  dp[0] = 0;
  // dp[120] = Math.min(dp[119]+1,dp[118]+1,dp[115]+1)
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      // 遍历找出凑不同情况的最小值
      if (i >= coin) {
        // 如果当前要凑的面值大于当前硬币的面值，才有凑下去的必要
        dp[i] = Math.min(dp[i - coin] + 1, dp[i]);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};
```

### 跳跃游戏

```ts
function canJump(nums: number[]): boolean {
  let maxJump = nums.length - 1;
  // maxJump指的是能跳到的最远的位置

  for (let i = nums.length - 2; i >= 0; i--) {
    // 从倒数第二个开始遍历
    if (nums[i] + i >= maxJump) {
      // 如果当前点的位置和能条的距离大于上一轮能跳到的位置，就更新结果
      maxJump = i;
    }
  }
  // 如果能跳到的最远位置可以更新到0，就说明有答案
  return maxJump === 0;
}
```

### 最大子序和

```ts
function maxSubArray(nums: number[]): number {
  let ans = nums[0]; // 假设最大子序和就是第一个元素
  let sum = 0; // 记录截止到当前元素的总和（其实是滑动窗口内值的总和）

  // 贪心策略
  for (let num of nums) {
    if (sum + num > num) {
      // 如果当前元素加上之前的元素比现在大，那么就有添加进sum的必要
      sum += num;
    } else {
      // 如果sum比0小，那就可以直接抛弃啦（比如说sum为负数
      sum = num; //-2
    }
    // 更新上一论的答案
    ans = Math.max(ans, sum);
  }

  return ans;
}
```

### 不同路径

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
  const dp = new Array(m); // 先初始化m行
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(n).fill(0); // 在m行中初始化n个元素
  }

  for (let i = 0; i < n; i++) {
    dp[0][i] = 1; // 将第一行初始化为1
  }

  for (let i = 0; i < m; i++) {
    dp[i][0] = 1; // 将第一列初始化为1
  }

  // 遍历二维数组
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[0].length; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};

uniquePaths(3, 7);
```

### 不同路径 II

有障碍物的时候处理起来判断一下即可。

```js
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;
  const dp = new Array(m);
  for (let i = 0; i < dp.length; i++) dp[i] = new Array(n).fill(0);

  // 初始的位置如果被堵死，返回一个0
  dp[0][0] = obstacleGrid[0][0] === 0 ? 1 : 0;

  if (dp[0][0] === 0) return 0;
  // 在有答案的情况下填第一行
  for (let i = 1; i < n; i++) {
    if (obstacleGrid[0][i] !== 1) {
      dp[0][i] = dp[0][i - 1];
    }
  }

  // 同理。在有答案（能走）的情况下填第一列

  for (let i = 1; i < m; i++) {
    if (obstacleGrid[i][0] !== 1) {
      dp[i][0] = dp[i - 1][0];
    }
  }

  // 在有答案的情况下填数

  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[0].length; j++) {
      if (obstacleGrid[i][j] !== 1) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
};
```

### 最长重复子数组

```js
/**
 * @param {number[]} A
 * @param {number[]} B
 * @return {number}
 */
var findLength = function(A, B) {
  const m = A.length + 1;
  const n = B.length + 1;

  const dp = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n).fill(0);
  }

  let ans = 0;

  // dp[2][3] 代表从A中的第2-1个数为结尾，以B中3-1个数为结尾的最长公共子串的长度
  // 当i为0或者j为0时，是没有答案的，所以填0不管就行
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      if (A[i - 1] === B[j - 1]) {
        // 假如说前一个字符相等的话，那么后一个字符的答案等于前面的答案数 + 1
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
    }
  }
  return ans;
};
```

### 爬楼梯

```ts
function climbStairs(n: number): number {
  const memo = [];
  memo[1] = 1;
  memo[2] = 2;

  function _climbStairs(n) {
    if (n < 3) {
      return n;
    }

    if (memo[n] !== undefined) {
      return memo[n];
    }

    const res = _climbStairs(n - 1) + _climbStairs(n - 2);
    memo[n] = res;
    return memo[n];
  }

  return _climbStairs(n);
}
```


### 最长递增子序列
``` ts
function lengthOfLIS(nums: number[]): number {
    // dp[i]代表以nums[i]结尾的最长递增子序列的长度
    const dp = new Array(nums.length).fill(1);
    for(let i = 1;i<nums.length;i++){
        for(let j = 0;j<i;j++){
            if(nums[i]>nums[j]){
                // 滚动更新
                dp[i] = Math.max(dp[i],dp[j]+1)
            }
        }
    }
    return Math.max(...dp)
};
```

### 最长递增子序列(返回索引)
``` ts

```
## 分治法

### 二分查找(有重复元素)

```js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 如果目标值存在返回下标，否则返回 -1
 * @param nums int整型一维数组
 * @param target int整型
 * @return int整型
 */
function search(nums, target) {
  // write code here
  let l = 0;
  let r = nums.length - 1;
  let m = 0;

  while (l <= r) {
    m = Math.floor((l + r) / 2);
    if (nums[m] === target) {
      while (m !== 0 && nums[m - 1] === nums[m]) m--;
      return m;
    } else if (target < nums[m]) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return -1;
}
```

### Pow(x, n)

```js
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {
  if (n < 0) return 1 / myPow(x, -n);
  if (n === 0) return 1;
  if (n % 2 === 0) {
    // n为偶数，递归计算n/2的幂
    return myPow(x * x, n / 2);
  } else {
    // 如果n为奇数  提出来一个x,这样内部的myPow(x,n-1)就为偶数
    return x * myPow(x, n - 1);
  }
};
```

## 二维数组

### 旋转二维数组

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  // 找规律  先把每一行变成列
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix[0].length; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }
  // 然后逆置每一行
  return matrix.map((arr) => arr.reverse());
};
```

### 矩阵置 0

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
  // 检查第一行和第一列是否含有0
  let firstColHasZero = false;
  let firstRowHasZero = false;
  for (let i = 0; i < matrix.length; i++) {
    // 每一行的第一个元素 也就是第一列
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
    }
  }
  for (let i = 0; i < matrix[0].length; i++) {
    if (matrix[0][i] === 0) {
      firstRowHasZero = true;
    }
  }

  // 使用第一行与第一列，来标记其余的行列是否含有0(让含有0的元素先浮到开头的位置)
  for (let x = 1; x < matrix.length; x++) {
    for (let y = 1; y < matrix[0].length; y++) {
      if (matrix[x][y] === 0) {
        matrix[x][0] = 0;
        matrix[0][y] = 0;
      }
    }
  }

  // 利用第一行与第一列的记录，将剩余元素标0
  for (let x = 1; x < matrix.length; x++) {
    for (let y = 1; y < matrix[0].length; y++) {
      if (matrix[x][0] === 0 || matrix[0][y] === 0) {
        matrix[x][y] = 0;
      }
    }
  }
  // 最后处理第一行与第一列的情况
  if (firstColHasZero) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i][0] = 0;
    }
  }
  if (firstRowHasZero) {
    for (let i = 0; i < matrix[0].length; i++) {
      matrix[0][i] = 0;
    }
  }
  return matrix;
};
```

### 螺旋矩阵

```ts
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  if (matrix.length === 0) {
    return [];
  }

  let left = 0;
  let right = matrix[0].length - 1;
  let top = 0;
  let bottom = matrix.length - 1;

  let direction = 'right';
  const res = [];

  while (left <= right && top <= bottom) {
    if (direction === 'right') {
      for (let i = left; i <= right; i++) {
        res.push(matrix[top][i]);
      }
      direction = 'down';
      top++;
    } else if (direction === 'down') {
      for (let i = top; i <= bottom; i++) {
        res.push(matrix[i][right]);
      }
      direction = 'left';
      right--;
    } else if (direction === 'left') {
      for (let i = right; i >= left; i--) {
        res.push(matrix[bottom][i]);
      }
      direction = 'up';
      bottom--;
    } else if (direction === 'up') {
      for (let i = bottom; i >= top; i--) {
        res.push(matrix[i][left]);
      }
      direction = 'right';
      left++;
    }
  }
  return res;
};
```

## 区间问题

### 合并区间

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  // 先以区间开头进行排序
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    // 如果当前区间的左端点 > 上一个区间的右端点，说明不重合，直接push
    if (intervals[i][0] > res[res.length - 1][1]) {
      res.push(intervals[i]);
    } else {
      // 如果左端点<上个区间的右端点，并且右边端点比上个区间右端点大，此时不用push
      // 直接更新上个区间的右端点
      if (intervals[i][1] > res[res.length - 1][1]) {
        res[res.length - 1][1] = intervals[i][1];
      }
    }
  }

  return res;
};
```

## 111 二叉树的最小深度

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function(root) {
  if (!root) return 0;
  const q = [[root, 1]];
  while (q.length) {
    const [n, l] = q.shift();
    if (!n.left && !n.right) {
      return l;
    }
    if (n.left) q.push([n.left, l + 1]);
    if (n.right) q.push([n.right, l + 1]);
  }
};
```

## 112 路径总和

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  const path = [];
  const res: number[][] = [];

  function dfs(node: TreeNode) {
    if (!node) return;
    path.push(node.val);

    if (!node.left && !node.right) {
      res.push([...path]);
    } else {
      node.left && dfs(node.left);
      node.right && dfs(node.right);
    }
    path.pop();
  }
  dfs(root);

  for (let item of res) {
    let sum = 0;
    item.forEach((num) => {
      sum += num;
    });
    if (sum === targetSum) return true;
  }

  return false;
}
```

## 113 路径总和 II

``` ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
const isLeafNode = (node:TreeNode)=> node.left == null && node.right == null

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if(root == null) return false

    let res = false;
    const dfs = (node: TreeNode | null,sum:number)=>{
        if(node == null) return
        // 这时候是叶子结点，不要忘了加上当前节点的值
        if(sum + node.val === targetSum && isLeafNode(node)) res = true

        dfs(node.left,sum + node.val);
        dfs(node.right,sum + node.val)
    }
    dfs(root,0)
    return res
};
```
## 121 买卖股票的最佳时机

> 某天买入，未来的某天卖出

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  // 记录之前的最低点,那当前点和之前的最低点做比较
  let preMin = prices[0];
  let profit = 0;

  for (let price of prices) {
    if (price < preMin) {
      preMin = price;
    }

    if (price - preMin > profit) {
      profit = price - preMin;
    }
  }
  return profit;
};
```

## 122 买卖股票的最佳时机 II

> 可以交易多次

```ts
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  let profit = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    if (prices[i + 1] > prices[i]) {
      profit += prices[i + 1] - prices[i];
    }
  }
  return profit;
};
```

## 125 验证回文串

```ts
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
  //忽略非字母和数字的情况
  s = s.toLowerCase().replace(/[^0-9a-zA-Z]/g, '');
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] === s[j]) {
      i++;
      j--;
    } else {
      return false;
    }
  }
  return true;
};
```

## 129 求根节点到叶节点数字之和

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function sumNumbers(root: TreeNode | null): number {
  if (!root) return 0;

  const path = [];
  const result: number[][] = [];

  function dfs(node: TreeNode) {
    if (root == null) return;
    path.push(node.val);
    // 叶子节点 记录
    if (!node.left && !node.right) {
      result.push([...path]);
    } else {
      node.left && dfs(node.left);
      node.right && dfs(node.right);
    }
    path.pop();
  }

  dfs(root);
  let sum = 0;
  result.forEach((item) => {
    const num = Number(item.join(''));
    sum += num;
  });

  return sum;
}
```

## 143 重排链表

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

/**
 Do not return anything, modify head in-place instead.
 */
function reorderList(head: ListNode | null): void {
  const midNode = getMidNode(head);
  let left = head;
  let stack: ListNode[] = [];
  let cur = midNode;
  while (cur) {
    stack.push(cur);
    cur = cur.next;
  }

  while (stack.length > 0) {
    const node = stack.pop();
    const left_next = left.next;
    left.next = node;
    if (stack.length === 0) {
      node.next = null;
    } else {
      node.next = left_next;
    }
    left = left_next;
  }
}

function getMidNode(head: ListNode) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

## 144\. 二叉树的前序遍历

```ts
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
  const res = [];
  function dfs(root) {
    if (!root) return;
    res.push(root.val);
    dfs(root.left);
    dfs(root.right);
  }
  dfs(root);
  return res;
};
```

## 146 LRU 缓存机制

```ts
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.capacity = capacity;
  this.map = new Map();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  const val = this.map.get(key);
  if (val == null) return -1;
  // 如果有的话，删掉再重新插入，此时的位置会更新到最后，将其视为LRUcache的头
  this.map.delete(key);
  this.map.set(key, val);
  return val;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  // 先把原来的干掉
  this.map.has(key) && this.map.delete(key);
  this.map.set(key, value); // 新追加的元素会默认再后面
  if (this.map.size > this.capacity) {
    // 通过迭代器访问第一个map
    const firstKey = this.map.entries().next().value[0];
    this.map.delete(firstKey);
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

## 151 翻转字符串里的单词

```js
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  return s
    .split(/\s+/)
    .reverse()
    .join(' ')
    .trim();
};
```

## 152 乘积最大子数组

```ts
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
  // 存储最大的乘积结果
  const maxProductMemo = [];
  // 存储最小的乘积结果
  const minProductMemo = [];

  // 如果这个数据只有一个元素，那么最大值和最小值都会是这个元素本身
  maxProductMemo[0] = nums[0];
  minProductMemo[0] = nums[0];
  // 先默认第一个元素为最大值
  let max = nums[0];
  // 动态规划，遍历剩下的情况(如果有两个元素...如果有三个元素...如果有四个元素...)
  for (let i = 1; i < nums.length; i++) {
    // 可以想象成有两个元素

    // 如果有两个元素，那么最大乘积 = 第二个元素 or 第二个元素*前一种情况最大值 or 第二个元素*前一种情况最最小值
    // 因为要考虑到负数的情况
    maxProductMemo[i] = Math.max(
      nums[i],
      nums[i] * maxProductMemo[i - 1],
      nums[i] * minProductMemo[i - 1]
    );
    minProductMemo[i] = Math.min(
      nums[i],
      nums[i] * maxProductMemo[i - 1],
      nums[i] * minProductMemo[i - 1]
    );

    //顺手记录下max变量
    max = Math.max(max, maxProductMemo[i]);
  }
  return max;
};
```

## 153\. 旋转排序数组中的最小值

```ts
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
  if (nums.length === 1) return nums[0];

  let left = 0,
    right = nums.length - 1;
  // 确认是否是反转数组
  if (nums[right] > nums[0]) {
    return nums[0];
  }

  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] > nums[mid + 1]) return nums[mid + 1];
    if (nums[mid] < nums[mid - 1]) return nums[mid];

    if (nums[mid] > nums[left]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
};
```

## 155\. 最小栈

```js
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [Infinity];
  }
  // 将元素 x 推入栈中
  push(x) {
    this.stack.push(x);
    this.minStack.push(Math.min(this.getMin(), x));
  }
  // 删除栈顶的元素
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  // 获取栈顶元素
  top() {
    return this.stack[this.stack.length - 1];
  }
  // 检索栈中的最小元素
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

## 169 多数元素

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  if (nums.length === 1) return nums[0];
  const map = new Map();
  for (let num of nums) {
    let curVal = map.get(num);
    if (!map.has(num)) {
      map.set(num, 0);
    } else {
      map.set(num, ++curVal);
      if (curVal >= Math.floor(nums.length / 2)) return num;
    }
  }
};
```

## 179\. 最大数

```js
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
  nums.sort((a, b) => {
    const s1 = `${a}${b}`;
    const s2 = `${b}${a}`;
    return s2 - s1;
  });

  if (nums[0] === 0) return '0';

  return nums.join('');
};
```

## 198\. 打家劫舍

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  if (nums.length === 0) {
    return 0;
  }

  if (nums.length === 1) {
    return nums[0];
  }

  const memo = []; // 用来记录所有的可能性
  memo[0] = nums[0]; // 如果只有一间房子，那么能偷到的最大的金钱数就是本身
  memo[1] = Math.max(nums[0], nums[1]); // 如果有两间房子，小偷不傻，他肯定要从钱最多的房子里选一个
  // 接下来的问题时，从第三个房子开始，能够取到的最大值是什么？
  for (let i = 2; i < nums.length; i++) {
    memo[i] = Math.max(nums[i] + memo[i - 2], memo[i - 1]);
  }
  return memo[nums.length - 1];
};
```

## 200\. 岛屿数量

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
  let count = 0; // 记录岛屿的数量
  const dfs = (x, y) => {
    // 越界检查
    if (
      x < 0 ||
      x >= grid.length ||
      y < 0 ||
      y >= grid[0].length ||
      grid[x][y] === '0'
      //注意最后一个条件也不需要处理
    ) {
      return;
    } else {
      //说明碰到了“1”
      grid[x][y] = '0';
      dfs(x, y - 1);
      dfs(x, y + 1);
      dfs(x - 1, y);
      dfs(x + 1, y);
    }
  };
  // 遍历地图
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      // 如果找到了陆地
      if (grid[x][y] === '1') {
        // 就先记录下来
        count++;
        // 然后在当前的位置进行深搜
        dfs(x, y);
      }
    }
  }
  return count;
};
```

## 206\. 反转链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  let pre = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }

  return pre;
};
```

## 209\. 长度最小的子数组

```js
function minSubArrayLen(target: number, nums: number[]): number {
  let distance = Number.MAX_SAFE_INTEGER;
  let left = 0;
  let sum = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      sum -= nums[left];
      distance = Math.min(distance, right + 1 - left);
      left++;
    }
  }
  return distance === Number.MAX_SAFE_INTEGER ? 0 : distance;
}
```

## 217\. 存在重复元素

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  let set = new Set();
  for (let val of nums) {
    if (!set.has(val)) {
      set.add(val);
    } else {
      return true;
    }
  }
  return false;
};
```

## 226\. 翻转二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
  if (!root) return root;

  let tmp = null;
  tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  if (root.left) invertTree(root.left);
  if (root.right) invertTree(root.right);
  return root;
};
```

## 230\. 二叉搜索树中第 K 小的元素

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
  const res = [];
  function dfs(root) {
    if (!root) return;
    dfs(root.left);
    res.push(root.val);
    dfs(root.right);
  }
  dfs(root);
  return res[k - 1];
};
```

## 234\. 回文链表

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function isPalindrome(head: ListNode | null): boolean {
  let cur = head;
  const stack = [];
  while (cur) {
    stack.push(cur.val);
    cur = cur.next;
  }
  cur = head;
  const mid = stack.length >> 1;
  for (let i = 0; i < mid; i++) {
    const pop = stack.pop();
    if (pop === cur.val) {
      cur = cur.next;
    } else {
      return false;
    }
  }
  return true;
  return false;
}
```

## 237\. 删除链表中的节点

```ts
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function(node) {
  node.val = node.next.val;
  node.next = node.next.next;
};
```

## 242\. 有效的字母异位词

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  if (s.length !== t.length) return false;
  let map = new Map();
  for (let i = 0; i < s.length; i++) {
    let key = s.charAt(i);
    if (!map.has(key)) {
      map.set(key, 1);
      continue;
    }
    //这样就能保证set中的字母至少是存在的
    let count = map.get(key);
    map.set(key, ++count);
  }
  for (let i = 0; i < t.length; i++) {
    let key = t.charAt(i);
    if (!map.has(key)) return false;
    let count = map.get(key);
    map.set(key, --count);
  }
  //最后遍历下map，检查结果是否存在非0的情况
  for (let val of map) {
    if (val[1] !== 0) {
      return false;
    }
  }
  return true;
};
```

## 328\. 奇偶链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var oddEvenList = function(head) {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  const originEven = head.next;

  while (even && even.next) {
    odd.next = odd.next.next;
    odd = odd.next;
    even.next = even.next.next;
    even = even.next;
  }

  odd.next = originEven;
  return head;
};
```

## 349\. 两个数组的交集

```ts
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  return [...new Set(nums1)].filter((item) => nums2.includes(item));
};
```

## 374\. 猜数字大小

```ts
/**
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
  let low = 1;
  let high = n;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const res = guess(mid);

    if (res === 0) {
      return mid;
    } else if (res === 1) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
};
```

## 419 甲板上的战舰

```js
/**
 * @param {character[][]} board
 * @return {number}
 */
var countBattleships = function(board) {
  let count = 0;

  const dfs = (x, y) => {
    if (
      x < 0 ||
      x >= board.length ||
      y < 0 ||
      y >= board[0].length ||
      board[x][y] === '.'
    ) {
      return;
    } else {
      board[x][y] = '.';
      dfs(x, y - 1);
      dfs(x, y + 1);
      dfs(x - 1, y);
      dfs(x + 1, y);
    }
  };

  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (board[x][y] === 'X') {
        count++;
        dfs(x, y);
      }
    }
  }
  return count;
};
```

## 442\. 数组中重复的数据

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function(nums) {
  let number = [];
  let status = [];
  for (let i = 0; i <= nums.length; i++) {
    status[i] = 0;
  }
  console.log(status);

  //将每一个数都放到相应的位置上
  for (let i = 0; i < nums.length; i++) {
    let value = nums[i];
    status[value]++;
  }
  for (let i = 0; i <= nums.length; i++) {
    if (status[i] == 2) {
      number.push(i);
    }
  }
  console.log(status);
  return number;
};
```

## 反转字符串中的单词 III(留空格)

```ts
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  let origin_arr = s.split(' ');
  let new_arr = [];
  for (let val of origin_arr) {
    let tmp = [];
    tmp = Array.from(val);
    let reverse_arr = tmp.reverse();
    new_arr.push(reverse_arr.join(''));
  }
  let final = new_arr.join(' ');
  return final;
};
```

## 最长连续递增序列

```ts
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
  if (nums.length === 0) return 0;

  let ans = 0;
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      count++;
    } else {
      ans = Math.max(ans, count);
      count = 1;
    }
  }
  return Math.max(ans, count);
};
```

## 695\. 岛屿的最大面积

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
  let res = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 1) {
        const count = dfs(i, j);
        res = Math.max(res, count);
      }
    }
  }

  function dfs(i, j) {
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      grid[i][j] === 0
    ) {
      return 0;
    }
    grid[i][j] = 0;
    let count = 1;
    count += dfs(i + 1, j);
    count += dfs(i - 1, j);
    count += dfs(i, j + 1);
    count += dfs(i, j - 1);
    return count;
  }

  return res;
};
```

## 876\. 链表的中间结点

```js
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

## 904\. 水果成篮

```js
/**
 * @param {number[]} tree
 * @return {number}
 */
var totalFruit = function(tree) {
  const map = new Map(); //用map来作为滑动窗口，模拟两个篮子
  let max = 1;
  let j = 0;
  for (let i = 0; i < tree.length; i++) {
    map.set(tree[i], i); //存储当前水果的种类，和最后出现的位置
    if (map.size > 2) {
      // 如果添加后超过了两个篮子，就删除掉前一个篮子
      // 找出前一个篮子对应的位置
      let targetIndex = tree.length - 1;
      for (let [type, index] of map) {
        if (index < targetIndex) {
          targetIndex = index;
        }
      }
      map.delete(tree[targetIndex]);
      j = targetIndex + 1;
    }

    max = Math.max(max, i - j + 1);
  }
  return max;
};
```

## 链表求和

```js
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(null);
  let cur = dummy;
  let carry = 0;

  while (l1 && l2) {
    const sum = l1.val + l2.val + carry;
    let node;
    if (sum > 9) {
      node = new ListNode(sum - 10);
      carry = 1;
    } else {
      node = new ListNode(sum);
      carry = 0;
    }
    cur.next = node;
    cur = cur.next;
    l1 = l1.next;
    l2 = l2.next;
  }

  while (l1) {
    const sum = l1.val + carry;
    let node;
    if (sum > 9) {
      node = new ListNode(sum - 10);
      carry = 1;
    } else {
      node = new ListNode(sum);
      carry = 0;
    }
    cur.next = node;
    cur = cur.next;
    l1 = l1.next;
  }

  while (l2) {
    const sum = l2.val + carry;
    let node;
    if (sum > 9) {
      node = new ListNode(sum - 10);
      carry = 1;
    } else {
      node = new ListNode(sum);
      carry = 0;
    }
    cur.next = node;
    cur = cur.next;
    l2 = l2.next;
  }

  if (carry > 0) {
    const carryNode = new ListNode(1);
    cur.next = carryNode;
  }

  return dummy.next;
}
```

## 剑指 Offer 09. 用两个栈实现队列

```js
var CQueue = function() {
  this.inStack = [];
  this.outStack = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  this.inStack.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  if (this.outStack.length) {
    return this.outStack.pop();
  } else {
    while (this.inStack.length) {
      this.outStack.push(this.inStack.pop());
    }
    return this.outStack.pop() || -1;
  }
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```

## 二维数组中的查找

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
  let res = null;
  for (let i = 0; i < matrix.length; i++) {
    res = binsarySearch(matrix[i], target, 0, matrix[i].length - 1);
    if (res != -1) return true;
  }
  return false;
};
function binsarySearch(arr, target, lp, rp) {
  if (lp > rp) {
    return -1;
  }

  let midIndex = Math.floor((lp + rp) / 2);
  let midVal = arr[midIndex];
  if (target === midVal) return midIndex;
  if (target < midVal) {
    //从左半旯开始找
    return binsarySearch(arr, target, lp, midIndex - 1);
  } else {
    return binsarySearch(arr, target, midIndex + 1, rp);
  }
}
```

## 替换空格

```js
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
  return s.replace(/ /g, '%20');
};
```

## 从尾到头打印链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
  let res = [];
  let stack = [];
  let cur = head;
  while (cur) {
    stack.push(cur.val);
    cur = cur.next;
  }

  while (stack.length) {
    res.push(stack.pop());
  }
  return res;
};
```

## 对称的二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */

class Info {
  constructor(isSymmetric) {
    this.isSymmetric = isSymmetric;
  }
}

function getInfo(root) {
  if (root == null) return new Info(true);
  let isSymmetric;

  const leftInfo = getInfo(root.left);
  const rightInfo = getInfo(root.right);

  if (leftInfo.isSymmetric && rightInfo.isSymmetric) {
    isSymmetric = true;
  } else {
    isSymmetric = false;
  }

  if (root.left.val == root.right.val) return new Info(isSymmetric);
}

var isSymmetric = function(root) {
  return getInfo(root).isSymmetric;
};
```

## 调整数组顺序使奇数位于偶数前面

```ts
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function(nums) {
  let i = 0;
  let j = nums.length - 1;

  while (i < j) {
    while (i < j && nums[i] % 2 === 1) i++;
    while (i < j && nums[j] % 2 === 0) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
    i++;
    j--;
  }
  return nums;
};
```

## 链表中倒数第 k 个节点

```ts
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function(head, k) {
  const stack = [];
  while (head) {
    stack.push(head);
    head = head.next;
  }

  for (let i = 1; i <= k; i++) {
    const res = stack.pop();
    if (i === k) return res;
  }
};
```

## 删除链表的节点

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function(head, val) {
  let pre = new ListNode('虚拟头结点');
  //将pre节点与头结点相连
  pre.next = head;
  //从preNode开始遍历
  let preNode = pre;

  while (preNode.next) {
    if (preNode.next.val != val) {
      preNode = preNode.next;
    } else {
      preNode.next = preNode.next.next;
      break;
    }
  }
  return pre.next;
};
```

## 第一个只出现一次的字符

```js
/**
 * @param {string} s
 * @return {character}
 */
var firstUniqChar = function(s) {
  let res = ' ';

  let map = {};
  //初始化计数器
  for (let val of s) {
    map[val] = 0;
  }
  //访问到对应的key，就将其的val+1
  for (let val of s) {
    map[val]++;
  }

  for (let key in map) {
    if (map[key] === 1) {
      return key;
    }
  }
  return res;
};
```

## 数字翻译成字符串

```js
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function(num) {
  const numStr = num.toString();

  function dfs(index) {
    if (index >= numStr.length - 1) {
      return 1;
    }
    const twoNumber = Number(numStr[index] + numStr[index + 1]);
    // 如果这两位数 在合法的区间内  那么就有两个选择
    if (twoNumber >= 10 && twoNumber <= 25) {
      return dfs(index + 1) + dfs(index + 2);
    } else {
      // 如果不在的话 就只有一个选择
      return dfs(index + 1);
    }
  }

  const res = dfs(0);
  return res;
};
```

## 两个链表的第一个公共节点

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  let stackA = [];
  let stackB = [];
  let curA = headA;
  let curB = headB;
  if (curA == null || curB == null) return null;
  if (curA == curB) return curA;
  while (curA) {
    stackA.push(curA);
    curA = curA.next;
  }
  while (curB) {
    stackB.push(curB);
    curB = curB.next;
  }
  //同时出栈,定义一个变量保存最后结果
  let res = null;
  while (true) {
    let a = stackA.pop();
    let b = stackB.pop();
    if (a != b) {
      return res;
    } else res = a;
  }
};
```

## 平衡二叉树

```js
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

class Info{
    public isBalanced:boolean;
    public height:number;
    constructor(isBalanced:boolean,height:number){
        this.isBalanced = isBalanced;
        this.height = height;
    }
}

const getTreeInfo = (tree:TreeNode|null):Info=>{
    if(tree == null){
        return new Info(true,0);
    }

    const leftInfo = getTreeInfo(tree.left);
    const rightInfo = getTreeInfo(tree.right);

    const height = Math.max(leftInfo.height,rightInfo.height)+1;

    let isBalanced = true;

    if(!leftInfo.isBalanced||!rightInfo.isBalanced||Math.abs(leftInfo.height-rightInfo.height)>1){
        isBalanced = false
    }

    return new Info(isBalanced,height);
}

function isBalanced(root: TreeNode | null): boolean {
    const result = getTreeInfo(root).isBalanced;
    return result;
};
```

## 圆圈中最后剩下的数字

```js
/**
 * @param {number} n
 * @param {number} m
 * @return {number}
 */
var lastRemaining = function(n, m) {
  if (n < 2) return 0;

  return (lastRemaining(n - 1, m) + m) % n;
};
```
