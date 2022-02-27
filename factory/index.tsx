export interface CreatorInterface {
  create(initData: {[key: string]: any} | null): object;
}

export interface FactoryInterface {
  creators: {[key: string]: CreatorInterface};

  registerCreator(identifier: string, creatorClass: new () => CreatorInterface): boolean;
  getCreators(): string[];
  create(identifier: string, initData: {[key: string]: any} | null): object;
}

export class Creator implements CreatorInterface {
  create(initData: {[key: string]: any} | null): object {
    throw "Method 'create()' must be implemented"
  }
}

export default class Factory implements FactoryInterface {
  creators: {[key: string]: CreatorInterface} = {}

  registerCreator(identifier: string, creatorClass: new () => CreatorInterface): boolean {
    if (identifier in this.creators) {
      return false;
    }

    this.creators[identifier] = new creatorClass()

    return true
  }

  getCreators(): string[] {
    return Object.keys(this.creators);
  }

  create(identifier: string, initData: {[key: string]: any} | null=null): object{
    const newInstance = this.creators[identifier].create(initData);

    return newInstance;
  }
}