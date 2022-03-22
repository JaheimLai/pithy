import * as strings from '../../handle/string';

export class CursorColumns {

  private static _nextVisibleColumn(codePoint: number, visibleColumn: number): number {
    // unicode tab === 9
    // if (codePoint === 9) {
    //   return CursorColumns.nextRenderTabStop(visibleColumn, tabSize);
    // }
    if (strings.isFullWidthCharacter(codePoint) || strings.isEmojiImprecise(codePoint)) {
      return visibleColumn + 2;
    }
    return visibleColumn + 1;
  }

  /**
   * 返回当前行的列术
   * @params lineContent 当前行的文本
   * @params column y轴值对应的位置 column = y / 字符宽度（最小）
   */
  public static visibleColumnFromColumn(lineContent: string, column: number): number {
    const textLen = Math.min(column, lineContent.length);
    const text = lineContent.substring(0, textLen);
    const iterator = new strings.GraphemeIterator(text);

    let result = 0;
    while (!iterator.eol()) {
      const codePoint = strings.getNextCodePoint(text, textLen, iterator.offset);
      iterator.nextCodePoint();
      result = this._nextVisibleColumn(codePoint, result);
    }

    return result;
  }

}