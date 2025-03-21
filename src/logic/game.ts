import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';
import { UIManager } from './UIManager';
import { GameEngine } from './GameEngine';
import { SceneManager } from './SceneManager';
import { LevelManager } from './LevelManager';

export class Game {
    private gameIsStarted: boolean;
    private isPaused: boolean;
    private enemySpawnInterval: number | null;
    private shootingInterval: number | null;
    
    private sceneManager: SceneManager;
    private gameEngine: GameEngine;
    private objectManager: ObjectManager;
    private inputManager: InputManager;
    private uiManager: UIManager;
    private levelManager: LevelManager;
    private lanePositions: number[];

    constructor(initialLevel: number = 1) {
        this.sceneManager = new SceneManager();
        this.lanePositions = [-5, 0, 5];
        this.levelManager = new LevelManager(initialLevel);
        this.isPaused = true;
        this.gameIsStarted = false;
        this.enemySpawnInterval = null;
        this.shootingInterval = null;

        this.initializeManagers();
        this.setupEventListeners();
        this.showLevelMenu();
    }

    private initializeManagers() {
        const scene = this.sceneManager.getScene();
        
        this.objectManager = new ObjectManager(scene, this.lanePositions);
        this.objectManager.createInitialRoads();
        const player = this.objectManager.initializePlayer(1);
        
        this.inputManager = new InputManager(player, 1, this.lanePositions.length, this.lanePositions);
        
        this.gameEngine = new GameEngine(
            scene,
            this.sceneManager.getCamera(),
            this.sceneManager.getRenderer(),
            () => this.onEnemyDefeated()
        );
        this.gameEngine.setManagers(this.objectManager, this.inputManager);

        this.uiManager = new UIManager(
            () => this.startGame(),
            () => this.togglePause(),
            () => this.startNextLevel()
        );
    }

    private setupEventListeners() {
        window.addEventListener('resize', () => this.gameEngine.onWindowResize());
    }

    private showLevelMenu() {
        
        this.uiManager.showLevelMenu(this.levelManager.getCurrentLevelNumber());
    }

    startGame() {
        debugger;
        this.isPaused = false;
        this.levelManager.startLevel();
        this.uiManager.hideAll();
        this.uiManager.showPause();
        this.uiManager.updateLevelProgress(0);
        this.gameEngine.start();
        this.startShooting(this.levelManager.getCurrentLevel().getConfig().playerShootingInterval);

        if (!this.gameIsStarted) {
            this.gameIsStarted = true;
        }

        this.startEnemySpawning();
    }

    private startShooting(interval: number) {
        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
        }

        this.shootingInterval = window.setInterval(() => {
            if (!this.isPaused) {
                const player = this.objectManager.getAllObjects().find(obj => obj.constructor.name === 'Player');
                if (player && player.mesh && player.canShoot()) {
                    this.objectManager.createBullet(player.mesh.position);
                    this.levelManager.onShot();
                }
            }
        }, interval);
    }

    private startEnemySpawning() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }

        this.enemySpawnInterval = window.setInterval(() => {
            if (!this.isPaused && this.levelManager.getCurrentLevel().canSpawnEnemy()) {
                this.spawnEnemy();
            }
        }, this.levelManager.getCurrentLevel().getConfig().spawnEnemyInterval);
    }

    private spawnEnemy() {
        const zPosition = -55;
        const currentLevel = this.levelManager.getCurrentLevel();
        this.objectManager.createEnemy(
            zPosition,
            currentLevel.getConfig().enemyHealth,
            currentLevel.getConfig().enemySpeed
        );
        currentLevel.onEnemySpawned();
    }

    private onEnemyDefeated() {
        this.levelManager.onEnemyDefeated();
        const progress = this.levelManager.getLevelProgress();
        this.uiManager.updateLevelProgress(progress);

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete();
        }
    }

    private onLevelComplete() {
        this.isPaused = true;
        this.gameEngine.pause();
        
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
            this.enemySpawnInterval = null;
        }

        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }

        this.objectManager.clearEnemiesAndBullets();


        debugger;
        const statistics = this.levelManager.getStatistics();
        console.log(`Статистика уровня ${this.levelManager.getCurrentLevelNumber()}:`);
        console.log(`- Побеждено врагов: ${statistics.enemiesDefeated}`);
        console.log(`- Затраченное время: ${statistics.timeSpent.toFixed(2)} сек`);
        console.log(`- Точность: ${statistics.accuracy.toFixed(2)}%`);
        console.log(`- Всего выстрелов: ${statistics.totalShots}`);
        console.log(`- Успешных выстрелов: ${statistics.successfulShots}`);

        if (this.levelManager.isGameComplete()) {
            this.uiManager.showGameComplete(
                this.levelManager.getCurrentLevelNumber(),
                this.levelManager.getStatistics()
            );
        } else {
            debugger;   
            this.uiManager.showLevelComplete(
                this.levelManager.getCurrentLevelNumber(),
                this.levelManager.getStatistics()
            );
        }
    }

    private startNextLevel() {
        debugger;
        if (this.levelManager.hasNextLevel()) {
            const success = this.levelManager.nextLevel();
            if (success) {
                this.resetGameState();
                this.showLevelMenu();
            } else {
                console.error('Failed to start next level');
                this.uiManager.showError('Не удалось загрузить следующий уровень');
            }
        }
    }

    private resetGameState() {
        this.isPaused = true;
        
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
            this.enemySpawnInterval = null;
        }
        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }

        this.objectManager.clearEnemiesAndBullets();

        this.objectManager.createInitialRoads();
        const player = this.objectManager.initializePlayer(1);
        
        this.inputManager = new InputManager(player, 1, this.lanePositions.length, this.lanePositions);
        this.gameEngine.setManagers(this.objectManager, this.inputManager);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.gameEngine.pause();
            this.uiManager.showPauseMenu();
        } else {
            this.uiManager.hideAll();
            this.uiManager.showPause();
            this.uiManager.updateLevelProgress(this.levelManager.getLevelProgress());
            this.gameEngine.start();
        }
    }

    dispose() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }
        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
        }
        
        this.inputManager.dispose();
        this.objectManager.dispose();
        this.uiManager.dispose();
        this.gameEngine.dispose();
        this.sceneManager.dispose();
    }
}
