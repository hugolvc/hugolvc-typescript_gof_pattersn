import Factory, {Creator} from '.';

test("Factory.register()", () => {
  class TestCreator extends Creator {
    toString() {
      return 'TestCreator'
    }
  }

  const factory = new Factory();
  factory.registerCreator('test_creator', TestCreator);

  expect(Object.keys(factory.creators).length).toBe(1);
  expect('test_creator' in factory.creators).toBe(true);
  expect(factory.creators['test_creator'].toString()).toBe('TestCreator')
})

test("Factory.getCreators()", () => {
  class TestInstance {
    name: string | null= null;

    constructor(name: string) {
      this.name = name;
    }
  }

  class TestCreator extends Creator {
    create(initData: {[key: string]: any}): object {
      const newInstance = new TestInstance(initData.name)
      return newInstance;
    }
  }

  const factory = new Factory();
  factory.registerCreator('test_creator', TestCreator);

  const creators = factory.getCreators();

  expect(creators.length).toBe(1);
  expect(creators.includes('test_creator')).toBe(true);
})

test("Factory.create()", () => {
  class TestInstance {
    name: string | null= null;

    constructor(name: string) {
      this.name = name;
    }
  }

  class TestCreator extends Creator {
    create(initData: {[key: string]: any}): object {
      const newInstance = new TestInstance(initData.name)
      return newInstance;
    }
  }

  const factory = new Factory();
  factory.registerCreator('test_creator', TestCreator);
  const testInstance = factory.create('test_creator', {name: 'test_instance'});

  //@ts-ignore: Property 'name' does not exist on type 'object'.
  expect(testInstance.name).toBe('test_instance');
})