import * as PIXI from 'pixi.js'
import {Hero} from './hero'

export class Game {

    public app: PIXI.Application
    private hero: Hero

    constructor() {
        this.hero = new Hero(2, 10);
        console.log("hero:", this.hero.getPos());

        this.app = new PIXI.Application({
            width: window.innerWidth-20, 
            height: window.innerHeight-20,                       
            antialias: true, 
            transparent: false, 
            resolution: 1
        });

        document.body.appendChild(this.app.view);

        PIXI.loader
            .add(this.getAssetPaths())
            .load(StartGame)
    }

    getAssetPaths(): Array<String> {
        let paths: Array<String> = [];

        // [framesInAnimation, AnimationName]
        const frames_info = [
            [4, 'idle'],
            [6, 'left'],
            [6, 'right'],
            [3, 'slice_left'],
            [3, 'slice_right']
        ];

        for (let info of frames_info) {
            for (let i = 0; i < info[0]; ++i) {
                paths.push(`/character/${info[1]}_${i}.png`)
            }
        }

        return paths;
    }

}

function StartGame(): void {
    console.log("Game Start");
    console.log("resources:", PIXI.loader.resources);
    console.log('g', g);
    let idel0 = new PIXI.Sprite(PIXI.loader.resources["/character/idle_0.png"].texture);

    //Add the cat to the stage
    g.app.stage.addChild(idel0);
}

const g = new Game();
