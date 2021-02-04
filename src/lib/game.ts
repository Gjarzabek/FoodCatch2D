import * as PIXI from 'pixi.js'
import {Hero} from './hero'
import {KeyInfo} from './keyboard'
import {FoodSpawn} from './foodSpawn'
import {collide2d} from './collide2D'

const frames_info = [
    [4, 'idle'],
    [6, 'left'],
    [6, 'right'],
];
const FOOD_N = 63;
const FOOD_SPEED = 2;

const app = new PIXI.Application({
    width: window.innerWidth-20, 
    height: window.innerHeight-20,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
});
document.body.appendChild(app.view);
app.stop();

var game = undefined;
var Animations = new Map();

export class Game {

    private hero: Hero;
    private food_spawn: FoodSpawn;
    private food: Array<PIXI.Sprite>;


    public left: KeyInfo;
    public right: KeyInfo;


    constructor() {
        let resources = PIXI.loader.resources;
        this.food_spawn = new FoodSpawn();
        this.food = [];

        let idleAnimation = Animations.get('idle');
        this.hero = new Hero(
            app.view.width/2,
            app.view.height - idleAnimation.height/2,
            idleAnimation
        );
        idleAnimation.play();
        idleAnimation.visible = true;

        this.left = new KeyInfo("ArrowLeft");
        this.left.press = () => {this.leftPress()};
        this.left.release = () => {
            if (!this.right.isDown) {
                this.hero.move(0);
                this.hero.changeSprite(Animations.get('idle'), 0.1);
            }
        }

        this.right = new KeyInfo("ArrowRight");
        this.right.press = () => {this.rightPress()}
        this.right.release = () => {
            if (!this.left.isDown) {
                this.hero.move(0);
                this.hero.changeSprite(Animations.get('idle'), 0.1);
            }
        }        
        app.start();
        app.ticker.add((delta)=>{this.gameLoop(delta);});
    }

    
    public leftPress(): void {
        this.hero.move(-1);
        this.hero.changeSprite(Animations.get('left'), 0.15)
    }


    public rightPress(): void {
        this.hero.move(1);
        this.hero.changeSprite(Animations.get('right'), 0.15)
    }


    private gameLoop(delta: any): void {
        this.hero.update();
        if (this.food_spawn.update()) {
            const new_food_id = Math.round(Math.random() * (FOOD_N-1));

            let new_food = new PIXI.Sprite(PIXI.loader.resources[`/Food/${new_food_id}.png`].texture);
            new_food.scale.set(3);
            new_food.anchor.set(0.5);
            new_food.position.x = Math.random() * app.view.width;
            new_food.position.y = 0;

            app.stage.addChild(new_food);
            this.food.push(new_food);
        }

        for (let i = 0; i < this.food.length; ++i) {
            
            let item = this.food[i];
            
            if (collide2d.collideRectRect(item.getBounds(), this.hero.getBounds())) {
                console.log("ZJADŁEM SOBIE !! :D");
            }

            item.position.y += FOOD_SPEED;
            if (item.position.y + item.height/2 >= app.view.height) {
                console.log("UPADŁO! :(");
                app.stage.removeChild(item);
                this.food.splice(i, 1);
                --i;
            }
        }
    }
}

function getAssetPaths(): Array<String> {
    let paths: Array<String> = [];

    for (let info of frames_info) {
        for (let i = 0; i < info[0]; ++i) {
            paths.push(`/character/${info[1]}_${i}.png`)
        }
    }

    // hardcoded food number
    for (let i = 0; i < FOOD_N; ++i) {
        paths.push(`/Food/${i}.png`);
    }

    return paths;
}

function createAnimatedSprites(): void {
    const resources = PIXI.loader.resources;

    for (let info of frames_info) {
        let textures = [];
        for (let i = 0; i < info[0]; ++i) {
            textures.push(resources[`/character/${info[1]}_${i}.png`].texture);
        }

        let animatedSpr = new PIXI.extras.AnimatedSprite(textures);
    
        animatedSpr.anchor.set(0.5);
        animatedSpr.animationSpeed = 0.1;
        animatedSpr.visible = false;
        Animations.set(info[1], animatedSpr);
        app.stage.addChild(animatedSpr);
    }

}

function runApp():void {
    createAnimatedSprites();
    game = new Game();
}

PIXI.loader
    .add(getAssetPaths())
    .load(runApp)