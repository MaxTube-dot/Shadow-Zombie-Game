import * as THREE from 'three';
import {Player} from "./player.ts";
import {Bullet} from "./bullet.ts";
import {Enemy} from "./enemy.ts";
import {Road} from "./road.ts";
import {Vector3} from "three";
import {ModelObject} from "./modelObject.ts";

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private spawnEneemyStart: number;
    private gameIsStarted: boolean;
    private isPaused: boolean;
    private lanePositions: number[];
    private targetLane: number;
    private bullets: any[];
    private enemies: Enemy[];
    private clock: THREE.Clock;
    private player: Player;
    private roads: Road[];


    get Models() {
        let objects: ModelObject[] = [
            ...this.roads,
            ...this.enemies,
            ...this.bullets,
        ];
        objects.push(this.player)
        return objects;
    };



    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.set(0, 20, 15);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.spawnEneemyStart = 55;
        this.lanePositions = [-5, 0, 5];
        this.targetLane = 1;
        this.bullets = [];
        this.roads = [];
        this.enemies = [];
        this.isPaused = true;
        this.gameIsStarted = false;


        this.clock = new THREE.Clock();
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 10, 10);
        this.scene.add(light);

        this.createInitialRoads();

        // Передаем сцену в конструктор игрока
        this.player = new Player(this.lanePositions, this.targetLane, this.scene);

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (event) => this.onKeyDown(event));

        this.setupUI();


    }


    setupUI() {
        this.showStart();
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

    startGame() {
        this.isPaused = false;
        this.showPause();
        this.hideStartMenu();
        this.animate();
        this.startShooting(this.player.shootingInterval);


        if (!this.gameIsStarted) {
            this.gameIsStarted = true;
        }

        setInterval(() => {
            this.spawnEnemy();
        }, 1000);
    }


    startShooting(interval: number) {
        setTimeout(() => {
            const bullet = new Bullet(this.player.mesh.position,  this.scene);
            this.bullets.push(bullet);
            this.startShooting(this.player.shootingInterval)
        }, interval);
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

    hidePauseMenu() {
        const pauseMenu = document.getElementById('pauseButton');
        if (pauseMenu) pauseMenu.remove();
    }

    hideStartMenu() {
        const pauseMenu = document.getElementById('startButton');
        if (pauseMenu) pauseMenu.remove();
    }

    createInitialRoads() {
        this.roads.push(new Road(this.scene));
    }


    spawnEnemy() {
        const zPosition = -this.spawnEneemyStart;
        const enemy = new Enemy(this.lanePositions, zPosition, this.scene);
        this.enemies.push(enemy);

    }

    animate() {
        if (this.isPaused) return;

        requestAnimationFrame(() => this.animate());
        const deltaTime = this.clock.getDelta();
        this.Models.forEach(model => model.update(deltaTime))


        this.roads = this.roads.filter(road =>{
          if (road && road.position && road.position.z < 200)
              return true;

            return road && !road.position;
        });


        const lastRoad = this.roads[this.roads.length - 1];
        if (lastRoad && lastRoad.position && lastRoad.position.z >= 20) {
            const newRoad = new Road(this.scene, new Vector3(lastRoad.position.x, lastRoad.position.y, lastRoad.position.z -  lastRoad.roadLen) );
            this.roads.push(newRoad);
        }

        // Обновляем и проверяем врагов
        this.enemies.forEach((enemy, index) => {

            // Удаляем врагов, которые вышли за экран
            if (enemy && enemy.mesh && enemy.mesh.position.z > 50) {
                this.scene.remove(enemy.mesh);
                this.enemies.splice(index, 1);
            }

            // Проверка на столкновение с пулями
            this.bullets.forEach((bullet, bulletIndex) => {
                if (bullet.checkCollision(enemy)) {
                    this.scene.remove(bullet.mesh);
                    this.bullets.splice(bulletIndex, 1);
                    enemy.hit();
                    if (enemy.isDied){
                        this.scene.remove(enemy.mesh);
                        this.enemies.splice(index, 1);
                    }
                }
            });
        });

        // Обновляем пули
        this.bullets.forEach((bullet, index) => {
            if (bullet.mesh.position.z < -65) {
                this.scene.remove(bullet.mesh);
                this.bullets.splice(index, 1);
            }
        });

        // Обновление игрока
        if (this.player.isMoving) {
            this.player.move(this.targetLane, this.lanePositions);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onKeyDown(event: any) {

        if ((event.code === 'ArrowLeft' || event.code === "KeyA") && this.targetLane > 0) {
            this.targetLane--;
            this.player.isMoving = true;
        }
        if ((event.code === 'ArrowRight' || event.code === "KeyD") && this.targetLane < this.lanePositions.length - 1) {
            this.targetLane++;
            this.player.isMoving = true;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}