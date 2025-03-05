import {AnimationMixer, Group, Vector3} from "three";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

export abstract class ModelObject {
    // @ts-ignore
    public mesh: Group;
    // @ts-ignore
    protected mixer: AnimationMixer;
    abstract scaleX: number;
    abstract scaleY: number;
    abstract scaleZ: number;
    abstract rotation: number;


    constructor(position: Vector3, scene: THREE.Scene, modelPath: string) {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf:any) => {
        this.mesh = gltf.scene;  // Модель загружена как сцена
        this.mesh.scale.set(this.scaleX, this.scaleY, this.scaleZ); // Устанавливаем масштаб, если нужно
        this.mesh.position.set(position.x, position.y, position.z); // Устанавливаем позицию

        // Разворачиваем модель на 180 градусов по оси Y
        this.mesh.rotation.y = this.rotation;

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

    protected zPosition: any;

    get position(): Vector3 | undefined {
        if (!this.mesh || !this.mesh.position) {
            return undefined;
        }

        return this.mesh.position;
    }

    update(deltaTime: number) {
        // Обновление анимации, если она существует
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    isDead()
    {
        if (this.mesh
            && this.mesh.position
            && (this.mesh.position.z < -300 || this.mesh.position.z > 300)) {
            return true;
        }

        return false;
    };
}