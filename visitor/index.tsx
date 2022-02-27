import {CommandInterface} from '../command';

export interface VisitorReceiverInterface {
  acceptVisit (visitor: VisitorInterface): any;
}
  
export interface VisitorInterface {
  command: CommandInterface;

  visit(host: VisitorReceiverInterface): any;
  execute(host: VisitorReceiverInterface): any;
}

export default class Visitor implements VisitorInterface {
  command: CommandInterface;

  constructor(command: CommandInterface) {
    this.command = command;
  }

  visit(host: VisitorReceiverInterface): any {
    return host.acceptVisit(this);
  }

  execute(host: VisitorReceiverInterface): any {
    return this.command.execute(host);
  }
}