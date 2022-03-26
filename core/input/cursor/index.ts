import Parse from '../../handle/parse/index';
import Mouse from '../mouse/index';
import Keyboard, { KeyCode } from '../keyboard/index';
import Session from '../../handle/session/index';
import Render from '../../layer/render/render';
import Dom from '../../lib/dom';
import { EVENT_TYPE } from '../../input/mouse/eventType';
import { CursorColumns } from './column';

interface Location { // 表示光标所在位置
  x: number;
  y: number;
  start: number;
  end: number;
  line: number; // 行
  column: number; // 列
}

const enum EventType {
  INPUT = 'input',
  COMPOSITIONSTART = 'compositionstart',
  COMPOSITIONEND = 'compositionend',
}

class Cursor extends Dom {

  isComp: boolean;
  location: Location;
  private timeStamp: number;
  private timeInterval: number;
  private charWidth: number; // 字符宽度

  constructor() {
    super('textarea');
    super.el.style.fontSize = `${Session.config.fontSize}px`;
    super.el.style.height = `${Render.textlayer.getLineHerght()}px`;
    super.el.className = 'cursor';
    this.isComp = false;
    this.timeInterval = 100; // 节流的毫秒
    this.charWidth = Session.config.fontSize * 0.5;
    this.location = {
      x: 0,
      y: 0,
      start: 0,
      end: 0,
      line: -1,
      column: 0,
    };
    this.addEventListener(EventType.INPUT, this.onInput.bind(this));
    this.addEventListener(EventType.COMPOSITIONSTART, this.onCompositionstart.bind(this));
    this.addEventListener(EventType.COMPOSITIONEND, this.onCompositionend.bind(this));
  }

  setStyle(style: any) {
    for (let key of style) {
      super.el.style[key] =  style[key];
    }
  }

  setText(text: string): void {
    Parse.insert(text);
    console.log('text  --', text);
  }

  onMouse(e: MouseEvent): void {
    // 点击鼠标左键或者点击事件，记录当前位置
    this.location.x = e.x;
    this.location.y = e.y;
    this.location.line = Math.max(Render.textlayer.getLineNumberAtVerticalOffset(e.y), 1);
    console.log(' --- ', this.calcColumn(e.x));
    this.location.column = this.calcColumn(e.x);
    this.calcLocation();
    console.log(e.x, e.y);
    setTimeout(() => {
      this.focus();
    });
  }

  calcColumn(x: number): number {
    const cl = x / (this.charWidth);
    const clCeil = Math.ceil(cl);
    if (clCeil - cl < 0.5) {
      return clCeil;
    }
    return cl;
  }

  setPosition(line: number, column: number) {
    console.log(' ----', line, column);
    this.location.line = line;
    this.location.column = column;
  }

  moveHorizontal(offset: number) {
    // 光标水平移动
    const lineText = Session.pieceTable.getLineRawContent(this.location.line - 1);
    const column = CursorColumns.visibleColumnFromColumn(lineText, this.location.column, offset);
    this.location.column += offset;
    console.log('column --', column, offset, lineText);
    super.el.style.left = `${column * (this.charWidth)}px`;
  }

  moveVertical(offset: number) {
    // 光标垂直移动
    debugger;
    const lineText = Session.pieceTable.getLineRawContent(this.location.line - 1 + offset);
    if (!lineText) {
      return;
    }
    this.location.line += offset;
    // 然后再水平移动
    this.moveHorizontal(0);
    super.el.style.top = `${Render.textlayer.getLineNumberAtLineNunber(this.location.line)}px`;
  }

  calcLocation() {
    // 计算光标高度、宽度
    let top = Render.textlayer.getLineNumberAtLineNunber(this.location.line);
    let left = CursorColumns.visibleColumnFromColumn(Session.pieceTable.getLineRawContent(this.location.line), this.location.column);
    console.log(left, this.charWidth);
    super.el.style.top = `${top}px`;
    super.el.style.left = `${left * (this.charWidth)}px`;
  }

  getLocation(): Location {
    return this.location;
  }

  focus(): void {
    this.el.focus();
  }

  onInput(e: InputEvent) {
    // 做了节流处理
    if (this.isComp) {
      // 判断是否正在使用时输入法输入
      console.log('return text ---');
      return;
    }
    if (Date.now() - this.timeStamp < this.timeInterval) {
      return;
    }
    this.timeStamp = Date.now();
    const target = e.target as HTMLTextAreaElement;
    const text = target.value;
    this.setText(text);
    target.value = '';
  }

  onCompositionstart(e: InputEvent) {
    this.isComp = true;
  }

  onCompositionend(e: InputEvent) {
    console.log('e. data', e.data);
    this.setText(e.data);
    this.isComp = false;
  }

  addEventList(mouse: Mouse) {
    // 绑定鼠标类的事件
    mouse.addEventListener(EVENT_TYPE.LEFT, this.onMouse, this);
  }

  addKeyBoard(keyboard: Keyboard) {
    keyboard.addEventListener(keyboard.getKeyStr(KeyCode.LeftArrow), this.moveHorizontal.bind(this, -1));
    keyboard.addEventListener(keyboard.getKeyStr(KeyCode.RightArrow), this.moveHorizontal.bind(this, 1));
    keyboard.addEventListener(keyboard.getKeyStr(KeyCode.UpArrow), this.moveVertical.bind(this, -1));
    keyboard.addEventListener(keyboard.getKeyStr(KeyCode.DownArrow), this.moveVertical.bind(this, 1));
  }

}

export default Cursor;