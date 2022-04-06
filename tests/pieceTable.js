import { expect } from 'chai';
import PieceTable from '../build/handle/session/pieceTable.js';

// describe('测试插入行', function () {
//   const table = new PieceTable();
//   it('插入第一段', function () {
//     table.insert(1, 'const sl = 132;');
//     expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
//   });
//   it('插入换行', function () {
//     table.insert(1, "  啊啥的 气温去\n");
//     expect(table.getLineRawContent(1)).to.equal('const sl = 132;  啊啥的 气温去');
//   });
//   it('获取第二行', function () {
//     expect(table.getLineRawContent(2)).to.equal('');
//   });
//   it('插入第二行', function () {
//     table.insert(2, 'var a = 123;');
//     expect(table.getLineRawContent(2)).to.equal('var a = 123;');
//   });
//   it('插入第三行', function () {
//     table.insert(2, "\n");
//     expect(table.getLineRawContent(2)).to.equal('var a = 123;');
//     expect(table.getLineRawContent(3)).to.equal('');
//     table.insert(3, "哈哈哈哈");
//     expect(table.getLineRawContent(3)).to.equal('哈哈哈哈');
//   });
// });

// describe('测试getLineLength方法', () => {
//   const table = new PieceTable();
//   table.insert(1, 'const sl = 132;');
//   table.insert(1, '        ');
//   table.insert(1, "  啊啥的 气温去\n");
//   table.insert(2, "啊啊啊");
//   table.insert(2, "啊啊 啊\n");
//   it('1 -> 36', function () {
//     expect(table.getLineLength(1)).to.equal(32);
//   });
//   it('2 -> 3', function () {
//     expect(table.getLineLength(2)).to.equal(7);
//   });
//   it('3 -> 0', function () {
//     expect(table.getLineLength(3)).to.equal(0);
//   });
// });

describe('测试插入行', function () {
  const table = new PieceTable();
  it('插入第一段', function () {
    table.insert(1, 1,'const sl = 132;');
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
  });
  it('插入换行', function () {
    table.insert(1, 16,"  啊啥的 气温去\n");
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;  啊啥的 气温去');
  });
  it('获取第二行', function () {
    expect(table.getLineRawContent(2)).to.equal('');
  });
  it('插入第二行', function () {
    table.insert(2, 1, 'var a = 123;');
    expect(table.getLineRawContent(2)).to.equal('var a = 123;');
  });
  it('插入第三行', function () {
    table.insert(2, 13, "\n");
    expect(table.getLineRawContent(2)).to.equal('var a = 123;');
    expect(table.getLineRawContent(3)).to.equal('');
    table.insert(3, 1,"哈哈哈哈");
    expect(table.getLineRawContent(3)).to.equal('哈哈哈哈');
  });
});

describe('测试getLineLength方法', () => {
  const table = new PieceTable();
  table.insert(1, 1, 'const sl = 132;');
  table.insert(1, 16, '        ');
  table.insert(1, 24, "  啊啥的 气温去\n");
  table.insert(2, 1, "啊啊啊");
  table.insert(2, 4, "啊啊 啊\n");
  it('1 -> 36', function () {
    expect(table.getLineLength(1)).to.equal(32);
  });
  it('2 -> 3', function () {
    expect(table.getLineLength(2)).to.equal(7);
  });
  it('3 -> 0', function () {
    expect(table.getLineLength(3)).to.equal(0);
  });
});


describe('测试中间插入行', function () {
  // 暂不支持换行
  const table = new PieceTable();
  it('第一段', function () {
    table.insert(1, 1, 'const sl = 132;');
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
  });
  it('中间第二字符插入', function () {
    table.insert(1, 3, "  啊啥的 气温去");
    expect(table.getLineRawContent(1)).to.equal('co  啊啥的 气温去nst sl = 132;');
  });
  it('中间第10字符插入', function () {
    table.insert(1, 11, "inser test ;");
    expect(table.getLineRawContent(1)).to.equal('co  啊啥的 气温inser test ;去nst sl = 132;');
  });
  it('中间第36字符插入', function () {
    table.insert(1, 37, "嘿嘿嘿哈哈哈啊啊啊");
    expect(table.getLineRawContent(1)).to.equal('co  啊啥的 气温inser test ;去nst sl = 132;嘿嘿嘿哈哈哈啊啊啊');
  });
  it('1 -> 45', function () {
    expect(table.getLineLength(1)).to.equal(45);
  });
  it('中间第36字符插入换行', function () {
    table.insert(1, 37, "\n嗯嗯");
    expect(table.getLineRawContent(1)).to.equal("co  啊啥的 气温inser test ;去nst sl = 132;");
    expect(table.getLineRawContent(2)).to.equal("嘿嘿嘿哈哈哈啊啊啊");
  });
});


describe('测试getLineRawContent，换行符在行尾', function () {
  // 暂不支持换行
  const table = new PieceTable();
  table.insert(1, 1, "const sl = 132;\nslddl=123;\nasdqwe//测试一下下\n");
  table.insert(4, 1, "嘿嘿嘿哈哈\n嗯嗯");
  it('1', function () {
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
  });
  it('2', function () {
    expect(table.getLineRawContent(2)).to.equal('slddl=123;');
  });
  it('3', function () {
    expect(table.getLineRawContent(3)).to.equal('asdqwe//测试一下下');
  });
  it('4', function () {
    expect(table.getLineRawContent(4)).to.equal('嘿嘿嘿哈哈');
  });
  it('5', function () {
    expect(table.getLineRawContent(5)).to.equal('嗯嗯');
  });
});

describe('测试getLineRawContent，换行符在行头', function () {
  // 暂不支持换行
  const table = new PieceTable();
  table.insert(1, 1, "const sl = 132;");
  table.insert(4, 1, "\nslddl=123;\nasdqwe//测试一下下\n嘿嘿嘿哈哈\n嗯嗯");
  it('1', function () {
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
  });
  it('2', function () {
    expect(table.getLineRawContent(2)).to.equal('slddl=123;');
  });
  it('3', function () {
    expect(table.getLineRawContent(3)).to.equal('asdqwe//测试一下下');
  });
  it('4', function () {
    expect(table.getLineRawContent(4)).to.equal('嘿嘿嘿哈哈');
  });
  it('5', function () {
    expect(table.getLineRawContent(5)).to.equal('嗯嗯');
  });
});

describe('测试getLineRawContent，换行符在行头', function () {
  // 暂不支持换行
  const table = new PieceTable();
  table.insert(1, 1, "const sl = 132;");
  table.insert(4, 1, "\nslddl=123;");
  console.log(table.pieces.right)
  it('1', function () {
    expect(table.getLineRawContent(1)).to.equal('const sl = 132;');
  });
  it('2', function () {
    expect(table.getLineRawContent(2)).to.equal("slddl=123;");
  });
});
