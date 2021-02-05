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
var FOOD_SPEED = 2;
const LIFES = 10;

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
    private score: number;
    private lifes: number;
    private state: any;
    private game_over: boolean;

    public left: KeyInfo;
    public right: KeyInfo;



    constructor() {
        this.game_over = false;
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
        this.lifes = LIFES;
        document.getElementById('lifes').innerHTML = `Lifes: ${this.lifes}`;

        this.score = 0;
        document.getElementById('score').innerHTML = `Score: ${this.score}`;
        document.getElementById('speed').innerHTML = `Stage: ${FOOD_SPEED-2}`;

        app.start();
        this.state = (delta:any) => {this.playLoop(delta);};
        app.ticker.add((delta)=>{this.gameLoop(delta);});
        this.IncrementSpeed();
    }

    private IncrementSpeed(): void {
        if (this.game_over)
            return;
        FOOD_SPEED++;
        this.hero.incrementSpeed();
        this.food_spawn.incrementSpeed();
        document.getElementById('speed').innerHTML = `Stage: ${FOOD_SPEED-2}`;
        setTimeout(()=>{this.IncrementSpeed();}, 10000);
    }
    
    public leftPress(): void {
        this.hero.move(-1);
        this.hero.changeSprite(Animations.get('left'), 0.15)
    }


    public rightPress(): void {
        this.hero.move(1);
        this.hero.changeSprite(Animations.get('right'), 0.15)
    }

    private playLoop(delta: any): void {
        this.hero.update(app.view.width);
        if (this.food_spawn.update()) {
            const new_food_id = Math.round(Math.random() * (FOOD_N-1));

            let new_food = new PIXI.Sprite(PIXI.loader.resources[`/Food/${new_food_id}.png`].texture);
            new_food.scale.set(3);
            new_food.anchor.set(0.5);
            new_food.position.x = (Math.random() * app.view.width * 0.6) + app.view.width * 0.2;
            new_food.position.y = 0;

            app.stage.addChild(new_food);
            this.food.push(new_food);
        }

        for (let i = 0; i < this.food.length; ++i) {
            
            let item = this.food[i];
            
            if (collide2d.collideRectRect(item.getBounds(), this.hero.getBounds())) {
                this.score += 1;
                document.getElementById('score').innerHTML = `Score: ${this.score}`;
                app.stage.removeChild(item);
                this.food.splice(i, 1);
                --i;
                continue;
            }
            
            item.position.y += FOOD_SPEED;
            if (item.position.y + item.height/2 >= app.view.height) {
                this.lifes -= 1;
                if (this.lifes <= 0) {
                    this.game_over = true;
                    this.state = (delta:any) => {this.finish(delta);};
                    this.left.unsubscribe();
                    this.right.unsubscribe();
                    
                    document.getElementById('lifes').innerHTML = `Lifes: ${this.lifes}`;
                                        
                    let end_info = document.getElementById('gameOver');
                    end_info.innerHTML = `Game Over`;
                    end_info.classList.add('show');
                    end_info.classList.add('showFromShadow');
                    setTimeout(()=>{document.getElementById('gameOver').classList.remove('showFromShadow');}, 1000);

                    document.getElementById('gameOverInfo').classList.add('show');
                    document.getElementById('gameOverInfo').classList.add('showFromShadow');
                    setTimeout(()=>{document.getElementById('gameOverInfo').classList.remove('showFromShadow');}, 1000);
                    break;
                }
                document.getElementById('lifes').innerHTML = `Lifes: ${this.lifes}`;
                app.stage.removeChild(item);
                this.food.splice(i, 1);
                --i;
            }
        }        
    }

    private finish(delta:any) {
        return;
    }

    private gameLoop(delta: any): void {
        this.state(delta);
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