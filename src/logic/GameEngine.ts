import * as THREE from 'three';
import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';

export class GameEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private objectManager: ObjectManager;
    private inputManager: InputManager;
    private isPaused: boolean = true;
    private onEnemyDefeated: () => void;

    constructor(
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer,
        onEnemyDefeated: () => void
    ) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.clock = new THREE.Clock();
        this.onEnemyDefeated = onEnemyDefeated;
    }

    setManagers(objectManager: ObjectManager, inputManager: InputManager) {
        this.objectManager = objectManager;
        this.inputManager = inputManager;
    }

    start() {
        this.isPaused = false;
        this.animate();
    }

    pause() {
        this.isPaused = true;
    }

    private animate() {
        if (this.isPaused) return;

        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();

        // Обновление всех объектов
        this.objectManager.getAllObjects().forEach(model => model.update(deltaTime));
        this.objectManager.updateRoads();
        this.objectManager.updateEnemies();
        this.objectManager.updateBullets();
        
        // Проверка коллизий
        const defeatedEnemies = this.objectManager.checkCollisions();
        defeatedEnemies.forEach(() => this.onEnemyDefeated());

        // Обновление ввода
        this.inputManager.update();

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        this.pause();
        this.renderer.dispose();
    }
} 