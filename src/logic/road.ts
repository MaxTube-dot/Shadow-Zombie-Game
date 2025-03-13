import { ModelObject } from "./modelObject.ts";
import {  Vector3 } from "three";

export class Road extends ModelObject {
    scaleX: number = 8;
    scaleY: number= 8;
    scaleZ: number= 8;
    rotation: number = 2 * Math.PI;
    get roadLen(): number {
        return  193;
    }


    override update(deltaTime: number): void {
        if (this.mesh && this.mesh.position) {
            this.mesh.position.z += 0.1;
            // Обновление анимации, если она существует
            if (this.mixer) {
                this.mixer.update(deltaTime);
            }
        }
    }

    constructor(scene: any, position: Vector3 = new Vector3(0, 0, 0)) {
        super(position, scene, 'public/models/road.glb');
    }
}
