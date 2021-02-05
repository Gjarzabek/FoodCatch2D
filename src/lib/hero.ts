export class Hero {

    public position: Array<Number>;
    private sprite: any;
    private dir: -1 | 0 | 1;
    private speed: number;

    constructor(X: number, Y: number, animated_sprite: any) {
        this.position = [X, Y]
        this.speed = 8;
        this.dir = 0;
        this.sprite = animated_sprite;
        this.sprite.position.set(X, Y);
    }
    
    public update(width: number): void {
        if (this.dir > 0) {
            if (this.sprite.position.x + this.speed > width)
                return;
        }
        else {
            if (this.sprite.position.x - this.speed < 0) 
                return;
        }
        
        this.sprite.position.x += this.speed * this.dir;
    }

    public move(dir: -1 | 0 | 1): void {
        this.dir = dir;
    }
    
    public incrementSpeed() {
        this.speed += 1;
    }

    public changeSprite(new_sprite: void, animation_speed: number) {
        this.position[0] = this.sprite.position.x;
        this.position[1] = this.sprite.position.y;

        this.sprite.stop();
        this.sprite.visible = false;
        this.sprite = new_sprite;
        this.sprite.position.set(this.position[0], this.position[1]);
        this.sprite.animationSpeed = animation_speed;
        this.sprite.play();
        this.sprite.visible = true;
    }

    public getBounds() {
        return this.sprite.getBounds();
    }
}