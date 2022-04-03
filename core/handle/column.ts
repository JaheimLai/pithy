import * as strings from './string';
import { CharCode } from './charCode';

export class CursorColumns {

  private static nextVisibleColumn(codePoint: number, visibleColumn: number, tabSize = 4): number {
    if (codePoint === CharCode.Tab) {
      return CursorColumns.nextRenderTabStop(visibleColumn, tabSize);
    }
    if (strings.isFullWidthCharacter(codePoint) || strings.isEmojiImprecise(codePoint)) {
      return visibleColumn + 2;
    }
    return visibleColumn + 1;
  }

  /**
   * 把一个cursor计算的column转为对应的文本的column
   * a 啊
   * visibleColumn = 3
   * return column = 2
   * @see {@link CursorColumns}
   */
  public static columnFromVisibleColumn(lineContent: string, visibleColumn: number, tabSize = 4): number {
    if (visibleColumn <= 0) {
      return 1;
    }
    const textLen = Math.min(visibleColumn, lineContent.length);
    const text = lineContent.substring(0, textLen);
    const iterator = new strings.GraphemeIterator(text);

    let prevVisibleColumn = 0, prevColumn = 1;
    while (!iterator.eol()) {
      const codePoint = strings.getNextCodePoint(text, textLen, iterator.offset);
      iterator.nextCodePoint();
      const nextVisibleColumn = this.nextVisibleColumn(codePoint, prevVisibleColumn);
      const afterColumn = iterator.offset + 1;

      if (nextVisibleColumn >= visibleColumn) {
        const prve = visibleColumn - prevVisibleColumn;
        const next = nextVisibleColumn - visibleColumn;
        if (next < prve) {
          return afterColumn;
        } else {
          return prevColumn;
        }
      }

      prevVisibleColumn = nextVisibleColumn;
      prevColumn = afterColumn;
    }

    return prevColumn + 1;

  }

  /**
   * 返回当前第column个字符的字符宽度
   * @params lineContent 当前行的文本
   * @params column 当前column
   */
  public static visibleColumnFromColumn(lineContent: string, column: number): number {
    const textLen = Math.min(column - 1, lineContent.length);
    const text = lineContent.substring(0, textLen);
    const iterator = new strings.GraphemeIterator(text);

    let result = 0;
    while (!iterator.eol()) {
      const codePoint = strings.getNextCodePoint(text, textLen, iterator.offset);
      iterator.nextCodePoint();
      result = this.nextVisibleColumn(codePoint, result);
    }

    return result;
  }

  /**
   * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
   * @see {@link CursorColumns}
   */
  public static nextRenderTabStop(visibleColumn: number, tabSize: number): number {
    return visibleColumn + tabSize - visibleColumn % tabSize;
  }

  public static getMaxColumn(lineContent: string): number {
    const iterator = new strings.GraphemeIterator(lineContent);

    let result = 0;
    while (!iterator.eol()) {
      const codePoint = strings.getNextCodePoint(lineContent, lineContent.length, iterator.offset);
      iterator.nextCodePoint();
      result = this.nextVisibleColumn(codePoint, result);
    }

    return result;
  }

}