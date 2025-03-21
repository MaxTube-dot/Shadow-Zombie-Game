import { Vector3 } from 'three';

export interface LevelConfig {
    spawnEnemyInterval: number;    // Интервал появления врагов
    enemySpeed: number;            // Скорость врагов
    enemyHealth: number;           // Здоровье врагов
    playerShootingInterval: number; // Интервал стрельбы игрока
    bulletSpeed: number;           // Скорость пуль
    roadSpeed: number;             // Скорость движения дороги
    maxEnemies: number;           // Максимальное количество врагов на уровне
    enemiesDefeatedToWin: number;  // Количество врагов для победы
}

export class Level {
    private config: LevelConfig;
    private currentEnemiesDefeated: number = 0;
    private totalEnemiesSpawned: number = 0;

    constructor(levelNumber: number) {
        this.config = this.getLevelConfig(levelNumber);
    }

    private getLevelConfig(levelNumber: number): LevelConfig {
        // Настройки уровней
        const levelConfigs: { [key: number]: LevelConfig } = {
            1: {
                spawnEnemyInterval: 2000,
                enemySpeed: 5,
                enemyHealth: 1,
                playerShootingInterval: 500,
                bulletSpeed: 15,
                roadSpeed: 10,
                maxEnemies: 20,
                enemiesDefeatedToWin: 10
            },
            2: {
                spawnEnemyInterval: 1500,
                enemySpeed: 7,
                enemyHealth: 2,
                playerShootingInterval: 400,
                bulletSpeed: 20,
                roadSpeed: 12,
                maxEnemies: 30,
                enemiesDefeatedToWin: 15
            },
            3: {
                spawnEnemyInterval: 1000,
                enemySpeed: 10,
                enemyHealth: 3,
                playerShootingInterval: 300,
                bulletSpeed: 25,
                roadSpeed: 15,
                maxEnemies: 40,
                enemiesDefeatedToWin: 20
            }
        };

        return levelConfigs[levelNumber] || levelConfigs[1];
    }

    public getConfig(): LevelConfig {
        return this.config;
    }

    public onEnemyDefeated(): void {
        this.currentEnemiesDefeated++;
    }

    public canSpawnEnemy(): boolean {
        return this.totalEnemiesSpawned < this.config.maxEnemies;
    }

    public onEnemySpawned(): void {
        this.totalEnemiesSpawned++;
    }

    public isLevelComplete(): boolean {
        return this.currentEnemiesDefeated >= this.config.enemiesDefeatedToWin;
    }

    public getLevelProgress(): number {
        return (this.currentEnemiesDefeated / this.config.enemiesDefeatedToWin) * 100;
    }
} 