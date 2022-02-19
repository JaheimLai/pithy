import Cursor from './input/cursor/index';
import Session from './handle/session/index';
import Mouse from './input/mouse/index';
import Render from './layer/render';

class Editor {

  Session: Session;
  Render: Render;

  constructor() {
    // 先初始化render类，render类初始化容器
    this.Render = new Render();
    this.Session = new Session();
    this.Session.Mouse = new Mouse();
    this.Session.Cursor = new Cursor();
    this.Session.Mouse.addEventList(this.Render.content);
    this.Session.Cursor.addEventList(this.Session.Mouse);
    this.Session.Cursor.mount(this.Render.content);
  }
}

const edirot = new Editor();