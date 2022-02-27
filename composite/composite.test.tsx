import CompositeNode, {CompositeNodeInterface} from '.';
import Visitor, {VisitorReceiverInterface} from '../visitor';
import Command, { CommandInterface } from '../command';

test("Composite instantiates properly when 'definer' is a string", () => {
  const newCompositeNode = new CompositeNode('test_composite');

  expect(newCompositeNode.definer).toStrictEqual('test_composite');
  expect(newCompositeNode.name).toBe('test_composite');
  expect(newCompositeNode.parent).toBe(null);
  expect(newCompositeNode.children).toStrictEqual([]);
})

test("Composite instantiates properly when definer is an object with key 'name'", () => {
  const testObject = {value1: 1, value2: 2, name: 'test_object'}
  const newCompositeNode = new CompositeNode(testObject);

  expect(newCompositeNode.definer).toStrictEqual(testObject);
  expect(newCompositeNode.name).toBe('test_object');
  expect(newCompositeNode.parent).toBe(null);
  expect(newCompositeNode.children).toStrictEqual([]);
})

test("Composite instantiates properly when definer is an object without key 'name'", () => {
  const testObject = {value1: 1, value2: 2}
  const newCompositeNode = new CompositeNode(testObject);

  expect(newCompositeNode.definer).toStrictEqual(testObject);
  expect(newCompositeNode.name).toBe('1');
  expect(newCompositeNode.parent).toBe(null);
  expect(newCompositeNode.children).toStrictEqual([]);
})

test("Composite instantiates properly when 'definer' is a class instance", () => {
  class TestClass {
    attribute = null;
  }
  TestClass.prototype.toString = function (){
    return 'test_class';
  }

  let testClass = new TestClass()
  const newCompositeNode = new CompositeNode(testClass);

  expect(testClass.toString()).toBe('test_class');
  expect(newCompositeNode.name).toBe('test_class');
  expect(newCompositeNode.definer).toStrictEqual(testClass);
  expect(newCompositeNode.parent).toBe(null);
  expect(newCompositeNode.children).toStrictEqual([]);
})

test("CompositeNode.addChild()", () => {
  const parentNode = new CompositeNode('test_node');
  const testChild = parentNode.addChild('test_child');

  expect(testChild.name).toBe('test_child');
  expect(parentNode.children.length).toBe(1);
  // @ts-ignore: Object is possibly 'null'.
  expect(testChild.parent.name).toBe('test_node');
  expect(parentNode.children[0].definer.toString()).toBe('test_child');
})

test("CompositeNode.addChild(), one parent, several children", () => {
  const parentNode = new CompositeNode('test_node');
  const firstChild = parentNode.addChild('first_child');
  const secondChild = parentNode.addChild('second_child');
  const thirdChild = parentNode.addChild('third_child');
  const fourthChild = parentNode.addChild('fourth_child');
  const fifthChild = parentNode.addChild('fifth_child');

  expect(parentNode.children.length).toBe(5);
  expect(parentNode.children[0].definer.toString()).toBe('first_child');
  expect(parentNode.children[1].definer.toString()).toBe('second_child');
  expect(parentNode.children[2].definer.toString()).toBe('third_child');
  expect(parentNode.children[3].definer.toString()).toBe('fourth_child');
  expect(parentNode.children[4].definer.toString()).toBe('fifth_child');

  // @ts-ignore: Object is possibly 'null'.
  expect(firstChild.parent.definer.toString()).toBe('test_node');
  // @ts-ignore: Object is possibly 'null'.
  expect(secondChild.parent.definer.toString()).toBe('test_node');
  // @ts-ignore: Object is possibly 'null'.
  expect(thirdChild.parent.definer.toString()).toBe('test_node');
  // @ts-ignore: Object is possibly 'null'.
  expect(fourthChild.parent.definer.toString()).toBe('test_node');
  // @ts-ignore: Object is possibly 'null'.
  expect(fifthChild.parent.definer.toString()).toBe('test_node');
})

