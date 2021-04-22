---
title: Welcome!!!
date: 2017-5-15
categories:
  - none
---

## 旋转图像

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

## 合并两个有序链表

```js
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let tail = nums1.length - 1;

  // 遍历双指针  谁大把谁追加到最后

  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[tail--] = nums1[p1--];
    } else {
      nums1[tail--] = nums2[p2--];
    }
  }

  // 如果m和n不相等，要继续追加

  while (p1 >= 0) {
    nums1[tail--] = nums1[p1--];
  }

  while (p2 >= 0) {
    nums1[tail--] = nums2[p2--];
  }
};
```

## 字符串相加

```js
function addStrings(num1: string, num2: string): string {
  // 指向两个数的最后一位
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const ans = [];
  // eg：789
  //     697
  // 模拟小学加法
  while (i >= 0 || j >= 0 || carry != 0) {
    // 只要所有的指针没跑完，或者有进位，就一直跑循环
    const x = i >= 0 ? Number(num1[i]) : 0; // 如果越界了就让那位为0
    const y = j >= 0 ? Number(num2[j]) : 0;
    const res = x + y + carry;
    ans.unshift(res % 10); // 把算的数从前面装进去
    carry = res > 9 ? 1 : 0;
    // 双指针继续往前跑
    i--;
    j--;
  }
  return ans.join("");
}
```

## 换酒问题

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

## 最长重复子数组

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

## ### 两数之和

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = new Map();
  // 使用一个map来存储当前的值和其对应的位置

  for (let i = 0; i < nums.length; i++) {
    const sub = target - nums[i];
    if (!map.has(sub)) {
      map.set(nums[i], i);
    } else {
      return [map.get(sub), i];
    }
  }
};
```

## 子集

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
  const res = [];

  function dfs(start, path) {
    res.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // 只能从当前位置开始，选择添加后面的元素
      path.push(nums[i]);
      dfs(i + 1, path);
      path.pop();
    }
  }

  dfs(0, []);
  return res;
};
```

## 不同路径 II

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

## 从前序与中序遍历序列构造二叉树

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

## 删除字符串中的所有相邻重复项

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

  return stack.join("");
};
```

## 最长公共前缀

```js
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
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

## 三数之和

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

## 打乱数组

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

## 阶乘后的 0

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

## 无重复字符的最长子串

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  const map = new Map();
  let tmpIndex = -1;
  let tmpDistance = 0;

  for (let i = 0; i < s.length; i++) {
    const preIndex = map.get(s[i]) ?? -1;
    tmpIndex = Math.max(preIndex, tmpIndex);
    const distance = i - tmpIndex;
    tmpDistance = Math.max(distance, tmpDistance);
    map.set(s[i], i);
  }

  return tmpDistance;
};
```

## 移动零

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

## 最大子序和

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  let ans = nums[0];
  let sum = 0;

  for (let num of nums) {
    if (sum + num > num) {
      sum += num;
    } else {
      sum = num;
    }
    ans = Math.max(ans, sum);
  }

  return ans;
};
```

## 对角线遍历

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var findDiagonalOrder = function(matrix) {
  if (matrix.length === 0) return [];
  const res = [];
  let upRight = true;
  // 记录到了第几行 第几列
  let row = 0;
  let col = 0;
  const rows = matrix.length;
  const cols = matrix[0].length;

  while (row < rows && col < cols) {
    res.push(matrix[row][col]);
    if (upRight) {
      row -= 1;
      col += 1;
    } else {
      row += 1;
      col -= 1;
    }

    // 此时row跑到了-1行,col跑到了第二列
    if (row < 0 || col < 0 || row >= rows || col >= cols) {
      // 此时说明要拐弯了
      if (upRight) {
        if (col < cols) {
          // 说明是上边越界，此时把行拽回来
          row = 0;
        } else {
          // 否则col === col长度  说明是右边越界
          row += 2;
          col--;
        }
      } else {
        if (row < rows) {
          col = 0;
        } else {
          row--;
          col += 2;
        }
      }
      upRight = !upRight;
    }
  }
  return res;
};
```

## 有效的括号

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  const map = new Map();
  map.set("(", ")");
  map.set("[", "]");
  map.set("{", "}");

  const stack = [];

  for (let val of s) {
    const right = map.get(val);
    // 能get到  说明此时的val是左括号，把对应的右括号压进去
    if (right) {
      stack.push(right);
    } else {
      // get不到  说明此时val是右括号，和栈顶元素判断是否相等
      if (stack.pop() !== val) return false;
    }
  }
  return stack.length > 0 ? false : true;
};
```

## 螺旋矩阵

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

  let direction = "right";
  const res = [];

  while (left <= right && top <= bottom) {
    if (direction === "right") {
      for (let i = left; i <= right; i++) {
        res.push(matrix[top][i]);
      }
      direction = "down";
      top++;
    } else if (direction === "down") {
      for (let i = top; i <= bottom; i++) {
        res.push(matrix[i][right]);
      }
      direction = "left";
      right--;
    } else if (direction === "left") {
      for (let i = right; i >= left; i--) {
        res.push(matrix[bottom][i]);
      }
      direction = "up";
      bottom--;
    } else if (direction === "up") {
      for (let i = bottom; i >= top; i--) {
        res.push(matrix[i][left]);
      }
      direction = "right";
      left++;
    }
  }
  return res;
};
```

## Z 字型变换

```js
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
  const arrays = new Array(numRows);
  for (let i = 0; i < arrays.length; i++) {
    arrays[i] = new Array();
  }
  let border = 0;
  let mid = 0;
  let curIndex = 0;

  while (curIndex < s.length) {
    // 先竖着下来
    for (let i = 0; i < arrays.length; i++) {
      if (curIndex >= s.length) break;
      if (i === 0 || i === curIndex.length - 1) {
        arrays[i][border] = s[curIndex++];
      } else {
        arrays[i][mid] = s[curIndex++];
      }
    }
    border++;
    mid++;
    // 再斜着上去
    for (let i = arrays.length - 2; i >= 1; i--) {
      if (curIndex >= s.length) break;
      arrays[i][mid] = s[curIndex++];
    }
    mid++;
  }
  console.table(arrays);
};
```
