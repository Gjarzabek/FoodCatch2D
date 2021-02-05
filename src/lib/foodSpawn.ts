export class FoodSpawn {


    private counter: number;
    private spawn_rate: number;

    constructor() {
        this.spawn_rate = 120;
        this.counter = 0;
    }

    public update(): boolean {
        this.counter++;
        if (this.counter >= this.spawn_rate) {
            this.counter = 0;
            return true;
        }
        else return false;
    }

    public incrementSpeed() {
        this.spawn_rate -= 10;
    }

}