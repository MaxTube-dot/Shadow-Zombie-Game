import * as THREE from "three";
import {ModelObject} from "./modelObject.ts";
import {Vector3} from "three";


export class Bullet extends ModelObject {
    scaleX: number = 20;
    scaleY: number = 20;
    scaleZ: number = 20;
    rotation: number = 2 * Math.PI;


    constructor(playerPosition: Vector3, scene: THREE.Scene) {
        super(new Vector3(playerPosition.x, playerPosition.y, playerPosition.z - 3), scene, '/models/bullet.glb');
    }

    update() {
        if (this.mesh && this.mesh.position && this.mesh.position.z){
            this.mesh.position.z -= 0.1;
        }
    }

    checkCollision(enemy: any) {
        const enemyBox = new THREE.Box3().setFromObject(enemy.mesh);
        const bulletBox = new THREE.Box3().setFromObject(this.mesh);
        return bulletBox.intersectsBox(enemyBox);
    }

}