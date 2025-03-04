import {ModelObject} from "./modelObject.ts";
import {Vector3} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

export class Road extends ModelObject {

    protected modelPath = 'src/models/road.fbx';

    override update(deltaTime: number): void {
        debugger;
        if (this.mesh && this.mesh.position) {
            this.mesh.position.z += 0.1;
            // Обновление анимации, если она существует
            if (this.mixer) {
                this.mixer.update(deltaTime);
            }
        }
    }

    constructor(scene: any, position: Vector3 = new Vector3(0, 0, 0)) {
        super();
        const fbxLoader = new FBXLoader();
        fbxLoader.load(this.modelPath
            ,
            (object: any) => {
                this.mesh = object;  // Модель загружена как объект

                this.mesh.scale.set(0.08, 0.08, 0.08); // Устанавливаем масштаб
                this.mesh.position.set(position.x, position.y, position.z);
                this.mesh.rotation.y = 2 * Math.PI;

                // Добавляем модель в сцену
                scene.add(this.mesh);
            }
        )
    }
}