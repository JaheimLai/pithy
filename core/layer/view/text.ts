import Dom from '../../lib/dom';

// 文本容器，用来做一些行操作，行渲染
class TextLayer extends Dom {

  lineHeight: number; // 行高 px

  constructor(container: HTMLElement) {
    super('div');
    super.mount(container);
    this.lineHeight = 22;
  }

  // 创建新的一行
  createdLine(content: HTMLElement): void {
    // 新起一行
    // 每行之间用绝对定位来固定（避免频繁插入、更改dom）
    const line = super.element('div');
    line.style.position = 'absolute';
    // 计算行高
    const top = super.getElement().children.length * this.lineHeight;
    line.style.top = `${top}px`;
    line.append(content);
    this.insert(line);
  }

  isNewLine(text: string): boolean {
    // 判断是否是新起一行
    return (text == "\r\n" || text == "\r" || text == "\n");
  }

  insert(dom: HTMLElement) {
    super.insert(dom);
  }

}

export default TextLayer;