import { HostYandexGame } from './HostYandexGame';

export class AchievementManager {
    private static instance: AchievementManager;
    private hostGame: HostYandexGame;
    private achievements: Map<string, boolean> = new Map();
    private highScore: number = 0;

    private constructor() {
        this.hostGame = HostYandexGame.getInstance();
    }

    public static getInstance(): AchievementManager {
        if (!AchievementManager.instance) {
            AchievementManager.instance = new AchievementManager();
        }
        return AchievementManager.instance;
    }

    public checkAchievements(levelNumber: number, enemiesDefeated: number, accuracy: number): void {
        // Проверка достижений
        if (levelNumber === 1 && enemiesDefeated >= 3) {
            this.unlockAchievement('first_level_complete');
        }

        if (accuracy >= 80) {
            this.unlockAchievement('sharpshooter');
        }

        if (enemiesDefeated >= 50) {
            this.unlockAchievement('zombie_hunter');
        }

        // Проверка рекорда
        if (enemiesDefeated > this.highScore) {
            this.highScore = enemiesDefeated;
            this.hostGame.onHighScoreAchieved(this.highScore);
        }
    }

    private unlockAchievement(achievementName: string): void {
        if (!this.achievements.get(achievementName)) {
            this.achievements.set(achievementName, true);
            this.hostGame.onAchievementUnlocked(achievementName);
        }
    }

    public getAchievementName(achievementName: string): string {
        const achievementNames: { [key: string]: string } = {
            'first_level_complete': 'Первый уровень пройден',
            'sharpshooter': 'Меткий стрелок',
            'zombie_hunter': 'Охотник на зомби'
        };
        return achievementNames[achievementName] || achievementName;
    }

    public getHighScore(): number {
        return this.highScore;
    }
} 