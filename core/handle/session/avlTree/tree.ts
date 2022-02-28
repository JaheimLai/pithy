interface Data {
  line: number; // 行数，作为大小的标准
}

interface AvlTree<T extends Data> {
  // 树的高度
  // height：平衡因子
  // 空树 -1
  // 满 1
  // 不满 0
  line: number // 行号
  data: T; // 数据

  // AvlTree 结点相关
  height: number; // 树的高度
  left: AvlTree<T>; // 左节点
  right: AvlTree<T>; // 右节点
}

function createNode<T extends Data>(element: T): AvlTree<T> {
  return {
    left: null,
    right: null,
    line: element.line,
    data: element,
    height: -1,
  };
}

function getHeight<T extends Data>(position: AvlTree<T>): number {
  // 获取树的高度
  // 如果为空，则返回-1
  if (!position) {
    return -1;
  }
  return position.height;
}

function find<T extends Data>(element: T, avlTree: AvlTree<T>): AvlTree<T> {
  // 查找
  if (!avlTree) {
    return null;
  }
  if (element.line < avlTree.line) {
    return find(element, avlTree.left);
  } else if (element.line > avlTree.line) {
    return find(element, avlTree.right);
  } else {
    return avlTree;
  }
}

function findMin<T extends Data>(avlTree: AvlTree<T>): AvlTree<T> {
  // 找到最小结点
  let leftNode = avlTree.left;
  while(leftNode) {
    leftNode = leftNode.left;
  }
  return leftNode;
}

function findMix<T extends Data>(avlTree: AvlTree<T>): AvlTree<T> {
  // 找到最大结点
  let rightNode = avlTree.right;
  while(rightNode) {
    rightNode = rightNode.right;
  }
  return rightNode;
}

function singleRotateWithLeft<T extends Data>(k2: AvlTree<T>): AvlTree<T> {
  // 单左旋
  // 左边小的情况
  let k1: AvlTree<T>;
  k1 = k2.left;
  k2.left = k1.right;
  k1.right = k2;
  k2.height = Math.max(getHeight(k2.left), getHeight(k2.right)) + 1;
  k1.height = Math.max(getHeight(k1.left), k2.height) + 1;
  return k1; // 新的结点
}

function doubleRotateWithLeft<T extends Data>(k3: AvlTree<T>): AvlTree<T> {
  // 双旋，左右
  // 孙子与子进行一次左旋
  // k3.left -> k2
  // k1 and k2
  k3.left = singleRotateWithRight(k3.left)
  // 然后新儿子与自己进行一次左旋
  // k3 and k2
  return singleRotateWithLeft(k3)
}

function doubleRotateWithRight<T extends Data>(k1: AvlTree<T>): AvlTree<T> {
  // 双旋，右左
  // 孙子与子进行一次左旋
  // k3 and k2
  k1.right = singleRotateWithLeft(k1.right);
  // 然后新儿子与自己进行一次左旋
  // k1 and k2
  return singleRotateWithRight(k1);
}

function singleRotateWithRight<T extends Data>(k1: AvlTree<T>): AvlTree<T> {
  // 单右旋
  // 右边大的情况
  let k2: AvlTree<T>;
  k2 = k1.right;
  k1.right = k2.left;
  k2.left = k1;
  k1.height = Math.max(getHeight(k1.left), getHeight(k1.right)) + 1;
  k2.height = Math.max(getHeight(k2.left), k1.height) + 1;
  return k2; // 新的结点
}

function insert<T extends Data>(element: T, avlTree?: AvlTree<T>): AvlTree<T> {
  if (!avlTree) {
    avlTree = createNode(element);
  } else if (element.line < avlTree.line) {
    // 左插入
    avlTree.left = insert(element, avlTree.left);
    // 不满足平衡
    if (getHeight(avlTree.left) - getHeight(avlTree.right) === 2) {
      // 不满足的条件只能是左子树高度高于右边
      // 且有左左和左右两种情况
      if (element.line < avlTree.left.line) {
        avlTree = singleRotateWithLeft(avlTree);
      } else {
        avlTree = doubleRotateWithLeft(avlTree);
      }
    }
  } else if (element.line > avlTree.line) {
    // 右插入
    avlTree.right = insert(element, avlTree.right);
    // 不满足平衡
    if (getHeight(avlTree.right) - getHeight(avlTree.left) === 2) {
      // 不满足的条件只能是右子树高度高于左边
      // 且有右右和右左两种情况
      if (element.line > avlTree.right.line) {
        avlTree = singleRotateWithRight(avlTree);
      } else {
        avlTree = doubleRotateWithRight(avlTree);
      }
    }
  }
  avlTree.height = Math.max(getHeight(avlTree.left), getHeight(avlTree.right)) + 1;
  return avlTree;
}

function insertBySet<T extends Data>(element: T, avlTree?: AvlTree<T>): AvlTree<T> {
  avlTree = insert(element, avlTree);
  return avlTree;
}

export {
  AvlTree,
}

export default {
  insert,
  insertBySet,
}