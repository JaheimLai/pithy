import Session from '../../handle/session/index';
import TextLayer from '../view/text';
import Dom from '../../lib/dom';
import Fragment from './fragment';

// 渲染到页面
// 这里的流程并不保存分割的token，只需要在编译时用到
// 如果需要重新编译，可考虑做个逆向或者重新编译
class Render {

  content: HTMLElement; // 内容容器
  scroller: HTMLElement; // 滚动容器
  container: HTMLElement; // 容器
  textlayer: TextLayer; // 文本容器

  constructor() {
    // 初始化容器
    this.content = Dom.element('div');
    this.scroller = Dom.element('div');
    this.container = Dom.element('div');
    this.textlayer = new TextLayer(this.content);
    // body -> container -> scroller -> content
    this.scroller.appendChild(this.content);
    this.container.appendChild(this.scroller);
    Dom.getBody().appendChild(this.container);
  }

  renderText(fragments: Fragment) {
    // 渲染文本
    // 需要跟textlayer配合之类的
  }

}

export default Render;