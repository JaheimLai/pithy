import AvlTreeApi, { AvlTree } from './avlTree/tree';

const enum SOURCE {
  ADD = 'add',
  ORG = 'original',
}

class Piece {
  start: number; // 在buffer的起始位置（偏移值）
  length: number; // 片段的长度
  lineStarts: number[]; // 每个换行符的位置
  bufferIndex: number; // 在add buffer的那个位置（数组下标）
  lfCur: number; // 当前的换行数

  constructor(
    start: number,
    length: number,
    lineStarts: number[],
    bufferIndex: number,
    lfCur: number,
  ) {
    this.start = start;
    this.length = length;
    this.lineStarts = lineStarts;
    this.bufferIndex = bufferIndex;
    this.lfCur = lfCur;
  }
}

// 缓存片段树类型，主要用来缓存上一次查找的结果
class CatchPiece {
  piece: AvlTree<Piece>;
  lineNumber: number;
  text: string;

  constructor(piece: AvlTree<Piece>, lineNumber: number, text = '') {
    this.piece = piece;
    this.lineNumber = lineNumber;
    this.text = text;
  }
}

class PieceTable {

  private pieces: AvlTree<Piece>; // 片段表
  private buffers: string[]; // 字符串缓冲区
  // private pieces: Piece[]; // 片段表
  private bufferLength: number; // 每个buffer的最大长度
  private catch: CatchPiece;

  constructor(original: string, add?: string) {
    this.buffers = [];
    this.pieces = null;
    this.bufferLength = 65535;
  }

  insert(lineNumber: number, text: string) {
    // this.pieces.push(piece);
    // 插入比较复杂
    // this.piece.insert(new Piece(SOURCE.ADD, this.add.length, text.length));
    delete this.catch;
    if (this.buffers.length) {
      const lastBufferIndex = this.buffers.length - 1;
      const lastBufferLen = this.buffers[lastBufferIndex].length;
      if (
        lastBufferIndex === 0
        &&
        (lastBufferLen + text.length) < this.bufferLength
      ) {
        // 如果长度不超过当前buffer，则往对应的node添加
        this.buffers[lastBufferIndex] += text;
        const treeNode = this.nodeAt(lineNumber);
        this.append(treeNode, text);
      } else {
        const index = this.buffers.length;
        this.buffers.push(text);
        const piece: Piece = this.create(lineNumber, text, index);
        this.pieces = AvlTreeApi.insert(piece, this.pieces);
      }
    } else {
      const index = this.buffers.length;
      this.buffers.push(text);
      const piece: Piece = this.create(lineNumber, text, index);
      this.pieces = AvlTreeApi.insert(piece, this.pieces);
    }
  }

  delete() {

  }

  isNewline(text: string) {
    return text == "\r\n" || text == "\r" || text == "\n";
  }

  /*
    * offset: 偏移值，有些场景下，str是拼接在其他字符后面，需要用到偏移值来计算当前str的实际位置
    * 当前str的位置 = i + offset 
   */
  getLineStarts(str: string, offset = 0) {
    const lineStarts = [];
    for (let i = 0; i < str.length; i += 1) {
      if (this.isNewline(str[i])) {
        lineStarts.push(i + offset);
      }
    }
    return lineStarts;
  }

  append(treeNode: AvlTree<Piece>, value: string) {
    const lineStarts = this.getLineStarts(value, treeNode.piece.length);
    treeNode.piece.lineStarts.push(...lineStarts);
    treeNode.piece.length += value.length;
    treeNode.piece.lfCur += lineStarts.length;
  }

  // 创建
  create(lineNumber: number, addText: string, buffersIndex: number) {
    const lineStarts = this.getLineStarts(addText);
    return new Piece(
      0,
      addText.length,
      lineStarts,
      this.buffers.length - 1,
      lineStarts.length
    );
  }

  // 获取某一行的字符长度
  getLineLength(lineNumber: number): number {
    return this.getLineRawContent(lineNumber).length;
  }

  nodeAt(lineNumber: number) {
    if (
      this.catch
      && this.catch.lineNumber === lineNumber
    ) {
      return this.catch.piece;
    }
    const root = this.pieces;
    let x = this.pieces;
    while (x) {
      if (x !== root && x.lf_left > lineNumber - 1) {
        x = x.left;
      } else if (x.lf_left + x.piece.lfCur >= lineNumber - 1) {
        return x;
      } else {
        lineNumber -= x.lf_left + x.piece.lfCur;
        x = x.right;
      }
    }
    return null;
  }

  // 查找某一行的字符
  getLineRawContent(lineNumber: number): string {
    if (
      this.catch
      && this.catch.lineNumber === lineNumber
      && this.catch.text
    ) {
      return this.catch.text;
    }
    const root = this.pieces;
    let x = this.pieces;
    while (x) {
      if (x !== root && x.lf_left >= lineNumber - 1) {
        // 查找左子树
        x = x.left;
      } else if (x.lf_left + x.piece.lfCur > lineNumber - 1) {
        // 在当前节点里面
        const lineStartsIdx = lineNumber - x.lf_left;
        let buffer: string, str: string;
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有x.piece.lineStarts.length的判断
        buffer = this.buffers[x.piece.bufferIndex];
        if (x.piece.lineStarts.length) {
          const start = x.piece.lineStarts[Math.min(lineStartsIdx - 1, 0)] + 1;
          const end = x.piece.lineStarts[lineStartsIdx];
          str = buffer.substring(start, end);
        } else {
          str = buffer
        }
        this.catch = new CatchPiece(x, lineNumber, str);
        return str;
      } else if (x.lf_left + x.piece.lfCur === lineNumber - 1) {
        // 也是在当前节点里面
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有x.piece.lineStarts.length的判断
        const buffer = this.buffers[x.piece.bufferIndex];
        let str: string;
        if (x.piece.lineStarts.length) {
          // 若行号不为空，则每一行的位置 index = lineNumber - 2(数组从0开始需要-1，行数从第二行开始算也要-1)
          const currentIndex = lineNumber - 2;
          const start = x.piece.lineStarts[currentIndex];
          // 若是最后一行
          if (!x.piece.lineStarts[currentIndex + 1]) {
            str = buffer.substring(start + 1);
          } else {
            str = buffer.substring(start + 1, start + x.piece.lineStarts[currentIndex + 1]);
          }
        } else {
          str = buffer;
        }
        this.catch = new CatchPiece(x, lineNumber, str);
        return str;
        // break;
      } else {
        // 查找右子树
        lineNumber -= x.lf_left + x.piece.lfCur;
        x = x.right;
      }
    }
    return '';
  }

}

export {
  Piece,
};

export default PieceTable;