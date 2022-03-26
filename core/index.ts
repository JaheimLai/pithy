import Cursor from './input/cursor/index';
import Session from './handle/session/index';
import type { SessionInstance } from './handle/session/index';
import Mouse from './input/mouse/index';
import Keyboard from './input/keyboard/index';
import type { RenderInstance } from './layer/render/render';
import Render from './layer/render/render';

class Editor {

  Session: SessionInstance;
  Render: RenderInstance;

  constructor() {
    // 先初始化render类，render类初始化容器
    this.Render = Render;
    this.Session = Session;
    this.Session.Mouse = new Mouse();
    this.Session.Cursor = new Cursor();
    this.Session.Keyboard = new Keyboard(this.Render.content);
    this.Session.Mouse.addEventList(this.Render.content);
    this.Session.Cursor.addEventList(this.Session.Mouse);
    this.Session.Cursor.addKeyBoard(this.Session.Keyboard);
    this.Session.Cursor.mount(this.Render.content);
  }
}

const edirot = new Editor();