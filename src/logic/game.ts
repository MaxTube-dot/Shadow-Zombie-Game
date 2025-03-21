import * as THREE from 'three';
import { Level } from "./level";
import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';

export class Game {
    private scene: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private level: Level;
    private gameIsStarted: boolean;
    private isPaused: boolean;
    private enemySpawnInterval: NodeJS.Timeout | null;
    
    private objectManager: ObjectManager;
    private inputManager: InputManager;
    private lanePositions: number[];

    constructor(levelNumber: number = 1) {
        this.scene = new THREE.Scene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        
        this.lanePositions = [-5, 0, 5];
        this.clock = new THREE.Clock();
        this.level = new Level(levelNumber);
        this.isPaused = true;
        this.gameIsStarted = false;
        this.enemySpawnInterval = null;

        this.objectManager = new ObjectManager(this.scene, this.lanePositions);
        this.objectManager.createInitialRoads();
        const player = this.objectManager.initializePlayer(1);
        this.inputManager = new InputManager(player, 1, this.lanePositions.length, this.lanePositions);

        window.addEventListener('resize', () => this.onWindowResize());
        this.setupUI();
    }

    private setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.set(0, 20, 15);
        this.camera.lookAt(0, 0, 0);
    }

    private setupRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    private setupLighting() {
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(0, 30, 20);
        mainLight.target.position.set(0, 0, -20);
        this.scene.add(mainLight);
        this.scene.add(mainLight.target);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }

    startGame() {
        this.isPaused = false;
        this.showPause();
        this.hideStartMenu();
        this.animate();
        this.startShooting(this.level.getConfig().playerShootingInterval);

        if (!this.gameIsStarted) {
            this.gameIsStarted = true;
        }

        this.startEnemySpawning();
    }

    private startShooting(interval: number) {
        setTimeout(() => {
            if (!this.isPaused) {
                const player = this.objectManager.getAllObjects().find(obj => obj.constructor.name === 'Player');
                if (player && player.mesh) {
                    this.objectManager.createBullet(player.mesh.position);
                }
                this.startShooting(this.level.getConfig().playerShootingInterval);
            }
        }, interval);
    }

    private startEnemySpawning() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }

        this.enemySpawnInterval = setInterval(() => {
            if (!this.isPaused && this.level.canSpawnEnemy()) {
                this.spawnEnemy();
            }
        }, this.level.getConfig().spawnEnemyInterval);
    }

    private spawnEnemy() {
        const zPosition = -55;
        this.objectManager.createEnemy(
            zPosition,
            this.level.getConfig().enemyHealth,
            this.level.getConfig().enemySpeed
        );
        this.level.onEnemySpawned();
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

    private onEnemyDefeated() {
        this.level.onEnemyDefeated();
        this.updateLevelProgress();

        if (this.level.isLevelComplete()) {
            this.onLevelComplete();
        }
    }

    private onLevelComplete() {
        this.isPaused = true;
        alert('Уровень пройден!');
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }
        
        this.inputManager.dispose();
        this.objectManager.dispose();
        
        const progress = document.getElementById('levelProgress');
        if (progress) {
            progress.parentElement?.remove();
        }
        
        this.renderer.dispose();
    }

    setupUI() {
        this.showStart();
        this.updateLevelProgress();
    }

    showPause() {
        const pauseButton = document.createElement('button');
        pauseButton.innerText = 'Пауза';
        pauseButton.style.position = 'absolute';
        pauseButton.style.top = '10px';
        pauseButton.style.left = '10px';
        pauseButton.style.fontSize = '18px';
        pauseButton.style.padding = '10px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.id = 'pauseButton';
        pauseButton.onclick = () => this.togglePause();
        document.body.appendChild(pauseButton);
    }

    
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showStart()
            this.hidePauseMenu()
        } else {
            this.hideStartMenu();
            this.showPause();
            this.animate();
        }
    }

    hideStartMenu() {
        const pauseMenu = document.getElementById('startButton');
        if (pauseMenu) pauseMenu.remove();
    }


    hidePauseMenu() {
        const pauseMenu = document.getElementById('pauseButton');
        if (pauseMenu) pauseMenu.remove();
    }

    showStart() {
        const startButton = document.createElement('button');
        startButton.innerText = 'Начать игру';
        startButton.style.position = 'absolute';
        startButton.style.top = '50%';
        startButton.style.left = '50%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.fontSize = '20px';
        startButton.style.padding = '10px';
        startButton.style.cursor = 'pointer';
        startButton.id = 'startButton';
        startButton.onclick = () => this.startGame();
        document.body.appendChild(startButton);
    }

    updateLevelProgress() {
        const progress = document.getElementById('levelProgress') || this.createProgressElement();
        progress.style.width = `${this.level.getLevelProgress()}%`;
    }

    createProgressElement(): HTMLElement {
        const progressContainer = document.createElement('div');
        progressContainer.style.position = 'absolute';
        progressContainer.style.top = '10px';
        progressContainer.style.right = '10px';
        progressContainer.style.width = '200px';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = '#333';
        progressContainer.style.border = '2px solid #fff';

        const progress = document.createElement('div');
        progress.id = 'levelProgress';
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.backgroundColor = '#4CAF50';
        progress.style.transition = 'width 0.3s';

        progressContainer.appendChild(progress);
        document.body.appendChild(progressContainer);
        return progress;
    }


}