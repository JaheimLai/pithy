// import Render from '../layer/render/render';

class Dom {

  private _element: HTMLElement;

  constructor(tagName: string, option?: object) {
    this._element = Dom.element(tagName, option);
  }

  static element(tagName: string, option: object): HTMLElement {
    return document.createElement(tagName, option);
  }

  static getBody(): HTMLBodyElement {
    return document.body;
  }

  static isNewLine(text: string): boolean {
    // 判断是否是新起一行
    return (text == "\r\n" || text == "\r" || text == "\n");
  }

  // 不做挂载处理
  mount(root: HTMLElement): void {
    if (root) {
      root.append(this._element);
    }
  }

  remove(): void {
    const old = this._element;
    this._element = undefined;
    old.remove();
  }

  addEventListener(type: string, listener: (...arg: any[]) => void, option: any): void {
    this._element.addEventListener(type, listener, option);
  }

  dispatchCurtomEvent(type: string, data: any): void {
    this._element.dispatchEvent(new CustomEvent(type, data));
  }

  getElement(): HTMLElement {
    return this._element;
  }

  setPosition(top: number, right: number, bottom: number, left: number): void {
    if (top) {
      this._element.style.top = `${top}px`;
    }
    if (right) {
      this._element.style.right = `${right}px`;
    }
    if (bottom) {
      this._element.style.bottom = `${bottom}px`;
    }
    if (left) {
      this._element.style.left = `${left}px`
    }
  }

  setStyle(style) {
    for (name of style) {
      if (Object.prototype.hasOwnProperty.call(this._element.style, name)) {
        this._element.style[name] = style[name];
      }
    }
  }

}

export default Dom;
