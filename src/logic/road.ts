import { ModelObject } from "./modelObject.ts";
import { Box3, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class Road extends ModelObject {
    static modelCache: any;
    get roadLen(): number {
        return this._roadLen;
    }

    private _roadLen: number;
    protected modelPath = 'src/models/road.fbx';

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
        super();
        this.loadModel().then(model => this.init(scene, position, model) );
    }

    // Метод для загрузки модели асинхронно
    private async loadModel(): Promise<any> {
        try {
            const model = await this.loadFBX();
            return model;
        } catch (error) {
            console.error('Ошибка при загрузке модели:', error);
        }
    }

    // Асинхронная загрузка модели через Promise
    private loadFBX(): Promise<any> {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader();
            fbxLoader.load(
                this.modelPath,
                (object: any) => resolve(object),
                undefined,  // Прогресс-обработчик можно добавить сюда
                (error) => reject(error)  // Обработчик ошибок
            );
        });
    }

    private init(scene: any, position: Vector3, object: any) {
        this.mesh = object;
        this.mesh.scale.set(0.08, 0.08, 0.08); // Устанавливаем масштаб
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.rotation.y = 2 * Math.PI;

        // Вычисление длины модели через Bounding Box
        const box = new Box3().setFromObject(this.mesh); // Получаем bounding box модели
        const size = new Vector3();
        box.getSize(size); // Получаем размер модели (ширина, высота, глубина)

        this._roadLen = size.z;  // Длина модели по оси Z
        scene.add(this.mesh);
    }
}
