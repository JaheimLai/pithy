import Event from '../../handle/event/index';

export const enum KeyCode {
  LeftArrow = 0x25,
  UpArrow = 0x26,
  RightArrow = 0x27,
  DownArrow = 0x28,
  Tab = 0x09, // tab
  Space = 0x20,
}

// 监听键盘事件
class Keyboard extends Event {

  keyToString: string[];
  downKeyCode: { [index: number]: KeyCode };

  constructor(el: HTMLElement) {
    super();
    this.keyToString = [];
    this.downKeyCode = {};
    el.addEventListener('keydown', this.onKeydown.bind(this));
    el.addEventListener('keyup', this.onKeyUp.bind(this));
    type MappingEntry = [KeyCode, string];
    const keyMap: MappingEntry[] = [
      [KeyCode.LeftArrow, 'LeftArrow'],
      [KeyCode.UpArrow, 'UpArrow'],
      [KeyCode.RightArrow, 'RightArrow'],
      [KeyCode.DownArrow, 'DownArrow'],
    ];
    for (let i = 0; i < keyMap.length; i += 1) {
      this.define(keyMap[i][0], keyMap[i][1]);
    }
  }

  define(keycode: KeyCode, str: string) {
    this.keyToString[keycode] = str;
  }

  getKeyStr(keycode: KeyCode): string {
    return this.keyToString[keycode];
  }

  onKeydown(event: KeyboardEvent) {
    // 是否在使用输入法
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    const codeStr: string = this.getKeyStr(event.keyCode);
    if (codeStr) {    
      this.downKeyCode[event.keyCode] = event.keyCode;
      super.dispatch(codeStr, event);
    }
    console.log(event.keyCode, event);
  }

  onKeyUp(event: KeyboardEvent) {
    // 是否在使用输入法
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (this.downKeyCode[event.keyCode]) {
      delete this.downKeyCode[event.keyCode];
      super.dispatch('keydown', event, this.downKeyCode[event.keyCode], this.getKeyStr(event.keyCode));
    }
    console.log(event.keyCode, event);
  }

}

export default Keyboard;
