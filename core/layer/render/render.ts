import TextLayer from '../view/text';
import Dom from '../../lib/dom';
import { FragmentInfo } from '../fragment/info';
import Session from '../../handle/session/index';
import { Token } from '../../handle/parse/parse';
import cssRender from './cssRender';

// 渲染到页面
// 这里的流程并不保存分割的token，只需要在编译时用到
// 如果需要重新编译，可考虑做个逆向或者重新编译
class Render {

  public content: HTMLElement; // 内容容器
  public scroller: HTMLElement; // 滚动容器
  public container: HTMLElement; // 容器
  public textlayer: TextLayer; // 文本容器

  constructor() {
    // 初始化容器
    this.content = Dom.element('div');
    this.scroller = Dom.element('div');
    this.container = Dom.element('div');
    // 最外层容器
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    // 滚动容器
    this.scroller.style.width = '100%';
    this.scroller.style.height = '100%';
    // 内容容器
    this.content.style.width = '100%';
    this.content.style.height = '100%';
    this.content.style.fontSize = `${Session.config.fontSize}px`;
    this.textlayer = new TextLayer(this.content);
    this.textlayer.el.style.fontSize = `${Session.config.fontSize}px`;
    this.textlayer.el.style.whiteSpace = 'pre';
    // body -> container -> scroller -> content
    this.scroller.appendChild(this.content);
    this.container.appendChild(this.scroller);
    Dom.getBody().appendChild(this.container);
    cssRender.renderCursor();
    cssRender.renderNorm();
  }

  fragment(tokens: Token[]) {
    // token列表，整理成dom描述
    // 先写一个简单的实现
    const list = tokens.map(t => new FragmentInfo(t));
    this.renderText(list);
  }

  renderText(fragments: FragmentInfo[]) {
    // 渲染文本
    const line = this.textlayer.insertLines(Session.Cursor.location.line, fragments);
    if (Session.Cursor.location.line !== line) {
      Session.Cursor.setPosition(line, 1);
    } else {
      // 插入了文本，就要重新计算光标位置
      // 移到当前插入的文本后
      Session.Cursor.moveEnd();
    }
    Session.Cursor.move();
  }

}

export type RenderInstance = Render;

export default new Render();