import * as THREE from 'three';
import { ModelObject } from './modelObject';
import { Enemy } from './enemy';
import { Bullet } from './bullet';
import { Road } from './road';
import { Player } from './player';
import { Vector3 } from 'three';

export class ObjectManager {
    private scene: THREE.Scene;
    private roads: Road[] = [];
    private enemies: Enemy[] = [];
    private bullets: Bullet[] = [];
    private player: Player;
    private lanePositions: number[];

    constructor(scene: THREE.Scene, lanePositions: number[]) {
        this.scene = scene;
        this.lanePositions = lanePositions;
    }

    initializePlayer(targetLane: number): Player {
        this.player = new Player(this.lanePositions, targetLane, this.scene);
        return this.player;
    }

    createInitialRoads() {
        this.roads.push(new Road(this.scene));
    }

    updateRoads() {
        this.roads = this.roads.filter(road => {
            if (road && road.position && road.position.z < 200)
                return true;
            return road && !road.position;
        });

        const lastRoad = this.roads[this.roads.length - 1];
        if (lastRoad && lastRoad.position && lastRoad.position.z >= 20) {
            const newRoad = new Road(
                this.scene, 
                new Vector3(lastRoad.position.x, lastRoad.position.y, lastRoad.position.z - lastRoad.roadLen)
            );
            this.roads.push(newRoad);
        }
    }

    createBullet(playerPosition: THREE.Vector3) {
        const bullet = new Bullet(playerPosition, this.scene);
        this.bullets.push(bullet);
        return bullet;
    }

    createEnemy(zPosition: number, health: number, speed: number) {
        const enemy = new Enemy(this.lanePositions, zPosition, this.scene, health, speed);
        this.enemies.push(enemy);
        return enemy;
    }

    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            if (enemy && enemy.mesh && enemy.mesh.position.z > 50) {
                this.removeEnemy(index);
            }
        });
    }

    updateBullets() {
        this.bullets.forEach((bullet, index) => {
            if (bullet.mesh.position.z < -65) {
                this.removeBullet(index);
            }
        });
    }

    checkCollisions(): Enemy[] {
        const defeatedEnemies: Enemy[] = [];
        
        this.enemies.forEach((enemy, enemyIndex) => {
            this.bullets.forEach((bullet, bulletIndex) => {
                if (bullet.checkCollision(enemy)) {
                    this.removeBullet(bulletIndex);
                    enemy.hit();
                    if (enemy.isDied) {
                        this.removeEnemy(enemyIndex);
                        defeatedEnemies.push(enemy);
                    }
                }
            });
        });

        return defeatedEnemies;
    }

    private removeEnemy(index: number) {
        const enemy = this.enemies[index];
        if (enemy && enemy.mesh) {
            this.scene.remove(enemy.mesh);
            this.enemies.splice(index, 1);
        }
    }

    private removeBullet(index: number) {
        const bullet = this.bullets[index];
        if (bullet && bullet.mesh) {
            this.scene.remove(bullet.mesh);
            this.bullets.splice(index, 1);
        }
    }

    getAllObjects(): ModelObject[] {
        return [...this.roads, ...this.enemies, ...this.bullets, this.player];
    }

    dispose() {
        [...this.roads, ...this.enemies, ...this.bullets, this.player].forEach(object => {
            if (object && object.mesh) {
                this.scene.remove(object.mesh);
            }
        });
    }
} 