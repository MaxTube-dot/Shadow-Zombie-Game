import * as THREE from "three";
import {ModelObject} from "./modelObject.ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {Vector3} from "three";
import {Group} from "three";

export class Bullet extends ModelObject {
    protected modelPath = 'src/models/bullet.glb';
    constructor(playerPosition: Vector3, scene: Group) {
        super();
        // Загрузка модели с использованием GLTFLoader
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf:any) => {
            this.mesh = gltf.scene;  // Модель загружена как сцена
            this.mesh.scale.set(10, 10, 10); // Устанавливаем масштаб, если нужно
            this.mesh.position.set(playerPosition.x, playerPosition.y, playerPosition.z - 3);

            // Разворачиваем модель на 180 градусов по оси Y
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

    update() {
        this.mesh.position.z -= 0.1;
    }

    checkCollision(enemy: any) {
        const enemyBox = new THREE.Box3().setFromObject(enemy.mesh);
        const bulletBox = new THREE.Box3().setFromObject(this.mesh);
        return bulletBox.intersectsBox(enemyBox);
    }

    move(targetLane: number, lanePositions: number[], playerSpeed: number): void {
        throw new Error("Method not implemented.");
    }
}