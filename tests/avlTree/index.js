const { expect } = require('chai');
const { default: Tree } = require('../../build/handle/session/binaryTree/tree.js');

describe('初始化', function () {
  describe('初始化成功', function () {
    const BTree = new Tree({});
    expect(BTree).to.be.a('object');
  });
});