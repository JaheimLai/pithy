import Dom from '../../lib/dom';
import { FragmentInfo } from '../fragment/info';
import { TOKEN } from '../../handle/parse/parse';
import { Tag, TagName } from '../render/tag';

// 文本容器，用来做一些行操作，行渲染
class TextLayer extends Dom {

  private lineHeight: number; // 行高 px
  private lines: number[]; // 保存每一行对于children下标的映射

  constructor(container: HTMLElement) {
    super('div');
    // 不同操作系统上的等宽字体
    // GNU/Linux，Solaris
    //   Luxi Mono
    //   GNU Unifont
    // macOS
    //   Monaco
    // Windows
    //   Fixedsys
    //   Consolas
    super.el.style.fontFamily = 'simsong';
    super.mount(container);
    this.lines = [];
    this.lineHeight = 22;
  }

  getLineNumberAtOffset(lineNumber: number, offset = 0) {
    let num = lineNumber + offset;
    if (num > this.lines.length) {
      return this.lines.length;
    }
    if (num < 0) {
      return 0;
    }
    return num;
  }

  /**
   * 根据top偏移值获取行号
   * @params offset -> element.offsetTop
   */
  getLineNumberAtVerticalOffset(offset: number): number {
    const line: number = Math.round(offset / this.lineHeight);
    return line > this.lines.length ? this.lines.length : line;
  }

  // 获取偏移值高度
  getLineNumberAtLineNunber(lineNumber: number): number {
    if (lineNumber - 1 > this.lines.length) {
      return this.lines.length * this.lineHeight;
    }
    return (lineNumber - 1) * this.lineHeight;
  }

  getLineWidth(lineNumber: number): number {
    if (!this.lines.length) {
      return 0;
    }
    const idx = lineNumber ? this.lines[lineNumber - 1] : 0;
    const drl: DOMRectList = super.el.children[idx].getClientRects();
    if (drl.length) {
      return drl[0].width;
    }
    return 0;
  }

  // 获取行高
  getLineHerght(): number {
    // const idx = lineNumber ? this.lines[lineNumber] : 0;
    // const drl: DOMRectList = super.el.children[idx].getClientRects();
    // return drl.item(0).height;
    return this.lineHeight;
  }

  getTotalLine(): number {
    return super.el.children.length;
  }

  /**
   * 创建新的一行
   * @params line 在哪一行后插入
   */
  createdLine(lineNumber: number, content?: HTMLElement[] | HTMLElement): HTMLElement {
    // 新起一行
    // 每行之间用绝对定位来固定（避免频繁插入、更改dom）
    const newLineDom: HTMLElement = super.element('div');
    // 插入某一行后，后面的下表都要跟着换，例如
    // lineNumber = 2
    // [0, 1, 2, 3, 4] -> [0, 1, oldChildIdx, newChildIdx, 4]
    // [0, 1, 5, 2, 3, 4]
    const oldChildIdx: number = this.lines[lineNumber];
    const newChildIdx: number = super.el.children.length;
    // 计算行高
    const top: number = lineNumber * this.lineHeight;
    // 存下标
    this.lines[lineNumber] = newChildIdx;
    // 中间插入的时候，所有后面的行号都要改变
    for(let i = lineNumber + 1; i < this.lines.length; i += 1) {
      this.lines[i] = oldChildIdx + i;
      const childrenIdx: number = this.lines[i];
      const dom = super.el.children[childrenIdx] as HTMLDivElement;
      dom.style.top = `${i * this.lineHeight}`;
    }
    newLineDom.style.top = `${top}px`;
    newLineDom.style.position = 'absolute';
    newLineDom.style.height = `${this.lineHeight}px`;
    if (content) {
      if (Array.isArray(content)) {
        content.forEach(i => { newLineDom.append(i); });
      } else {
        newLineDom.append(content);
      }
    }
    this.insert(newLineDom);
    return newLineDom;
  }

  getLine(line: number): HTMLElement {
    // 获取指定行
    const idx: number = this.lines[line];
    if (super.el.children[idx]) {
      return super.el.children[idx] as HTMLElement;
    }
    return null;
  }

  isNewLine(text: string): boolean {
    // 判断是否是新起一行
    return (text == "\r\n" || text == "\r" || text == "\n");
  }

  /**
   * 替换某一行
   * @params line 在哪一行替换
   */
  replace(replaceDom: HTMLElement[] | HTMLElement, line: number) {
    const childrenIdx: number = this.lines[line];
    if (childrenIdx >= 0) {
      const dom = super.el.children[childrenIdx] as HTMLDivElement;
      dom.innerHTML = '';
      if (Array.isArray(replaceDom)) {
        replaceDom.forEach(i => { dom.append(i); });
      } else {
        dom.append(replaceDom);
      }
    } else {
      throw new Error('line outside the law');
    }
  }

  /**
   * 在某一行后插入，插入后，并返回当前行
   * @params startLineNumber 在哪一行开始
   * @params content [HTMLElement[], HTMLElement[]] 的二维数组
   * @return 在哪一行插入结束
   */
  insertLines(startLineNumber: number, fragments: FragmentInfo[]): number {
    let line: number = startLineNumber - 1;
    let currentLineDom: HTMLElement;
    let currentLine: number;
    console.log('line --', line);
    for(let i = 0; i < fragments.length; i += 1) {
      currentLineDom = this.getLine(line);
      const fragment = fragments[i];
      if (!currentLineDom) {
        // 如果当前行为空
        currentLineDom = this.createdLine(line);
        if (line > 0) {
          line += 1;
        }
      }
      if (
        fragment.token.type === TOKEN.controlStr
        &&
        fragment.tag === TagName.LineFeed
      ) {
        // 如果是控制字符，判断是否是换行
        line += 1;
        currentLineDom = this.createdLine(line);
      } else {
        if (currentLine !== line) {
          currentLineDom.innerHTML = '';
          currentLine = line;
        }
        const tag = Tag.getTagName(fragment);
        if (tag) {
          currentLineDom.insertAdjacentHTML('beforeend', tag);
        } else {
          currentLineDom.insertAdjacentText('beforeend', fragment.innerText);
        }
      }
    }
    return line + 1;
  }

}

export default TextLayer;