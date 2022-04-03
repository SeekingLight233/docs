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


