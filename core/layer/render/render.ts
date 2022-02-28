import TextLayer from '../view/text';
import Dom from '../../lib/dom';
import FragmentInfo from '../fragment/info';
import Session from '../../handle/session/index';
import Token from '../../handle/parse/token';

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

  fragment(tokens: Token[]) {
    // token列表，整理成dom描述
    // 先写一个简单的实现
    const list = tokens.map(t => new FragmentInfo(t));
    this.renderText(list);
  }

  renderText(fragments: FragmentInfo[]) {
    // 渲染文本
    // 需要跟textlayer配合之类的
    // for(let i = 0; i < fragments.length; i += 1) {
    //   const fragment = fragments[i];
    //   const dom = Dom.element(fragment.tag);
    // }
    // this.textlayer.insert();
  }

}

export type RenderInstance = Render;

export default new Render();