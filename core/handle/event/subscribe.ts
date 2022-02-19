import Listeners from './listeners';

class Subscrie {

  type: string;
  listener: Listeners[];

  constructor(type: string) {
    this.type = type;
    this.listener = [];
  }

  addEventListener(type: string, fn: (...arg: any[]) => void, context: any): void {
    this.listener.push(new Listeners(type, fn, context));
  }

  pop(): void {
    this.listener.pop();
  }

  remove(): void {
    delete this.listener;
    delete this.type;
  }

  run(...arg: any[]): void {
    if (!this.listener) {
      return;
    }
    this.listener.forEach(i => {
      i.run(...arg);
    });
  }

}

export default Subscrie;