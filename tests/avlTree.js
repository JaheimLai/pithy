import { expect } from 'chai';
import TreeApi from '../build/handle/session/avlTree/tree.js';

describe('测试avl tree是否符合数据结构的定义', function () {
  describe('初始化', function () {
    it('初始化成功', function () {
      let BTree = TreeApi.insert({ line: 23 });
      expect(BTree).to.have.property('left');
      expect(BTree).to.have.property('right');
      expect(BTree).to.have.property('height');
    });
    it('正确插入', function () {
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 21 }, BTree);
      expect(BTree.left).to.have.property('left');
      expect(BTree.left).to.have.property('right');
      expect(BTree.left).to.have.property('height');
      expect(BTree.left.line).to.equal(21);
      expect(BTree.height).to.equal(1);
      expect(BTree.left.height).to.equal(0);
    });    
  })
  describe('测试左边不平衡的情况', function () {
    it('遇到左左的平衡情况', function () {
      /**
       *        23                 21
       *     21       --->     19     23
       *  19
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 21 }, BTree);
      BTree = TreeApi.insert({ line: 19 }, BTree);
      expect(BTree.line).to.equal(21);
      expect(BTree.left.line).to.equal(19);
      expect(BTree.right.line).to.equal(23);
      expect(BTree.height).to.equal(1);
      expect(BTree.left.height).to.equal(0);
      expect(BTree.right.height).to.equal(0);
    });
    it('遇到左右的平衡情况', function () {
      /**
       *            23                   22
       *       21            --->     21     23
       *          22
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 21 }, BTree);
      BTree = TreeApi.insert({ line: 22 }, BTree);
      expect(BTree.line).to.equal(22);
      expect(BTree.left.line).to.equal(21);
      expect(BTree.right.line).to.equal(23);
      expect(BTree.height).to.equal(1);
      expect(BTree.left.height).to.equal(0);
      expect(BTree.right.height).to.equal(0);
    });
    it('遇到左左左左，需要根平衡的情况', function () {
      /**
       *             21                   17
       *         17     23   --->     15      21
       *      15   19              13      19    23
       *   13
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 21 }, BTree);
      BTree = TreeApi.insert({ line: 19 }, BTree);
      BTree = TreeApi.insert({ line: 17 }, BTree);
      BTree = TreeApi.insert({ line: 15 }, BTree);
      BTree = TreeApi.insert({ line: 13 }, BTree);
      expect(BTree.line).to.equal(17);
      expect(BTree.left.line).to.equal(15);
      expect(BTree.left.left.line).to.equal(13);
      expect(BTree.right.line).to.equal(21);
      expect(BTree.right.right.line).to.equal(23);
      expect(BTree.right.left.line).to.equal(19);
      expect(BTree.height).to.equal(2);
      expect(BTree.left.height).to.equal(1);
      expect(BTree.right.height).to.equal(1);
    });
  });
  describe('测试右边不平衡的情况', function () {
    it('遇到右右的平衡情况', function () {
      /**
       *    23                       26
       *       26        --->     23     28
       *          28
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 26 }, BTree);
      BTree = TreeApi.insert({ line: 28 }, BTree);
      expect(BTree.line).to.equal(26);
      expect(BTree.left.line).to.equal(23);
      expect(BTree.right.line).to.equal(28);
      expect(BTree.height).to.equal(1);
      expect(BTree.left.height).to.equal(0);
      expect(BTree.right.height).to.equal(0);
    });
    it('遇到右左的平衡情况', function () {
      /**
       *    23                       24
       *       26        --->     23     26
       *    24    
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 26 }, BTree);
      BTree = TreeApi.insert({ line: 24 }, BTree);
      expect(BTree.line).to.equal(24);
      expect(BTree.left.line).to.equal(23);
      expect(BTree.right.line).to.equal(26);
      expect(BTree.height).to.equal(1);
      expect(BTree.left.height).to.equal(0);
      expect(BTree.right.height).to.equal(0);
    });
    it('遇到右右右右，需要根平衡的情况', function () {
      /**
       *          23                              30
       *      26     30          --->         26      32
       *          28    32                23     28       34
       *                    34                          
       */
      let BTree = TreeApi.insert({ line: 23 });
      BTree = TreeApi.insert({ line: 26 }, BTree);
      BTree = TreeApi.insert({ line: 28 }, BTree);
      BTree = TreeApi.insert({ line: 30 }, BTree);
      BTree = TreeApi.insert({ line: 32 }, BTree);
      BTree = TreeApi.insert({ line: 34 }, BTree);
      expect(BTree.line).to.equal(30);
      expect(BTree.left.line).to.equal(26);
      expect(BTree.left.left.line).to.equal(23);
      expect(BTree.left.right.line).to.equal(28);
      expect(BTree.right.line).to.equal(32);
      expect(BTree.right.right.line).to.equal(34);
      expect(BTree.height).to.equal(2);
      expect(BTree.left.height).to.equal(1);
      expect(BTree.right.height).to.equal(1);
    });
  });
});