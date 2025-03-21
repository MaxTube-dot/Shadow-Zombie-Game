import * as THREE from "three";
import {ModelObject} from "./modelObject.ts";
import {Vector3} from "three";

export class Player extends ModelObject{
    scaleX: number = 20;
    scaleY: number = 20;
    scaleZ: number = 20;
    rotation: number = Math.PI;
    playerSpeed = 0.1;

    set shootingInterval(value: number) {
        this._shootingInterval = value;
    }

    get shootingInterval(): number {
        return this._shootingInterval;
    }

    isMoving: boolean = false;
    private _shootingInterval: number = 200;


    constructor(lanePositions: number[], targetLane: number, scene: THREE.Scene) {
        super(new Vector3(lanePositions[targetLane], 0.5, 6), scene, "/models/player.glb");
    }

    move(targetLane: number, lanePositions: number[]) {
        if (!this.mesh) return; // Если модель ещё не загружена, ничего не делаем

        debugger;
        const targetX = lanePositions[targetLane];
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, this.playerSpeed);

        if (Math.abs(this.mesh.position.x - targetX) < 0.01) {
            this.mesh.position.x = targetX;
        }
    }
}