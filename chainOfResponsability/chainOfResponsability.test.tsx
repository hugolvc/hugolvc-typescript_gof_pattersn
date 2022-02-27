import ChainOfResponsability from '.';
import Visitor, { VisitorReceiverInterface, VisitorInterface } from '../visitor';
import Command from '../command';

test("ChainOfResponsabilites.append()", () => {
  class TestInstance implements VisitorReceiverInterface {
    name: string;

    constructor(name: string) {
      this.name = name;
    }

    acceptVisit(visitor: VisitorInterface): any {
      return visitor.execute(this);
    }

    toString() {
      //@ts-ignore: Object is possibly 'null'.
      return this.name;
    }
  };

  let chainOfResponsability = new ChainOfResponsability(new Visitor(new Command((x: any): any => x)));
  chainOfResponsability.append(new TestInstance('test_instance'));

  expect(chainOfResponsability.instances.length).toBe(1);
  //@ts-ignore: Property 'name' does not exist on type 'VisitorReceiverInterface'.
  expect(chainOfResponsability.instances[0].name).toBe('test_instance');
})

test("ChainOfResponsability.handle()", () => {
  class TestInstance implements VisitorReceiverInterface {
    i: number | null = null;

    constructor(i: number) {
      this.i = i;
    }

    acceptVisit(visitor: VisitorInterface): any {
      return visitor.execute(this);
    }

    toString() {
      //@ts-ignore: Object is possibly 'null'.
      return this.i.toString();
    }
  };

  //@ts-ignore: Property 'i' does not exist on type 'VisitorReceiverInterface'.
  let visitor = new Visitor(new Command((instance: VisitorReceiverInterface): any =>  instance.i === 0? instance.i: false));
  let chainOfResponsabilityTest = new ChainOfResponsability(visitor);
  for(let i=0; i<5; i++) {
    chainOfResponsabilityTest.append(new TestInstance(i));
  }
  let handleResult = chainOfResponsabilityTest.handle();
  expect(handleResult).toBe(0);


  //@ts-ignore: Property 'i' does not exist on type 'VisitorReceiverInterface'.
  visitor = new Visitor(new Command((instance: VisitorReceiverInterface): any =>  instance.i === 2? instance.i: false));
  chainOfResponsabilityTest = new ChainOfResponsability(visitor);
  for(let i=0; i<5; i++) {
    chainOfResponsabilityTest.append(new TestInstance(i));
  }
  handleResult = chainOfResponsabilityTest.handle();
  expect(handleResult).toBe(2);

  //@ts-ignore: Property 'i' does not exist on type 'VisitorReceiverInterface'.
  visitor = new Visitor(new Command((instance: VisitorReceiverInterface): any =>  instance.i === 4? instance.i: false));
  chainOfResponsabilityTest = new ChainOfResponsability(visitor);
  for(let i=0; i<5; i++) {
    chainOfResponsabilityTest.append(new TestInstance(i));
  }
  handleResult = chainOfResponsabilityTest.handle();
  expect(handleResult).toBe(4);

  //@ts-ignore: Property 'i' does not exist on type 'VisitorReceiverInterface'.
  visitor = new Visitor(new Command((instance: VisitorReceiverInterface): any =>  instance.i === 5? instance.i: false));
  chainOfResponsabilityTest = new ChainOfResponsability(visitor);
  for(let i=0; i<5; i++) {
    chainOfResponsabilityTest.append(new TestInstance(i));
  }
  handleResult = chainOfResponsabilityTest.handle();
  expect(handleResult).toBe(false);
})