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

class PieceTable {

  private buffers: string[]; // 字符串缓冲区
  pieces: AvlTree<Piece>; // 片段表
  // private pieces: Piece[]; // 片段表
  private bufferLength: number; // 每个buffer的最大长度

  constructor(original: string, add?: string) {
    this.buffers = [];
    this.pieces = null;
    this.bufferLength = 65535;
    // if (original.length > 1000) {
    //   for (let i = 1000; i < original.length; i += 1000) {
    //     const textBuffer = original.substring(i - 1000, 1000);
    //     this.buffers.push(textBuffer);
    //     AvlTreeApi.insertBySet(this.create(i - 1000, textBuffer.length, this.buffers.length), this.piece);
    //   }
    // } else {
    //   this.buffers.push(original);
    //   this.piece = AvlTreeApi.insert(this.create(0, original.length, this.buffers.length));
    // }
  }

  insert(linenumber: number, text: string) {
    // this.pieces.push(piece);
    // 插入比较复杂
    // this.piece.insert(new Piece(SOURCE.ADD, this.add.length, text.length));
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
        const treeNode = this.nodeAt(linenumber);
        this.append(treeNode, text);
      } else {
        const index = this.buffers.length;
        this.buffers.push(text);
        const piece: Piece = this.create(linenumber, text, index);
        this.pieces = AvlTreeApi.insert(piece, this.pieces);
      }
    } else {
      const index = this.buffers.length;
      this.buffers.push(text);
      const piece: Piece = this.create(linenumber, text, index);
      this.pieces = AvlTreeApi.insert(piece, this.pieces);
    }
  }

  delete() {

  }

  isNewline(text: string) {
    return text == "\r\n" || text == "\r" || text == "\n";
  }

  getLineStarts(str: string) {
    const lineStarts = [];
    for (let i = 0; i < str.length; i += 1) {
      if (this.isNewline(str[i])) {
        lineStarts.push(i);
      }
    }
    return lineStarts;
  }

  append(treeNode: AvlTree<Piece>, value: string) {
    const lineStarts = this.getLineStarts(value);
    treeNode.piece.lineStarts.concat(lineStarts);
    treeNode.piece.length += value.length;
    treeNode.piece.lfCur += lineStarts.length;
  }

  // 创建
  create(linenumber: number, addText: string, buffersIndex: number) {
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
    const root = this.pieces;
    let x = this.pieces;
    while (x) {
      if (x !== root && x.lf_left >= lineNumber - 1) {
        x = x.left;
      } else if (x.lf_left + x.piece.lfCur > lineNumber - 1) {
        // 在当前节点里面
        const lineStartsIdx = lineNumber - x.lf_left;
        let buffer;
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有x.piece.lineStarts.length的判断
        buffer = this.buffers[x.piece.bufferIndex];
        if (x.piece.lineStarts.length) {
          const start = x.piece.lineStarts[Math.min(lineStartsIdx - 1, 0)] + 1;
          const end = x.piece.lineStarts[lineStartsIdx];
          return buffer.substring(start, end);
        }
        return buffer;
      } else if (x.lf_left + x.piece.lfCur === lineNumber - 1) {
        // 也是在当前节点里面
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有x.piece.lineStarts.length的判断
        const buffer = this.buffers[x.piece.bufferIndex];
        if (x.piece.lineStarts.length) {
          const start = x.piece.lineStarts.length - 2;
          const end = x.piece.lineStarts.length - 1;
          return buffer.substring(start, end);
        }
        return buffer;
        // break;
      } else {
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