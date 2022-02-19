import Session from '../../handle/session/index';
import Parse from '../../handle/parse/index';
import Mouse from '../../input/mouse/index';
import Dom from '../../lib/dom';

interface Location { // 表示光标所在位置
  x: number;
  y: number;
  start: number;
  end: number;
  line: number;
}

const enum EventType {
  INPUT = 'input',
  COMPOSITIONSTART = 'compositionstart',
  COMPOSITIONEND = 'compositionend',
}

class Cursor extends Dom {

  isComp: boolean;
  location: Location;
  private timerId: number;

  constructor() {
    super('textarea');
    const { style } = super.getElement();
    style.width = '1px';
    style.resize = 'none';
    style.border = 'none';
    style.outline = 'none';
    style.position = 'absolute';
    style.fontWeight = 'normal';
    style.fontSize = '16px';
    style.letterSpacing = '0px';
    style.minWidth = '0';
    style.minHeight = '0';
    style.margin = '0';
    style.padding = '0';
    style.overflow = 'hidden';
    style.color = 'transparent';
    style.backgroundColor = 'transparent';
    this.isComp = false;
    this.location = {
      x: 0,
      y: 0,
      start: 0,
      end: 0,
      line: -1,
    };
    this.addEventListener(EventType.INPUT, this.onInput.bind(this));
    this.addEventListener(EventType.COMPOSITIONSTART, this.onCompositionstart.bind(this));
    this.addEventListener(EventType.COMPOSITIONEND, this.onCompositionend.bind(this));
  }

  setText(text: string): void {
    // 做了节流处理
    if (this.isComp) {
      // 判断是否正在使用时输入法输入
      console.log('return text ---', text);
      return;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      Parse.insert(text);
      console.log('text setTimeout --', text);
    }, 100);
    console.log('text  --', text);
  }

  onMouse(e): void {
    console.log('e --', e);
    setTimeout(() => {
      this.focus();
    });
  }

  focus(): void {
    this.getElement().focus();
  }

  setLocation(x, y, start, end): void {
    this.location.x = x;
    this.location.y = y;
    this.location.start = start;
    this.location.end = end;
    this.setPosition(y, null, null, x);
    // this.cursor.$el.style.top = `${top}px`;
    // this.cursor.$el.style.left = `${left}px`;
  }

  onInput(e: InputEvent) {
    const text = e.target.value;
    this.setText(text);
    e.target.value = '';
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
    mouse.addEventListener(el.eventLeftType, this.onMouse.bind(this));
  }

}

export default Cursor;