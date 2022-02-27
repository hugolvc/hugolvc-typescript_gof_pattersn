import Visitor, {VisitorReceiverInterface} from '.';
import Command from '../command';

test("Visitor.visit()", () => {
  class VisitorReceiver implements VisitorReceiverInterface {
    acceptVisit(visitor: Visitor): any {
      return visitor.command.execute('visitor_receiver');
    }
  }

  let visitorReceiver = new VisitorReceiver();
  let command = new Command((instance: string): string => {return instance})
  let visitor = new Visitor(command);

  expect(visitor.visit(visitorReceiver)).toBe('visitor_receiver');
})