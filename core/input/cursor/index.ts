import Parse from '../../handle/parse/index';
import Mouse from '../mouse/index';
import Keyboard, { KeyCode } from '../keyboard/index';
import Session from '../../handle/session/index';
import Render from '../../layer/render/render';
import Dom from '../../lib/dom';
import { EVENT_TYPE } from '../../input/mouse/eventType';
import { CursorColumns } from '../../handle/column';

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

  public location: Location;
  private isComp: boolean;
  private timeStamp: number;
  private timeInterval: number;
  private charWidth: number; // 字符宽度

  constructor() {
    super('textarea');
    super.el.style.fontSize = `${Session.config.fontSize}px`;
    super.el.style.height = `${Render.textlayer.getLineHerght()}px`;
    super.el.className = 'cursor';
    super.el.style.left = `${Render.textlayer.markerWidth}px`;
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
    this.location.start = this.location.column;
    if (this.location.start > 0) {
      this.location.end = text.length;
    } else {
      this.location.end = text.length + 1;
    }
    Parse.insert(text);
    console.log('text  --', text);
  }

  onMouse(e: MouseEvent): void {
    // 点击鼠标左键或者点击事件，记录当前位置
    this.location.x = e.x - Render.textlayer.markerWidth;
    this.location.y = e.y;
    this.location.line = Math.max(Render.textlayer.getLineNumberAtVerticalOffset(e.y), 1);
    // 计算对应行的位置
    const top = Render.textlayer.getLineNumberAtLineNunber(this.location.line);
    // 相对x的位置
    // 并进行计算，如果x大于最大列，则为最大列
    // 如果当前行为空行，则为0
    let columnX = this.calcColumn(this.location.x);
    const textContent = Session.pieceTable.getLineRawContent(this.location.line);
    const maxColum = CursorColumns.getMaxColumn(textContent);
    let vColumn = 0, column = 0;
    if (columnX > maxColum) {
      columnX = maxColum;
    }
    if (textContent.length) {
      vColumn = CursorColumns.columnFromVisibleColumn(textContent, columnX);
      column = CursorColumns.visibleColumnFromColumn(textContent, vColumn);
    }
    this.location.column = vColumn;;
    super.el.style.top = `${top}px`;
    super.el.style.left = `${column * this.charWidth + Render.textlayer.markerWidth}px`;
    Render.textlayer.currentLineHighlight(this.location.line);
    setTimeout(() => {
      this.focus();
    });
  }

  calcColumn(x: number): number {
    return Math.round(x / this.charWidth);
  }

  setPosition(line: number, column: number) {
    console.log(' ----', line, column);
    this.location.line = line;
    this.location.column = column;
  }

  moveHorizontal(offset: number) {
    // 光标水平移动
    const lineText = Session.pieceTable.getLineRawContent(this.location.line);
    const maxColum = CursorColumns.getMaxColumn(lineText);
    let nextColumn = this.location.column + offset;
    if (nextColumn > maxColum) {
      // 移动到该字符后
      nextColumn = maxColum + 1;
    }
    if (nextColumn < 0) {
      // 移动到该字符前
      nextColumn = 1;
    }
    let column = CursorColumns.visibleColumnFromColumn(lineText, nextColumn);
    this.location.column = nextColumn;
    console.log('column --', column, offset, lineText);
    super.el.style.left = `${column * this.charWidth + Render.textlayer.markerWidth}px`;
  }

  moveEnd() {
    this.moveHorizontal(this.location.end);
  }

  // 光标移动到新位置
  move() {
    // 该方法默认location的位置是合法的
    const lineText = Session.pieceTable.getLineRawContent(this.location.line);
    const top = Render.textlayer.getLineNumberAtLineNunber(this.location.line);
    let column = CursorColumns.visibleColumnFromColumn(lineText, this.location.column);
    super.el.style.top = `${top}px`;
    super.el.style.left = `${column * this.charWidth + Render.textlayer.markerWidth}px`;
    Render.textlayer.currentLineHighlight(this.location.line);
  }

  moveVertical(offset: number) {
    // 光标垂直移动
    const line = Render.textlayer.getLineNumberAtOffset(this.location.line + offset);
    if (line === this.location.line) {
      return;
    }
    this.location.line = line;
    // 然后再水平移动
    this.moveHorizontal(0);
    const top = Render.textlayer.getLineNumberAtLineNunber(this.location.line);
    super.el.style.top = `${top}px`;
    Render.textlayer.currentLineHighlight(this.location.line);
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
    this.isComp = false;
    const target = e.target as HTMLTextAreaElement;
    this.setText(e.data);
    target.value = '';
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