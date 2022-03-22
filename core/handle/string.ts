/**
 * A fast function (therefore imprecise) to check if code points are emojis.
 * Generated using https://github.com/alexdima/unicode-utils/blob/main/emoji-test.js
 */
export function isEmojiImprecise(x: number): boolean {
  return (
    (x >= 0x1F1E6 && x <= 0x1F1FF) || (x === 8986) || (x === 8987) || (x === 9200)
    || (x === 9203) || (x >= 9728 && x <= 10175) || (x === 11088) || (x === 11093)
    || (x >= 127744 && x <= 128591) || (x >= 128640 && x <= 128764)
    || (x >= 128992 && x <= 129008) || (x >= 129280 && x <= 129535)
    || (x >= 129648 && x <= 129782)
  );
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function isHighSurrogate(charCode: number): boolean {
  return (0xD800 <= charCode && charCode <= 0xDBFF);
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function isLowSurrogate(charCode: number): boolean {
  return (0xDC00 <= charCode && charCode <= 0xDFFF);
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function computeCodePoint(highSurrogate: number, lowSurrogate: number): number {
  return ((highSurrogate - 0xD800) << 10) + (lowSurrogate - 0xDC00) + 0x10000;
}

export function isFullWidthCharacter(charCode: number): boolean {
  // 处理宽字符，中文等，都是宽字符，统一设置为两位
  // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
  // http://jrgraphix.net/research/unicode_blocks.php
  //          2E80 - 2EFF   CJK Radicals Supplement
  //          2F00 - 2FDF   Kangxi Radicals
  //          2FF0 - 2FFF   Ideographic Description Characters
  //          3000 - 303F   CJK Symbols and Punctuation
  //          3040 - 309F   Hiragana
  //          30A0 - 30FF   Katakana
  //          3100 - 312F   Bopomofo
  //          3130 - 318F   Hangul Compatibility Jamo
  //          3190 - 319F   Kanbun
  //          31A0 - 31BF   Bopomofo Extended
  //          31F0 - 31FF   Katakana Phonetic Extensions
  //          3200 - 32FF   Enclosed CJK Letters and Months
  //          3300 - 33FF   CJK Compatibility
  //          3400 - 4DBF   CJK Unified Ideographs Extension A
  //          4DC0 - 4DFF   Yijing Hexagram Symbols
  //          4E00 - 9FFF   CJK Unified Ideographs
  //          A000 - A48F   Yi Syllables
  //          A490 - A4CF   Yi Radicals
  //          AC00 - D7AF   Hangul Syllables
  // [IGNORE] D800 - DB7F   High Surrogates
  // [IGNORE] DB80 - DBFF   High Private Use Surrogates
  // [IGNORE] DC00 - DFFF   Low Surrogates
  // [IGNORE] E000 - F8FF   Private Use Area
  //          F900 - FAFF   CJK Compatibility Ideographs
  // [IGNORE] FB00 - FB4F   Alphabetic Presentation Forms
  // [IGNORE] FB50 - FDFF   Arabic Presentation Forms-A
  // [IGNORE] FE00 - FE0F   Variation Selectors
  // [IGNORE] FE20 - FE2F   Combining Half Marks
  // [IGNORE] FE30 - FE4F   CJK Compatibility Forms
  // [IGNORE] FE50 - FE6F   Small Form Variants
  // [IGNORE] FE70 - FEFF   Arabic Presentation Forms-B
  //          FF00 - FFEF   Halfwidth and Fullwidth Forms
  //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
  //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
  // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
  // [IGNORE] FFF0 - FFFF   Specials
  return (
    (charCode >= 0x2E80 && charCode <= 0xD7AF)
    || (charCode >= 0xF900 && charCode <= 0xFAFF)
    || (charCode >= 0xFF01 && charCode <= 0xFF5E)
  );
}

/**
 * get the code point that begins at offset `offset`
 * 获取string对应的unicode
 */
export function getNextCodePoint(str: string, len: number, offset: number): number {
  const charCode = str.charCodeAt(offset);
  if (isHighSurrogate(charCode) && offset + 1 < len) {
    const nextCharCode = str.charCodeAt(offset + 1);
    if (isLowSurrogate(nextCharCode)) {
      return computeCodePoint(charCode, nextCharCode);
    }
  }
  return charCode;
}

export class GraphemeIterator {

  private _content: string; // 文本串
  private _offset: number; // 当前所在的位置

  constructor(text: string) {
    this._content = text;
    this._offset = 0;
  }

  public get offset(): number {
    return this._offset;
  }

  nextCodePoint() {
    this._offset += 1;
  }

  setOffset(offset: number) {
    this._offset = offset;
  }

  eol(): boolean {
    return this._offset >= this._content.length;
  }

};