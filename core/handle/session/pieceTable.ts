import LinkedList from './LinkedList/list';
import Piece from './piece';

enum SOURCE {
  ADD = 'add',
  ORG = 'original',
}

class PieceTable {

  original: string; // 源字符串，初始化的文本
  add: string; // 添加字符串，也就是后面添加的除源字符串以外的文本

  piece: LinkedList<Piece>; // 打算用链表实现，但不是最好的，最好是用树来实现

  constructor(original: string, add?: string) {
    this.original = original;
    this.add = '';
    this.piece = new LinkedList<Piece>();
  }

  insert(text: string) {
    this.add += text;
    // 插入比较复杂
    // this.piece.insert(new Piece(SOURCE.ADD, this.add.length, text.length));
  }

  delete() {

  }

}