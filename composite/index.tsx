import {VisitorInterface, VisitorReceiverInterface} from '../visitor';
import Iterator, {IteratorInterface} from '../iterator';
import { ChildCareSharp } from '@material-ui/icons';

export interface CompositeNodeInterface {
  name: string;
  definer: any;
  parent: CompositeNodeInterface | null;
  children: CompositeNodeInterface[];

  addChild(definer: any): CompositeNodeInterface;
  getBreadcrumbsTo(): string;
  getAllBreadcrumbsFrom(): string[];
  getLeaves(): CompositeNodeInterface[];
  getRoot(): CompositeNodeInterface;
  getPathTo(): IteratorInterface;
  getNodesTo(): CompositeNodeInterface[];
  acceptVisit(visitor: VisitorInterface): any;
  branch(): CompositeNodeInterface;
  getNodeFromBreadcrumbs(breadcrumbs: string): CompositeNodeInterface | null;
  traverseFrom(visitor: VisitorInterface): any;
}

export default class CompositeNode implements CompositeNodeInterface, VisitorReceiverInterface {
  name: string;
  definer: any;
  parent: CompositeNode | null;
  children: CompositeNode[];

  constructor(definer: any) {
    switch(definer.constructor.name) {
      case 'Object':
        if ('name' in definer) {
          this.name = definer.name;
        } else {
          this.name = String(Object.values(definer)[0]);
        }

        break;
      default:
        this.name = definer.toString();
    }

    this.definer = definer;
    this.parent = null;
    this.children = [];
  }

  toString(): string {
    return this.name;
  }

  addChild(definer: any): CompositeNode {
    let newNode = new CompositeNode(definer);
    newNode.parent = this;
    this.children.push(newNode);

    return newNode;
  }

  getBreadcrumbsTo(): string {
    if (this.parent) {
      return this.parent.getBreadcrumbsTo() + '/' + this.name;
    } else {
      return this.name;
    }
  }

  getAllBreadcrumbsFrom(): string[] {
    if (this.children.length > 0) {
      let breadcrumbs: string[] = [];
      this.children.forEach(child => {
        let childBreadcrumbs = child.getAllBreadcrumbsFrom();
        childBreadcrumbs.forEach(childBreadcrumb => {
          breadcrumbs.push(this.name + '/' + childBreadcrumb);
        })
      })

      return breadcrumbs;
    } else {
      return [this.name]
    }
  }

  getLeaves(): CompositeNode[] {
    if (this.children.length > 0) {
      let leaves: CompositeNode[] = [];
      this.children.forEach(child => {
        let childLeaves = child.getLeaves();
        leaves = [...leaves, ...childLeaves];
      });

      return leaves;
    } else {
      return [this];
    }
  }

  getRoot(): CompositeNode {
    if (this.parent) {
      return this.parent.getRoot();
    } else {
      return this;
    }
  }

  getPathTo(): IteratorInterface {
    let iterator = new Iterator();
    const nodes = this.getNodesTo();

    nodes.forEach(node => {
      iterator.append(node);
    })

    iterator.toString = () => {return 'Iterator'};

    return iterator;
  }

  getNodesTo(): CompositeNode[] {
    if (this.parent) {
      let nodes: CompositeNode[] = this.parent.getNodesTo();
      nodes.push(this);

      return nodes;
    } else {
      return [this];
    }
  }

  acceptVisit(visitor: VisitorInterface): any {
    return visitor.execute(this);
  }

  getNodeFromBreadcrumbs(breadcrumbs: string): CompositeNode | null {
    const names = breadcrumbs.split('/');
    if (names[0] === this.name) {
      names.splice(0, 1)
    };

    return this._getNodeFromBreadcrumbs(names);
  }

  _getNodeFromBreadcrumbs(names: string[]): CompositeNode | null {
    const name = names.splice(0, 1)[0];

    const nextNode = this.children.find(child => child.name === name);
    
    if (!nextNode) {
      return null;
    }

    if (names.length > 0) {
      return nextNode._getNodeFromBreadcrumbs(names);
    } else {
      return nextNode;
    }
  }

  traverseFrom(visitor: VisitorInterface): any {
    return this._traverse(visitor);
  }

  _traverse(visitor: VisitorInterface): any {
    let result: any[] = [];

    result.push(visitor.visit(this));

    this.children.forEach((child) => {
      let childResult = child._traverse(visitor);
      result.push(childResult);
    })

    return result;
  }

  branch(): CompositeNode {
    return this;
  }
}
