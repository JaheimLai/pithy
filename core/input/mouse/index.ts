import Event from '../../handle/event/index';

interface MouseDownType {
  left: number;
  right: number;
  middle: number;
}

class Mouse extends Event {

  which: number; // 当前按下哪个鼠标键，对应mouseDownType值
  pressed: boolean; // 是否在按住鼠标键没有松开的状态
  mouseDownType: MouseDownType;
  readonly eventLeftType: string;
  readonly eventRightType: string;
  readonly eventMiddleType: string;
  readonly eventClickType: string;
  // click => PointerEvent 

  constructor() {
    super();
    this.eventLeftType = 'left';
    this.eventRightType = 'right';
    this.eventMiddleType = 'middle';
    this.eventClickType = 'click';
    this.mouseDownType = {
      left: 1,
      right: 3,
      middle: 2,
    };
    this.pressed = false;
  }

  onMouseEvent(): void {

  }

  onMouseEvent(): void {

  }

  onMouseDown(e: MouseEvent): void {
    this.pressed = true;
    this.which = e.which;
    switch(e.which) {
      case this.mouseDownType.left:
        this.dispatch(this.eventLeftType, e);
        break;
      case this.mouseDownType.right:
        this.dispatch(this.eventRightType, e);
      case this.mouseDownType.middle:
        this.dispatch(this.eventMiddleType, e);
        break;
      default:
        this.dispatch(this.eventClickType, e);
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