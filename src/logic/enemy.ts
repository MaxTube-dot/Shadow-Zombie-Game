import * as THREE from 'three';
import { ModelObject } from './modelObject.ts';
import {Vector3} from "three";

// @ts-ignore
export class Enemy extends ModelObject {
    private speed: number;
    private health: number;
    public isDied: boolean = false;
   
    scaleX: number = 0.4;
    scaleY: number = 0.4;
    scaleZ: number = 0.4;
    rotation: number = 2 * Math.PI;


    constructor(lanePositions: number[], zPosition: number, scene: THREE.Scene, health: number = 1, speed: number = 5) {
        super(new Vector3(lanePositions[Math.floor(Math.random() * lanePositions.length)], 0.5, zPosition), scene, '/models/zombie.glb');
        this.health = health;
        this.speed = speed;
    }

    update(deltaTime: number) {
        if (this.mesh && this.mesh.position && this.mesh.position.z) {
            this.mesh.position.z += 0.1;
            if (this.mixer) {
                this.mixer.update(deltaTime);
        }
    }
}

    hit() {
        this.health--;
        if (this.health <= 0) {
            this.isDied = true;
        }
    }
}