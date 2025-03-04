import {AnimationMixer, Group, Vector3} from "three";

export abstract class ModelObject {
    protected abstract modelPath: string;
    protected mesh: Group;
    protected zPosition: any;
    protected mixer: AnimationMixer;
    get position(): Vector3 {
        return this.mesh.position;
    }

    update(deltaTime: number) {
        // Обновление анимации, если она существует
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}