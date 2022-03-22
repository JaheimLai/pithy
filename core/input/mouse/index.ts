import Event from '../../handle/event/index';
import { EVENT_TYPE, MOUSE_DOWN_TYPE } from './eventType';

class Mouse extends Event {

  which: number; // 当前按下哪个鼠标键，对应mouseDownType值
  pressed: boolean; // 是否在按住鼠标键没有松开的状态

  constructor() {
    super();
    this.pressed = false;
  }

  onMouseEvent(): void {
    // ...
  }

  onMouseDown(e: MouseEvent): void {
    this.pressed = true;
    this.which = e.which;
    switch(e.which) {
      case MOUSE_DOWN_TYPE.LEFT:
        this.dispatch(EVENT_TYPE.LEFT, e);
        break;
      case MOUSE_DOWN_TYPE.RIGHT:
        this.dispatch(EVENT_TYPE.RIGHT, e);
      case MOUSE_DOWN_TYPE.MIDDLE:
        this.dispatch(EVENT_TYPE.MIDDLE, e);
        break;
      default:
        this.dispatch(EVENT_TYPE.CLICK, e);
        break;
    }
  }

  onMouseMove(e: MouseEvent) {

  }

  onMouseUp(e: MouseEvent) {
    this.pressed = false;
  }

  addEventList(contentLayer: HTMLElement) {
    // 绑定容器的鼠标事件
    if (contentLayer) {
      contentLayer.addEventListener('mousedown', this.onMouseDown.bind(this));
      contentLayer.addEventListener('mousemove', this.onMouseMove.bind(this));
      contentLayer.addEventListener('mouseup', this.onMouseUp.bind(this))
    }
  }

}

export default Mouse;