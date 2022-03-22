const enum EVENT_TYPE { // 自定义事件发送的鼠标按键类型
  LEFT = 'left', // 左键
  RIGHT = 'right', // 右键
  MIDDLE = 'middle', // 中键
  CLICK = 'click', // 点击
};

const enum MOUSE_DOWN_TYPE { // MouseEvent.which对应的枚举
  LEFT = 1,
  RIGHT = 3,
  MIDDLE = 2,
};

export {
  EVENT_TYPE,
  MOUSE_DOWN_TYPE,
};
