import Subscribe from './subscribe';

interface _Subscribe {
  [index: string]: Subscribe;
}

class Vendors {

  _sub: _Subscribe;

  constructor() {
    this._sub = {};
  }

  addSubscribe(subscribe: Subscribe): void {
    this._sub[subscribe.type] = subscribe;
  }

  removeSubscribe(type: string): boolean {
    if (!this._sub[type]) {
      return false;
    }
    const subscribe: Subscribe = this._sub[type];
    subscribe.remove();
    return delete this._sub[type];
  }

  getSubscribe(type: string): Subscribe {
    return this._sub[type];
  }

}

export default Vendors;