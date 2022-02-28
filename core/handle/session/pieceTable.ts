import AvlTreeApi, { AvlTree } from './avlTree/tree';

enum SOURCE {
  ADD = 'add',
  ORG = 'original',
}

interface Piece {
  start: number; // 在buffer的起始位置（偏移值）
  length: number; // 片段的长度
  bufferIndex: number; // 在add buffer的那个位置（数组下标）
}

class PieceTable {

  buffers: string[]; // 字符串缓冲区
  piece: AvlTree<Piece>; // 片段表
  bufferLength: number; // 每个buffer的最大长度

  constructor(original: string, add?: string) {
    if (original.length > 1000) {
      for (let i = 1000; i < original.length; i += 1000) {
        const textBuffer = original.substring(i - 1000, 1000);
        this.buffers.push(textBuffer);
        AvlTreeApi.insertBySet(this.create(i - 1000, textBuffer.length, this.buffers.length), this.piece);
      }
    } else {
      this.buffers.push(original);
      this.piece = AvlTreeApi.insert(this.create(0, original.length, this.buffers.length));
    }
  }

  create(start: number, length: number, bufferIndex: number): Piece {
    return {
      start,
      length,
      bufferIndex,
    }
  }

  insert(text: string) {
    // 插入比较复杂
    // this.piece.insert(new Piece(SOURCE.ADD, this.add.length, text.length));
  }

  delete() {

  }

}

export default PieceTable;