test("CompositeNode.addChild() several levels", () => {
  const firstUnit = new CompositeNode('first_unit');
  const secondUnit = firstUnit.addChild('second_unit');
  const thirdUnit = secondUnit.addChild('third_unit');
  const fourthUnit = thirdUnit.addChild('fourth_unit');
  const fifthUnit = fourthUnit.addChild('fifth_unit');
  

  expect(firstUnit.name).toBe('first_unit');
  expect(firstUnit.parent).toBe(null);
  expect(firstUnit.children.length).toBe(1);
  expect(firstUnit.children[0].definer.toString()).toBe('second_unit');

  expect(secondUnit.name).toBe('second_unit');
  // @ts-ignore: Object is possibly 'null'.
  expect(secondUnit.parent.definer.toString()).toBe('first_unit');
  expect(secondUnit.children.length).toBe(1);
  expect(secondUnit.children[0].definer.toString()).toBe('third_unit');

  expect(thirdUnit.name).toBe('third_unit');
  // @ts-ignore: Object is possibly 'null'.
  expect(thirdUnit.parent.definer.toString()).toBe('second_unit');
  expect(thirdUnit.children.length).toBe(1);
  expect(thirdUnit.children[0].definer.toString()).toBe('fourth_unit');

  expect(fourthUnit.name).toBe('fourth_unit');
  // @ts-ignore: Object is possibly 'null'.
  expect(fourthUnit.parent.definer.toString()).toBe('third_unit');
  expect(fourthUnit.children.length).toBe(1);
  expect(fourthUnit.children[0].definer.toString()).toBe('fifth_unit');

  expect(fifthUnit.name).toBe('fifth_unit');
  // @ts-ignore: Object is possibly 'null'.
  expect(fifthUnit.parent.definer.toString()).toBe('fourth_unit');
  expect(fifthUnit.children.length).toBe(0);
})

test("CompositeNode.getBreadcrumbsTo()", () => {
  const firstUnit = new CompositeNode('first_unit');
  const secondUnit = firstUnit.addChild('second_unit');
  const thirdUnit = secondUnit.addChild('third_unit');
  const fourthUnit = thirdUnit.addChild('fourth_unit');
  const fifthUnit = fourthUnit.addChild('fifth_unit');

  const breadcrumbs = fifthUnit.getBreadcrumbsTo();
  expect(breadcrumbs).toBe('first_unit/second_unit/third_unit/fourth_unit/fifth_unit');
})

test("CompositeNode.getAllBreadcrumbsFrom()", () => {
  const one = new CompositeNode('one')
  const one_one = one.addChild('one_one')
  const one_one_one = one_one.addChild('one_one_one')
  const one_one_two = one_one.addChild('one_one_two')
  const one_one_three = one_one.addChild('one_one_three')
  const one_two = one.addChild('one_two')
  const one_two_one = one_two.addChild('one_two_one')
  const one_two_one_one = one_two_one.addChild('one_two_one_one')
  const one_two_two = one_two.addChild('one_two_two')
  const one_three = one.addChild('one_three')

  const allBreadcrumbs = one.getAllBreadcrumbsFrom();
  expect(allBreadcrumbs.length).toBe(6);
  expect(allBreadcrumbs.includes('one/one_one/one_one_one')).toBe(true);
  expect(allBreadcrumbs.includes('one/one_one/one_one_two')).toBe(true);
  expect(allBreadcrumbs.includes('one/one_one/one_one_three')).toBe(true);
  expect(allBreadcrumbs.includes('one/one_two/one_two_one/one_two_one_one')).toBe(true);
  expect(allBreadcrumbs.includes('one/one_two/one_two_two')).toBe(true);
  expect(allBreadcrumbs.includes('one/one_three')).toBe(true);
})

test("CompositeNode.getLeaves()", () => {
  const one = new CompositeNode('one')
  const one_one = one.addChild('one_one')
  const one_one_one = one_one.addChild('one_one_one')
  const one_one_two = one_one.addChild('one_one_two')
  const one_one_three = one_one.addChild('one_one_three')
  const one_two = one.addChild('one_two')
  const one_two_one = one_two.addChild('one_two_one')
  const one_two_one_one = one_two_one.addChild('one_two_one_one')
  const one_two_two = one_two.addChild('one_two_two')
  const one_three = one.addChild('one_three')

  const leaves = one.getLeaves();
  expect(leaves.length).toBe(6);
})

test("CompositeNode.getRoot()", () => {
  const firstUnit = new CompositeNode('first_unit');
  const secondUnit = firstUnit.addChild('second_unit');
  const thirdUnit = secondUnit.addChild('third_unit');
  const fourthUnit = thirdUnit.addChild('fourth_unit');
  const fifthUnit = fourthUnit.addChild('fifth_unit');

  const root = fifthUnit.getRoot();
  expect(root.definer.toString()).toBe('first_unit');
})

test("CompositeNode.getPathTo()", () => {
  const firstUnit = new CompositeNode('first_unit');
  const secondUnit = firstUnit.addChild('second_unit');
  const thirdUnit = secondUnit.addChild('third_unit');
  const fourthUnit = thirdUnit.addChild('fourth_unit');
  const fifthUnit = fourthUnit.addChild('fifth_unit');

  const path = fifthUnit.getPathTo();
  expect(path.toString()).toBe('Iterator');

  let node: VisitorReceiverInterface | false = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node.name).toBe('first_unit');

  node = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node.name).toBe('second_unit');

  node = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node.name).toBe('third_unit');

  node = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node.name).toBe('fourth_unit');

  node = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node.name).toBe('fifth_unit');

  node = path.next();
  //@ts-ignore: Property 'name' does not exist on type 'false | VisitorReceiverInterface'.
  //Property 'name' does not exist on type 'false'.
  expect(node).toBe(false);
})

