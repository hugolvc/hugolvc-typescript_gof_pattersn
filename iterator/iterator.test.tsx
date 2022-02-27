import Visitor, {VisitorReceiverInterface, VisitorInterface} from '../visitor';
import Command from '../command';
import Iterator from '.';

test("Iterator.append()", () => {
  class TestInstance implements VisitorReceiverInterface {
    acceptVisit(visitor: VisitorInterface): any {
      return 'test_instance'
    }

    toString() {
      return 'test_instance'
    }
  };

  let iterator = new Iterator();
  iterator.append(new TestInstance());

  expect(iterator.instances.length).toBe(1);
  expect(iterator.instances[0].toString()).toBe('test_instance');
})

test("Iterator.next()", () => {
  class TestInstance implements VisitorReceiverInterface {
    i: number | null = null;

    constructor(i: number) {
      this.i = i;
    }

    acceptVisit(visitor: VisitorInterface): any {
      return this.i;
    }

    toString() {
      //@ts-ignore: Object is possibly 'null'.
      return this.i.toString();
    }
  };

  let iterator = new Iterator();

  for(let i=0; i<2; i++) {
    iterator.append(new TestInstance(i));
  }

  let instance = iterator.next();
  expect(instance.toString()).toBe('0');
  instance = iterator.next();
  expect(instance.toString()).toBe('1');
  instance = iterator.next();
  expect(instance.toString()).toBe('false');
})

test("Iterator.isNext()", () => {
  class TestInstance implements VisitorReceiverInterface {
    i: number | null = null;

    constructor(i: number) {
      this.i = i;
    }

    acceptVisit(visitor: VisitorInterface): any {
      return this.i;
    }

    toString() {
      //@ts-ignore: Object is possibly 'null'.
      return this.i.toString();
    }
  };

  let iterator = new Iterator();

  for(let i=0; i<2; i++) {
    iterator.append(new TestInstance(i));
  }

  expect(iterator.isNext()).toBe(true);
  iterator.next();
  expect(iterator.isNext()).toBe(true);
  iterator.next();
  expect(iterator.isNext()).toBe(false);
})

test("Iterator.traverse()", () => {
  class TestInstance implements VisitorReceiverInterface {
    i: number | null = null;

    constructor(i: number) {
      this.i = i;
    }

    acceptVisit(visitor: VisitorInterface): any {
      return this.i;
    }

    toString() {
      //@ts-ignore: Object is possibly 'null'.
      return this.i.toString();
    }
  };

  let visitor = new Visitor(new Command((instance: TestInstance) => instance.i));

  let iterator = new Iterator();
  iterator.append(new TestInstance(0));
  iterator.append(new TestInstance(1));

  const result = iterator.traverse(visitor);

  expect(result.length).toBe(2);
  expect(0 in result).toBe(true);
  expect(1 in result).toBe(true);
})
