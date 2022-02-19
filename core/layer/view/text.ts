import Dom from '../../lib/dom';

// 文本容器，用来做一些行操作，行渲染
class TextLayer extends Dom {

  constructor(container: HTMLElement) {
    super('div');
    super.mount(container);
  }

  newLine() {
    // 新起一行
  }

  render(line) {
    // 渲染文本
  }

}

export default TextLayer;