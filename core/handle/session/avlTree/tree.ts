import { Piece } from '../pieceTable';

interface AvlTree<T extends Piece> {
  // 树的高度
  // height：平衡因子
  // 空树 -1
  // 满 1
  // 不满 0
  piece: T; // 数据

  // AvlTree 结点相关
  height: number; // 树的高度
  left: AvlTree<T>; // 左节点
  right: AvlTree<T>; // 右节点
  lf_left: number; // 左子树的总换行数
}

function createNode<T extends Piece>(element: T): AvlTree<T> {
  // 初始化
  return {
    left: null,
    right: null,
    piece: element,
    height: -1,
    lf_left: 0,
  };
}

function getHeight<T extends Piece>(position: AvlTree<T>): number {
  // 获取树的高度
  // 如果为空，则返回-1
  if (!position) {
    return -1;
  }
  return position.height;
}

function find<T extends Piece>(element: T, avlTree: AvlTree<T>): AvlTree<T> {
  // 查找
  if (!avlTree) {
    return null;
  }
  if (contrastByLeft(element, avlTree) < 0) {
    return find(element, avlTree.left);
  } else if (contrastByLeft(element, avlTree)) {
    return find(element, avlTree.right);
  } else {
    return avlTree;
  }
}

function findMin<T extends Piece>(avlTree: AvlTree<T>): AvlTree<T> {
  // 找到最小结点
  let leftNode = avlTree.left;
  while(leftNode) {
    leftNode = leftNode.left;
  }
  return leftNode;
}

function findMix<T extends Piece>(avlTree: AvlTree<T>): AvlTree<T> {
  // 找到最大结点
  let rightNode = avlTree.right;
  while(rightNode) {
    rightNode = rightNode.right;
  }
  return rightNode;
}

function singleRotateWithLeft<T extends Piece>(k2: AvlTree<T>): AvlTree<T> {
  // 单左旋
  // 左边小的情况
  let k1: AvlTree<T>;
  k1 = k2.left;
  k2.left = k1.right;
  k2.lf_left = getLfLeft(k2.left) + getLfCur(k2.left);
  k1.right = k2;
  k2.height = Math.max(getHeight(k2.left), getHeight(k2.right)) + 1;
  k1.height = Math.max(getHeight(k1.left), k2.height) + 1;
  return k1; // 新的结点
}

function doubleRotateWithLeft<T extends Piece>(k3: AvlTree<T>): AvlTree<T> {
  // 双旋，左右
  // 孙子与子进行一次左旋
  // k3.left -> k2
  // k1 and k2
  k3.left = singleRotateWithRight(k3.left)
  // 然后新儿子与自己进行一次左旋
  // k3 and k2
  return singleRotateWithLeft(k3)
}

function doubleRotateWithRight<T extends Piece>(k1: AvlTree<T>): AvlTree<T> {
  // 双旋，右左
  // 孙子与子进行一次左旋
  // k3 and k2
  k1.right = singleRotateWithLeft(k1.right);
  // 然后新儿子与自己进行一次左旋
  // k1 and k2
  return singleRotateWithRight(k1);
}

function singleRotateWithRight<T extends Piece>(k1: AvlTree<T>): AvlTree<T> {
  // 单右旋
  // 右边大的情况
  let k2: AvlTree<T>;
  k2 = k1.right;
  k1.right = k2.left;
  k2.left = k1;
  k2.lf_left = getLfLeft(k1) + getLfCur(k1);
  k1.height = Math.max(getHeight(k1.left), getHeight(k1.right)) + 1;
  k2.height = Math.max(getHeight(k2.left), k1.height) + 1;
  return k2; // 新的结点
}

function contrastByLeft<T extends Piece>(node1: T, node2: AvlTree<T>): number {
  // 对比节点是大于还是小于还是等于
  // > 0 大于
  // === 0 等于
  // < 0 小于
  // x - y < 0 x < y
  // x - y > 0 x > y
  // x === y
  if (getLfLeft(node2) > 0 && getLfLeft(node2) >= node1.lfCur) {
    return -1;
  }
  if (getLfLeft(node2) === 0) {
    // lf_left === 0,就判断 lfCur
    return node1.lfCur - getLfCur(node2);
  }
  return 1;
}

function getLfLeft<T extends Piece>(position: AvlTree<T>): number {
  if (!position) {
    return 0;
  }
  return position.lf_left;
}

function getLfCur<T extends Piece>(position: AvlTree<T>): number {
  if (!position) {
    return 0;
  }
  return position.piece.lfCur;
}

function insert<T extends Piece>(element: T, avlTree?: AvlTree<T>): AvlTree<T> {
  if (!avlTree) {
    avlTree = createNode(element);
  } else if (contrastByLeft(element, avlTree) <  0) {
    // element < avlTree 左插入
    avlTree.left = insert(element, avlTree.left);
    // 计算lf_left
    avlTree.lf_left = avlTree.left.lf_left + avlTree.left.piece.lfCur;
    // 不满足平衡
    if (getHeight(avlTree.left) - getHeight(avlTree.right) === 2) {
      // 不满足的条件只能是左子树高度高于右边
      // 且有左左和左右两种情况
      if (contrastByLeft(element, avlTree.left) < 0) {
        // contrastByLeft(element, avlTree.left) < 0   ===  element < avlTree.left
        avlTree = singleRotateWithLeft(avlTree);
      } else {
        avlTree = doubleRotateWithLeft(avlTree);
      }
    }
  } else if (contrastByLeft(element, avlTree) > 0) {
    // element > avlTree 右插入
    avlTree.right = insert(element, avlTree.right);
    // 不满足平衡
    if (getHeight(avlTree.right) - getHeight(avlTree.left) === 2) {
      // 不满足的条件只能是右子树高度高于左边
      // 且有右右和右左两种情况
      if (contrastByLeft(element, avlTree.right) > 0) {
        // contrastByLeft(element, avlTree.right) > 0   ===   element > avlTree.right
        avlTree = singleRotateWithRight(avlTree);
      } else {
        avlTree = doubleRotateWithRight(avlTree);
      }
    }
  } else {
    // 相等的情况下，默认往右边插入
    avlTree.right = insert(element, avlTree.right);
    // 不满足平衡
    if (getHeight(avlTree.right) - getHeight(avlTree.left) === 2) {
      // 不满足的条件只能是右子树高度高于左边
      // 且有右右和右左两种情况
      if (contrastByLeft(element, avlTree.right) > 0) {
        // contrastByLeft(element, avlTree.right) > 0   ===   element > avlTree.right
        avlTree = singleRotateWithRight(avlTree);
      } else {
        avlTree = doubleRotateWithRight(avlTree);
      }
    }
  }
  avlTree.height = Math.max(getHeight(avlTree.left), getHeight(avlTree.right)) + 1;
  return avlTree;
}

function insertBySet<T extends Piece>(element: T, avlTree?: AvlTree<T>): AvlTree<T> {
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