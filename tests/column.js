import { expect } from 'chai';
import { CursorColumns } from '../build/handle/column.js';

function testColumnFromVisibleColumn(lineContent, column, result) {
  expect(CursorColumns.columnFromVisibleColumn(lineContent, column)).to.equal(result);
}

function testVisibleColumnFromColumn(lineContent, column) {
  expect(CursorColumns.visibleColumnFromColumn(lineContent, column)).to.equal(result);
}

describe('testColumnFromVisibleColumn', function () {
  describe("const a = '啊啊啊啊';", () => {
    const test1 = "const a = '啊啊啊啊';";
    it(test1, function () {
      testColumnFromVisibleColumn(test1, 13, 13);
      testColumnFromVisibleColumn(test1, 14, 13);
    });
  });
  describe("a啊", () => {
    const test2 = "a啊";
    it(test2, function () {
      testColumnFromVisibleColumn(test2, 0, 1);
      testColumnFromVisibleColumn(test2, 2, 2);
      testColumnFromVisibleColumn(test2, 3, 3);
      // 超出的情况下
      testColumnFromVisibleColumn(test2, 4, 4);
    });
  });
  describe("aa", () => {
    const test2 = "aa";
    it(test2, function () {
      testColumnFromVisibleColumn(test2, 0, 1);
      testColumnFromVisibleColumn(test2, 1, 2);
      testColumnFromVisibleColumn(test2, 2, 3);
    });
  });
});