import * as THREE from "three";
import {ModelObject} from "./modelObject.ts";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

// @ts-ignore
export class Enemy extends ModelObject {
    modelPath = 'src/models/zombie.glb';
    constructor(lanePositions: number[], zPosition: number, scene: any) {
        super();
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf:any) => {
            this.mesh = gltf.scene;  // Модель загружена как сцена
            this.mesh.scale.set(0.4, 0.4, 0.4); // Устанавливаем масштаб, если нужно
            this.mesh.position.set(lanePositions[Math.floor(Math.random() * lanePositions.length)], 0.5, zPosition);
            this.zPosition = zPosition;
            this.mesh.rotation.y = 2 * Math.PI;

            // Добавляем модель в сцену
            scene.add(this.mesh);

            // Если модель имеет анимации, добавляем их
            if (gltf.animations && gltf.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.mesh);
                gltf.animations.forEach((clip:any) => {
                    this.mixer.clipAction(clip).play();
                });
            }
        });
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
}