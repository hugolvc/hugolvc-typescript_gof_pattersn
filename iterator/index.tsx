import {VisitorReceiverInterface, VisitorInterface} from '../visitor';

export interface IteratorInterface {
  index: number;
  instances: VisitorReceiverInterface[];

  append(instance: VisitorReceiverInterface): void;
  next(): VisitorReceiverInterface | false;
  isNext(): boolean;
  traverse(visitor: VisitorInterface): any;
}

export default class Iterator implements IteratorInterface {
  index: number = -1;
  instances: VisitorReceiverInterface[] = [];

  append(instance: VisitorReceiverInterface): void {
    this.instances.push(instance);
  }

  next(): VisitorReceiverInterface | false {
    if (this.index < this.instances.length-1) {
      this.index++;
      return this.instances[this.index];
    } else {
      return false;
    }
  }

  isNext(): boolean {
    if (this.index < this.instances.length-1) {
      return true;
    } else {
      return false;
    }
  }

  traverse(visitor: VisitorInterface): any {
    let result: number[] = [];
    this.instances.forEach(instance => {
      result.push(visitor.execute(instance));
    });

    return result
  }
}