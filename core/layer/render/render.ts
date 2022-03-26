import TextLayer from '../view/text';
import Dom from '../../lib/dom';
import { FragmentInfo, IDENTIFIER } from '../fragment/info';
import Session from '../../handle/session/index';
import { Token } from '../../handle/parse/parse';
import cssRender from './cssRender';

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
    const doms: HTMLElement[][] = [];
    let domsIdx = 0;
    let addLineNumber = 0;
    for(let i = 0; i < fragments.length; i += 1) {
      const fragment = fragments[i];
      if (fragment.identifier === IDENTIFIER.CONTROL) {
        domsIdx = doms.push([]) - 1;
        if (this.textlayer.isNewLine(fragment.innerText)) {
          addLineNumber += 1;
        }
        continue;
      }
      const dom = Dom.element(fragment.tag);
      dom.innerText = fragment.innerText;
      if (!doms[domsIdx]) {
        doms[domsIdx] = [];
      }
      doms[domsIdx].push(dom);
    }
    Session.Cursor.location.line += addLineNumber;
    const line = this.textlayer.insertLines(Session.Cursor.location.line, doms);
    if (addLineNumber) {
      Session.Cursor.setPosition(line, 0);
    } else {
      // 插入了文本，就要重新计算光标位置
      Session.Cursor.setPosition(line, Session.pieceTable.getLineLength(line));
    }
    Session.Cursor.calcLocation();
  }

}

export type RenderInstance = Render;

export default new Render();