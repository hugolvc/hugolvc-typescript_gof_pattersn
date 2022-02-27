import {VisitorInterface, VisitorReceiverInterface} from '../visitor';

export interface ChainOfResponsabilityInterface {
  visitor: VisitorInterface;
  instances: VisitorReceiverInterface[];

  append(instance: VisitorReceiverInterface): void;
  handle(): any;
}

export default class ChainOfResponsability implements ChainOfResponsabilityInterface {
  visitor: VisitorInterface;
  instances: VisitorReceiverInterface[] = [];

  constructor(visitor: VisitorInterface) {
    this.visitor = visitor;
  }

  append(instance: VisitorReceiverInterface): void {
    this.instances.push(instance);
  }
  
  handle(): any {
    return this.traverse();
  }

  traverse(): any {
    let i = 0;
    while(true) {
      let result = this.instances[i].acceptVisit(this.visitor);
      if (result !== false) {
        return result;
      } else {
        if (i < this.instances.length - 1) {
          i++;
        } else {
          return false;
        }
      }
    }
  }
}