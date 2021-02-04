export class Hero {

    private pos: any;

    constructor(x: number, y: number) {
        this.pos = [x, y];
    }

    getPos(): any {
        return this.pos;
    }

}