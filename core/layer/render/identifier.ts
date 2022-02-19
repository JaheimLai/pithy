const body = {
  type: 'body',
  getElement() {
    return document.body;
  },
};

const box = {
  type: 'box',
  getElement() {
    const el = document.createElement('div');
    el.className = 'ide-box';
    return el;
  },
};

const ide = {
  type: 'ide',
  getElement() {
    const el = document.createElement('div');
    el.className = 'ide';
    return el;
  },
};

const line = {
  type: 'line',
  getElement() {
    const el = document.createElement('p');
    el.className = 'line';
    return el;
  },
};

const text = {
  type: 'text',
  getElement() {
    const el = document.createElement('p');
    el.className = 'text';
    return el;
  },
};

const cursor = {
  type: 'cursor',
  getElement() {
    const el = document.createElement('textarea');
    el.style.width = '1px';
    el.style.resize = 'none';
    el.style.border = 'none';
    el.style.outline = 'none';
    el.style.position = 'absolute';
    el.style.fontWeight = 'normal';
    el.style.fontSize = '16px';
    el.style.letterSpacing = '0px';
    el.style.minWidth = '0';
    el.style.minHeight = '0';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.overflow = 'hidden';
    el.style.color = 'transparent';
    el.style.backgroundColor = 'transparent';
    return el;
  },
};

export default {
  body,
  box,
  ide,
  line,
  text,
  cursor,
};