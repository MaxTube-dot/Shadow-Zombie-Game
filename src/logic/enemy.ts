import {ModelObject} from "./modelObject.ts";
import {Vector3} from "three";

// @ts-ignore
export class Enemy extends ModelObject {
    scaleX: number = 0.4;
    scaleY: number = 0.4;
    scaleZ: number = 0.4;
    rotation: number = 2 * Math.PI;


    get health(): number {
        return this._health;
    }

    get isDied(): boolean {
        return this._health <= 0;
    }


    modelPath = '';
    private _health = 4;
    constructor(lanePositions: number[], zPosition: number, scene: any) {
        super(new Vector3(lanePositions[Math.floor(Math.random() * lanePositions.length)], 0.5, zPosition), scene, "public/models/zombie.glb");
    }

    update(deltaTime: number) {
        if (this.mesh && this.mesh.position && this.mesh.position.z) {
            this.mesh.position.z += 0.1;
            // Обновление анимации, если она существует
            if (this.mixer) {
                this.mixer.update(deltaTime);
            }
        }
    }

    hit(){
        this._health--;
    }
}