test("CompositeNode.getNodesTo()", () => {
  const firstUnit = new CompositeNode('first_unit');
  const secondUnit = firstUnit.addChild('second_unit');
  const thirdUnit = secondUnit.addChild('third_unit');
  const fourthUnit = thirdUnit.addChild('fourth_unit');
  const fifthUnit = fourthUnit.addChild('fifth_unit');

  const nodes = fifthUnit.getNodesTo();
  expect(nodes.length).toBe(5);
  expect(nodes[0].definer.toString()).toBe('first_unit');
  expect(nodes[1].definer.toString()).toBe('second_unit');
  expect(nodes[2].definer.toString()).toBe('third_unit');
  expect(nodes[3].definer.toString()).toBe('fourth_unit');
  expect(nodes[4].definer.toString()).toBe('fifth_unit');
})

test("CompositeNode.acceptVisitor()", () => {
  const compositeNode = new CompositeNode('test_node');
  let command = new Command((compositeNode) => {return compositeNode.name});
  let visitor = new Visitor(command);
  const compositeNodeName = visitor.visit(compositeNode);
  
  expect(compositeNodeName).toBe('test_node');
})

test ("CompositeNode.branch()", () => {
  const one = new CompositeNode('one')
  const one_one = one.addChild('one_one')
  const one_one_one = one_one.addChild('one_one_one')
  const one_one_two = one_one.addChild('one_one_two')
  const one_one_three = one_one.addChild('one_one_three')
  const one_two = one.addChild('one_two')
  const one_two_one = one_two.addChild('one_two_one')
  const one_two_one_one = one_two_one.addChild('one_two_one_one')
  const one_two_two = one_two.addChild('one_two_two')
  const one_three = one.addChild('one_three')

  const branch = one_two.branch();
  const branchBreadcrumbs = branch.getAllBreadcrumbsFrom();
  expect(branchBreadcrumbs.length).toBe(2);
  expect(branchBreadcrumbs.includes('one_two/one_two_one/one_two_one_one')).toBe(true);
  expect(branchBreadcrumbs.includes('one_two/one_two_two')).toBe(true);
})

test("CompositeNode.getNodeFromBreadcrumbs()", () => {
  const one = new CompositeNode('one')
  const one_one = one.addChild('one_one')
  const one_one_one = one_one.addChild('one_one_one')
  const one_one_two = one_one.addChild('one_one_two')
  const one_one_three = one_one.addChild('one_one_three')
  const one_two = one.addChild('one_two')
  const one_two_one = one_two.addChild('one_two_one')
  const one_two_one_one = one_two_one.addChild('one_two_one_one')
  const one_two_two = one_two.addChild('one_two_two')
  const one_three = one.addChild('one_three')

  const node = one.getNodeFromBreadcrumbs('one/one_two/one_two_two');
  //@ts-ignore: Object is possibly 'null'.
  expect(node.toString()).toBe("one_two_two");
})

test("CompositeNode.traverseFrom()", () => {
  class TestCommand extends Command {
    names: string[] = [];

    execute(context: any): any {
      this.names.push(context.name);
      return this.method(context);
    }
  }

  //@ts-ignore: Property 'name' does not exist on type 'VisitorReceiverInterface'.
  let testCommand = new TestCommand((instance) => instance.name)
  const visitor = new Visitor(testCommand);

  const one = new CompositeNode('one')
  const one_one = one.addChild('one_one')
  const one_one_one = one_one.addChild('one_one_one')
  const one_one_two = one_one.addChild('one_one_two')
  const one_one_three = one_one.addChild('one_one_three')
  const one_two = one.addChild('one_two')
  const one_two_one = one_two.addChild('one_two_one')
  const one_two_one_one = one_two_one.addChild('one_two_one_one')
  const one_two_two = one_two.addChild('one_two_two')
  const one_three = one.addChild('one_three')

  const traverseResult = one.traverseFrom(visitor);
  expect(testCommand.names.length).toBe(10);
  expect(testCommand.names[0]).toBe('one');
  expect(testCommand.names[1]).toBe('one_one');
  expect(testCommand.names[2]).toBe('one_one_one');
  expect(testCommand.names[3]).toBe('one_one_two');
  expect(testCommand.names[4]).toBe('one_one_three');
  expect(testCommand.names[5]).toBe('one_two');
  expect(testCommand.names[6]).toBe('one_two_one');
  expect(testCommand.names[7]).toBe('one_two_one_one');
  expect(testCommand.names[8]).toBe('one_two_two');
  expect(testCommand.names[9]).toBe('one_three');
})
