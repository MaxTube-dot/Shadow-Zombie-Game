import * as THREE from 'three';
import {Player} from "./player.ts";
import {Bullet} from "./bullet.ts";
import {Enemy} from "./enemy.ts";
import {RoadSegment} from "./roadSegment.ts";
import {Road} from "./road.ts";

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private roadWidth: number;
    private roadLength: number;
    private numSegments: number;
    private gameIsStarted: boolean;
    private isPaused: boolean;
    private lanePositions: number[];
    private playerSpeed: number;
    private targetLane: number;
    private roadSegments: RoadSegment[];
    private bullets: any[];
    private enemies: Enemy[];
    private clock: THREE.Clock;
    private player: Player;
    private roads: Road[];


    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.set(0, 20, 15);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.roadWidth = 4.9;
        this.roadLength = 150;
        this.numSegments = 3;
        this.lanePositions = [-5, 0, 5];
        this.playerSpeed = 0.1;
        this.targetLane = 1;
        this.roadSegments = [];
        this.bullets = [];
        this.roads = [];
        this.enemies = [];
        this.isPaused = true;
        this.gameIsStarted = false;


        this.clock = new THREE.Clock();
        this.init();

        // Спавним врагов каждую секунду
        setInterval(() => {
            this.spawnEnemy();
        }, 1000);
    }

    init() {
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


        if (!this.gameIsStarted) {
            this.gameIsStarted = true;
        }
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
        for (let laneIndex = 0; laneIndex < this.lanePositions.length; laneIndex++) {
            for (let i = 0; i < this.numSegments; i++) {
                this.createRoadSegment(laneIndex, -this.roadLength * i);
            }

        }
        this.roads.push(new Road(this.scene));
    }

       createRoadSegment(laneIndex:number, zPosition:number) {
        const roadSegment = new RoadSegment(this.lanePositions, laneIndex, zPosition, this.roadWidth, this.roadLength, this.scene);
        this.roadSegments.push(roadSegment);
    }

    spawnEnemy() {
        const zPosition = -this.roadLength;
        const enemy = new Enemy(this.lanePositions, zPosition, this.scene);
        this.enemies.push(enemy);
    }

    animate() {
        if (this.isPaused) return;

        requestAnimationFrame(() => this.animate());

        // Получаем время, прошедшее с последнего кадра
        const deltaTime = this.clock.getDelta();

        // Обновляем анимации игрока
        if (this.player) {
            this.player.update(deltaTime);
        }


        this.roads = this.roads.filter(road => road && road.position && road.position.z < 170 );
        this.roads.forEach((road) => {
            debugger
            road.update(deltaTime);
        })
        // Обновляем и проверяем врагов
        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime);

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
                    this.scene.remove(enemy.mesh);
                    this.enemies.splice(index, 1);
                }
            });
        });

        // Обновляем пули
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.mesh.position.z < -65) {
                this.scene.remove(bullet.mesh);
                this.bullets.splice(index, 1);
            }
        });

        // Обновление игрока
        if (this.player.isMoving) {
            this.player.move(this.targetLane, this.lanePositions, this.playerSpeed);
        }

        this.renderer.render(this.scene, this.camera);
    }

    shoot() {
        const bullet = new Bullet(this.player.mesh.position,  this.scene);
        this.bullets.push(bullet);
    }

    onKeyDown(event) {
        if (event.code === 'Space') {
            this.shoot();
        }
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