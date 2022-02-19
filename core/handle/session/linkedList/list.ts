import LinkedNode from './node';

class LinkedList<T> {

  header: LinkedNode<T>;
  lastNode: LinkedNode<T> | null;

  constructor() {
    this.header = new LinkedNode<T>(null);
    this.lastNode = null;
  }

  insert(element: T) {
    const node = new LinkedNode<T>(element);
    if (!this.header.next) {
      this.header.next = node;
      node.prev = this.header;
    } else if (this.lastNode) {
      this.lastNode.next = node;
      node.prev = this.lastNode;
    }
    this.lastNode = node;
  }

  delete(element: LinkedNode<T>) {
    const prevNode = element.prev;
    const nextNode = element.next;
    if (prevNode) {
      prevNode.next = nextNode;
    }
    if (nextNode) {
      nextNode.prev = prevNode;
    }
  }

}