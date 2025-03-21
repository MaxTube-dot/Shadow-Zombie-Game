import { Level } from './level';

export interface LevelStatistics {
    enemiesDefeated: number;
    timeSpent: number;
    accuracy: number;
    totalShots: number;
    successfulShots: number;
}

export class LevelManager {
    private currentLevel: Level;
    private currentLevelNumber: number;
    private statistics: LevelStatistics;
    private startTime: number;
    private totalShots: number = 0;
    private successfulShots: number = 0;
    private readonly MAX_LEVEL = 3; // Максимальное количество уровней

    constructor(initialLevel: number = 1) {
        this.currentLevelNumber = initialLevel;
        this.currentLevel = new Level(initialLevel);
        this.statistics = this.createEmptyStatistics();
        this.startTime = 0;
    }

    startLevel() {
        this.startTime = Date.now();
        this.totalShots = 0;
        this.successfulShots = 0;
        this.statistics = this.createEmptyStatistics();
        this.currentLevel = new Level(this.currentLevelNumber);
    }

    getCurrentLevel(): Level {
        return this.currentLevel;
    }

    getCurrentLevelNumber(): number {
        return this.currentLevelNumber;
    }

    onEnemyDefeated() {
        this.currentLevel.onEnemyDefeated();
        this.statistics.enemiesDefeated++;
        this.successfulShots++;
        this.updateAccuracy();
    }

    onShot() {
        this.totalShots++;
        this.updateAccuracy();
    }

    private updateAccuracy() {
        this.statistics.accuracy = this.totalShots > 0 
            ? (this.successfulShots / this.totalShots) * 100 
            : 0;
        this.statistics.totalShots = this.totalShots;
        this.statistics.successfulShots = this.successfulShots;
    }

    isLevelComplete(): boolean {
        return this.currentLevel.isLevelComplete();
    }

    getLevelProgress(): number {
        return this.currentLevel.getLevelProgress();
    }

    getStatistics(): LevelStatistics {
        this.statistics.timeSpent = (Date.now() - this.startTime) / 1000; // в секундах
        return this.statistics;
    }

    hasNextLevel(): boolean {
        return this.currentLevelNumber < this.MAX_LEVEL;
    }

    nextLevel(): boolean {
        if (!this.hasNextLevel()) {
            return false;
        }
        try {
            this.currentLevelNumber++;
            this.currentLevel = new Level(this.currentLevelNumber);
            return true;
        } catch (error) {
            console.error('Error creating next level:', error);
            return false;
        }
    }

    isGameComplete(): boolean {
        return this.currentLevelNumber >= this.MAX_LEVEL;
    }

    private createEmptyStatistics(): LevelStatistics {
        return {
            enemiesDefeated: 0,
            timeSpent: 0,
            accuracy: 0,
            totalShots: 0,
            successfulShots: 0
        };
    }
} 