import Vendors from './vendors'
import Subscrie from './subscribe';

class Emitter extends Vendors {

  dispatch(type: string, ...arg: any[]) {
    const sub = this.getSubscribe(type);
    if (sub) {
      sub.run(...arg);
    }
  }

  addEventListener(type: string, fn: (...arg: any[]) => void, context: any) {
    let sub: Subscrie = this.getSubscribe(type);
    if (!sub) {
      sub = new Subscrie(type);
      sub.addEventListener(type, fn, context);
      this.addSubscribe(sub);
    } else {
      sub.addEventListener(type, fn, context);
    }
  }

}

export default Emitter;