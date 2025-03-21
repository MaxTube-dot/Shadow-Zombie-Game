export class HostYandexGame {
    private static instance: HostYandexGame;
    private isInitialized: boolean = false;

    private constructor() {
        // Приватный конструктор для паттерна Singleton
    }

    public static getInstance(): HostYandexGame {
        if (!HostYandexGame.instance) {
            HostYandexGame.instance = new HostYandexGame();
        }
        return HostYandexGame.instance;
    }

    public init(): void {
        if (this.isInitialized) return;
        
        console.log('Инициализация Yandex.Games');
        // Здесь можно добавить инициализацию SDK Yandex.Games
        this.isInitialized = true;
    }

    public startLevel(levelNumber: number): void {
        console.log(`Начало уровня ${levelNumber}`);
        // Здесь можно добавить логику для показа рекламы перед началом уровня
        // Например, показать межстраничную рекламу
    }

    public endLevel(levelNumber: number, isSuccess: boolean): void {
        console.log(`Завершение уровня ${levelNumber}, успех: ${isSuccess}`);
        // Здесь можно добавить логику для показа рекламы после завершения уровня
        // Например, показать наградную рекламу за успешное прохождение
    }

    // Дополнительные методы для монетизации

    public onPlayerDeath(): void {
        console.log('Смерть игрока');
        // Показать рекламу продолжения игры
        // Предложить возрождение за просмотр рекламы
    }

    public onGamePause(): void {
        console.log('Игра на паузе');
        // Показать рекламу в паузе
        // Предложить бонусы за просмотр рекламы
    }

    public onAchievementUnlocked(achievementName: string): void {
        console.log(`Получено достижение: ${achievementName}`);
        // Показать рекламу при получении достижения
        // Предложить бонусы за достижение
    }

    public onPowerUpCollected(powerUpType: string): void {
        console.log(`Собран бонус: ${powerUpType}`);
        // Показать рекламу при сборе бонуса
        // Предложить дополнительные бонусы
    }

    public onHighScoreAchieved(score: number): void {
        console.log(`Достигнут новый рекорд: ${score}`);
        // Показать рекламу при достижении нового рекорда
        // Предложить бонусы за рекорд
    }

    public onDailyRewardClaimed(): void {
        console.log('Получена ежедневная награда');
        // Показать рекламу при получении ежедневной награды
        // Предложить дополнительные награды
    }

    public onShopOpened(): void {
        console.log('Открыт магазин');
        // Показать рекламу при открытии магазина
        // Предложить специальные предложения
    }

    public onItemPurchased(itemName: string): void {
        console.log(`Куплен предмет: ${itemName}`);
        // Показать рекламу после покупки
        // Предложить дополнительные предметы
    }

    public onTutorialCompleted(): void {
        console.log('Завершено обучение');
        // Показать рекламу после завершения обучения
        // Предложить бонусы за обучение
    }

    public onSocialShare(): void {
        console.log('Игра поделена в социальных сетях');
        // Предложить бонусы за шеринг
        // Показать рекламу при шеринге
    }
} 