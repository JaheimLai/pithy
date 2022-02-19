class LinkedNode<T> {

  element: T | null;
  next: LinkedNode<T> | null; // 下一个位置所在的指针
  prev: LinkedNode<T> | null; // 上一个指针所在的位置

  constructor(element: T | null, next?: LinkedNode<T>, prev?: LinkedNode<T>) {
    this.element = element || null;
    this.next = next || null;
    this.prev = prev || null;
  }

}

export default LinkedNode;