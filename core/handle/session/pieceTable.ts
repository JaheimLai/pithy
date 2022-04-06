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
  lineNumber: number; // 实际行号
  offsetLineNunber: number; // 相对于子树的偏移值行号

  constructor(piece: AvlTree<Piece>, lineNumber: number, offsetLineNunber: number) {
    this.piece = piece;
    this.lineNumber = lineNumber;
    this.offsetLineNunber = offsetLineNunber;
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

  public insert(lineNumber: number, offset: number, text: string): void {
    delete this.catch;
    const nodeInfo: CatchPiece = this.nodeAt(lineNumber); // 查找当前的node
    const treeNode: AvlTree<Piece> = nodeInfo ? nodeInfo.piece : null; // 如果不为空
    const lastBufferIndex: number = this.buffers.length - 1;
    const lastBufferText: string = this.buffers[lastBufferIndex];
    if (!treeNode || !nodeInfo) {
      const index = this.buffers.length;
      const piece: Piece = this.create(0, lineNumber, text, index);
      this.buffers.push(text);
      this.pieces = AvlTreeApi.insert(piece, this.pieces);
      return;
    }
    // 计算相对于树的偏移值
    // 上面的offset知识相对于行的偏移值
    // 这里计算的是相对于buffer来说的偏移值
    // 用来判断当前buffer长度是否等于这个偏移值
    let buffersOffsetText: string = '';
    if (treeNode.lf_left + treeNode.piece.lfCur > nodeInfo.offsetLineNunber - 1) {
      buffersOffsetText = this.getLeftPieceText(treeNode, nodeInfo.offsetLineNunber);
    } else if (treeNode.lf_left + treeNode.piece.lfCur === nodeInfo.offsetLineNunber - 1) {
      buffersOffsetText = this.getLeftPieceText(treeNode, nodeInfo.offsetLineNunber);
    }
    if (
      treeNode.piece.bufferIndex === lastBufferIndex
      &&
      (lastBufferText.length + text.length) > this.bufferLength
      &&
      buffersOffsetText.length === offset - 1
    ) {
      // 当前如果没有换行符，这个新建的子树可能会找不出来
      // 看来要以offset+line Number作为查找单位才行
      // 超过当前字符串最大长度，新建一个peice插入
      const index = this.buffers.length;
      this.buffers.push(text);
      const piece: Piece = this.create(0, lineNumber, text, index);
      this.pieces = AvlTreeApi.insert(piece, this.pieces);
      return;
    }
    if (
      treeNode.piece.bufferIndex === lastBufferIndex
      &&
      buffersOffsetText.length === offset - 1
    ) {
      // 如果长度不超过当前buffer，且插入的位置在最后，则往对应的node添加
      this.buffers[lastBufferIndex] += text;
      this.append(treeNode, text);
    } else if (buffersOffsetText.length > offset - 1) {
      // 否则认为是在当前行中间插入
      this.insertContent(text, lineNumber, offset, treeNode, nodeInfo.offsetLineNunber);
    }
  }

  // column 为cursor的column从1开始
  // offsetLineNunber 相对于树的偏移行号不是真正的行号，用来计算当前行列处于buffer的位置
  private insertContent(text: string, lineNumber: number, column: number, node: AvlTree<Piece>, offsetLineNunber: number): void {
    // 在node的中间插入文本
    // 检查text有没有换行符
    let buffer = this.buffers[node.piece.bufferIndex];
    buffer = buffer.substring(node.piece.start, node.piece.length);
    if (this.startWithLF(text)) {
      // 开头换行符
      // 需要分裂当前的node，并插入到下一行
      // 分裂的规则是：
      // column
      // piece length = 15 lineStarts = [2, 5, 9]
      // start = 7, column = 3
      // A piece
      //  - length = start + column
      //  - lineStarts = [2, 5]
      // B piece 
      //  - length= 15 -  start + column + text.length
      //  - lineStarts = [9]
      let start: number;
      let newPieceLineStarts: number[];
      const oldPeiceLength: number = node.piece.length;
      if (
        node.lf_left + node.piece.lfCur > offsetLineNunber - 1
        && node.piece.lineStarts.length
      ) {
        // 若在其中一行
        const lineStartsIdx = (offsetLineNunber - 1) - node.lf_left;
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有node.piece.lineStarts.length的判断
        // 还要裁剪linestarts
        // [1, 4, 8] -> 1: [1, 4]  2: [8]
        if (lineStartsIdx - 1 >= 0) {
          start = node.piece.lineStarts[lineStartsIdx - 1] + 1;
          newPieceLineStarts = node.piece.lineStarts.splice(lineStartsIdx - 1);
        } else {
          start = 0;
          newPieceLineStarts = node.piece.lineStarts.splice(lineStartsIdx);
        }
      } else if (
        node.lf_left + node.piece.lfCur === offsetLineNunber - 1
        && node.piece.lineStarts.length
      ) {
        // 若当前node在最后一行
        // 若行号不为空，则每一行的位置 index = lineNumber - 2(数组从0开始需要-1，行数从第二行开始算也要-1)
        const currentIndex = lineNumber - 2;
        start = node.piece.lineStarts[currentIndex];
        // 若是最后一行
        // 裁剪linestart
        // [1, 4, 8] -> 1: [1, 4]  2: [8]
        newPieceLineStarts = node.piece.lineStarts.splice(currentIndex);
        start = start + 1;
      } else {
        start = column - 1;
        newPieceLineStarts = [];
      }
      node.piece.length = start;
      node.piece.lfCur = node.piece.lineStarts.length;

      // 插入新piece
      const index = this.buffers.length;
      this.buffers.push(text);
      const pieceB: Piece = new Piece(
        0,
        text.length,
        this.getLineStarts(text),
        index,
        0,
      );
      // 用了this.getLineStarts赋值，所以上面lfCur设为了0，这里在重新赋值给lfCur
      pieceB.lfCur = pieceB.lineStarts.length;
      const pieceC: Piece = new Piece(
        start,
        oldPeiceLength - start,
        newPieceLineStarts,
        node.piece.bufferIndex,
        newPieceLineStarts.length,
      );
      this.pieces = AvlTreeApi.insert(pieceB, this.pieces);
      this.pieces = AvlTreeApi.insert(pieceC, this.pieces);
    } else if (this.endWithCR(text)) {
      // 结束的回车符
    } else {
      // 没有的话，直接改变当前piece，拼接字符
      let startText: string = '';
      let endText: string = '';
      if (
        node.lf_left + node.piece.lfCur > offsetLineNunber - 1
        && node.piece.lineStarts.length
      ) {
        // 若在其中一行
        const lineStartsIdx = (offsetLineNunber - 1) - node.lf_left;
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有node.piece.lineStarts.length的判断
        const start = lineStartsIdx - 1 >= 0 ? node.piece.lineStarts[lineStartsIdx - 1] + 1 : 0;
        const end = node.piece.lineStarts[lineStartsIdx];
        startText = buffer.substring(start, start - column);
        endText = buffer.substring(start, start - column);
      } else if (
        node.lf_left + node.piece.lfCur === offsetLineNunber - 1
        && node.piece.lineStarts.length
      ) {
        // 若当前node在最后一行
        // 若行号不为空，则每一行的位置 index = lineNumber - 2(数组从0开始需要-1，行数从第二行开始算也要-1)
        const currentIndex = lineNumber - 2;
        const start = node.piece.lineStarts[currentIndex];
        // 若是最后一行
        if (!node.piece.lineStarts[currentIndex + 1]) {
          startText = buffer.substring(0, start + 1);
          endText = buffer.substring(start + 2);
        } else {
          startText = buffer.substring(0, start + 1);
          endText = buffer.substring(start + 2, node.piece.lineStarts[currentIndex + 1]);
        }
      } else {
        startText = buffer.substring(0, column - 1);
        endText = buffer.substring(column - 1);
      }
      // 还是要拼接字符- -
      // 这里要优化一下，优化成只读buffer才行
      const newText = startText + text + endText;
      node.piece.length = newText.length;
      this.buffers[node.piece.bufferIndex] = newText;
    }
  }

  private startWithLF(val: string): boolean {
    return val.charCodeAt(0) === 10;
  }

  private endWithCR(val: string): boolean {
    return val.charCodeAt(val.length - 1) === 13;
  }

  private delete() {

  }

  public isNewline(text: string): boolean {
    return text == "\r\n" || text == "\r" || text == "\n";
  }

  /*
    * offset: 偏移值，有些场景下，str是拼接在其他字符后面，需要用到偏移值来计算当前str的实际位置
    * 当前str的位置 = i + offset 
   */
  private getLineStarts(str: string, offset = 0): number[] {
    const lineStarts = [];
    for (let i = 0; i < str.length; i += 1) {
      if (this.isNewline(str[i])) {
        lineStarts.push(i + offset);
      }
    }
    return lineStarts;
  }

  private append(treeNode: AvlTree<Piece>, value: string): void {
    const lineStarts = this.getLineStarts(value, treeNode.piece.length);
    treeNode.piece.lineStarts.push(...lineStarts);
    treeNode.piece.length += value.length;
    treeNode.piece.lfCur += lineStarts.length;
  }

  // 创建
  private create(start: number, lineNumber: number, addText: string, buffersIndex: number): Piece {
    const lineStarts = this.getLineStarts(addText);
    return new Piece(
      start,
      addText.length,
      lineStarts,
      buffersIndex,
      lineStarts.length
    );
  }

  // 获取对应的node
  private nodeAt(sourceLineNumber: number): CatchPiece {
    if (
      this.catch
      && this.catch.lineNumber === sourceLineNumber - 1
    ) {
      return this.catch;
    }
    const root = this.pieces;
    let lineNumber: number = sourceLineNumber;
    let x = this.pieces;
    while (x) {
      if (x !== root && x.lf_left > lineNumber - 1) {
        x = x.left;
      } else if (x.lf_left + x.piece.lfCur >= lineNumber - 1) {
        this.catch =  new CatchPiece(x, sourceLineNumber, lineNumber);
        return this.catch;
      } else {
        lineNumber -= x.lf_left + x.piece.lfCur;
        x = x.right;
      }
    }
    return null;
  }

  private getLeftPieceText(x: AvlTree<Piece>, lineNumber: number) {
    const lineStartsIdx = (lineNumber - 1) - x.lf_left;
    let buffer: string, str: string;
    // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
    // 所以才有x.piece.lineStarts.length的判断
    buffer = this.buffers[x.piece.bufferIndex];
    buffer = buffer.substring(x.piece.start, x.piece.length);
    if (x.piece.lineStarts.length) {
      const start = lineStartsIdx - 1 >= 0 ? x.piece.lineStarts[lineStartsIdx - 1] + 1 : 0;
      const end = x.piece.lineStarts[lineStartsIdx];
      str = buffer.substring(start, end);
    } else {
      str = buffer;
    }
    return str;
  }

  private getPieceText(x: AvlTree<Piece>, lineNumber: number): string {
    // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
    // 所以才有x.piece.lineStarts.length的判断
    // 获取片段里面对应行号的字符
    let buffer = this.buffers[x.piece.bufferIndex];
    buffer = buffer.substring(x.piece.start, x.piece.length);
    let str: string;
    if (x.piece.lineStarts.length) {
      // 若行号不为空，则每一行的位置 index = lineNumber - 2(数组从0开始需要-1，行数从第二行开始算也要-1)
      const currentIndex = lineNumber - 2;
      const start = x.piece.lineStarts[currentIndex];
      // 若是最后一行
      if (!x.piece.lineStarts[currentIndex + 1]) {
        str = buffer.substring(start + 1);
      } else {
        str = buffer.substring(start + 1, x.piece.lineStarts[currentIndex + 1]);
      }
    } else {
      str = buffer;
    }
    return str;
  }

    // 获取某一行的字符长度
  public getLineLength(lineNumber: number): number {
    return this.getLineRawContent(lineNumber).length;
  }

  // 查找某一行的字符
  public getLineRawContent(sourceLineNumber: number): string {
    if (
      this.catch
      && this.catch.lineNumber === sourceLineNumber - 1
    ) {
      return this.getPieceText(this.catch.piece, this.catch.offsetLineNunber);
    }
    const root = this.pieces;
    let lineNumber: number = sourceLineNumber;
    let x = this.pieces;
    while (x) {
      if (x !== root && x.lf_left >= lineNumber - 1) {
        // 查找左子树
        x = x.left;
      } else if (x.lf_left + x.piece.lfCur > lineNumber - 1) {
        // 在当前节点里面
        const str: string = this.getLeftPieceText(x, lineNumber);
        this.catch = new CatchPiece(x, sourceLineNumber - 1, lineNumber);
        return str;
      } else if (x.lf_left + x.piece.lfCur === lineNumber - 1) {
        // 也是在当前节点里面
        // 目前来说，没有其他偏移值，会出现lineStarts为空而又没其他偏移值定位的问题，后面会修复
        // 所以才有x.piece.lineStarts.length的判断
        const str: string = this.getPieceText(x, lineNumber);
        this.catch = new CatchPiece(x, sourceLineNumber - 1, lineNumber);
        return str;
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