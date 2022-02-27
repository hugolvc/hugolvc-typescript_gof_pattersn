export interface CommandInterface {
    method: Function;

    execute(context: any): any
}

export default class Command implements CommandInterface {
    method: Function;

    constructor(method: Function) {
        this.method = method;
    }

    execute(context: any): any {
        return this.method(context);
    }
}