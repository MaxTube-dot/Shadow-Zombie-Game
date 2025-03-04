import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import * as THREE from "three";
import {ModelObject} from "./modelObject.ts";

export class Player extends ModelObject{
    modelPath: string = "src/models/player.glb";
    private targetLane: any;
    private isMoving: boolean;
    constructor(lanePositions: number[], targetLane: number, scene: any) {
        super();
        // Загрузка модели с использованием GLTFLoader
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf:any) => {
            this.mesh = gltf.scene;  // Модель загружена как сцена
            this.mesh.scale.set(20, 20, 20); // Устанавливаем масштаб, если нужно
            this.mesh.position.set(lanePositions[targetLane], 0.5, 6); // Устанавливаем позицию
            this.targetLane = targetLane;
            this.isMoving = false;

            // Разворачиваем модель на 180 градусов по оси Y
            this.mesh.rotation.y = Math.PI;

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

    move(targetLane: number, lanePositions: number[], playerSpeed:number) {
        if (!this.mesh) return; // Если модель ещё не загружена, ничего не делаем

        this.targetLane = targetLane;
        this.isMoving = true;
        const targetX = lanePositions[targetLane];
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, playerSpeed);

        if (Math.abs(this.mesh.position.x - targetX) < 0.01) {
            this.mesh.position.x = targetX;
            this.isMoving = false;
        }
    }
}

