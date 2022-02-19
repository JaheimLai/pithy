class Listeners {

  type: string;
  fn: (...arg: any[]) => void;
  context: any;

  constructor(type: string, fn: (...arg: any[]) => void, context: any) {
    this.type = type;
    this.fn = fn;
    this.context = context;
  }

  run(...arg: any[]): void {
    this.fn.apply(this.context, arg);
  }

  remove(): void {
    delete this.context;
    delete this.fn;
  }

};

export default Listeners;