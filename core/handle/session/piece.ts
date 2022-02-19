class Piece {
  start: number; // 在buff的起始位置（偏移值）
  length: number; // 片段的长度
  source: string; // 原buff，original or add

  constructor(source: string, start: number, length: number) {
    this.source = source;
    this.start = start;
    this.length = length;
  }
}

export default Piece;
