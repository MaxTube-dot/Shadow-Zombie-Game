import { LevelStatistics } from './LevelManager';

export class UIManager {
    private onStartGame: () => void;
    private onPauseGame: () => void;
    private onNextLevel: () => void;
    private uiContainer: HTMLElement;

    constructor(onStartGame: () => void, onPauseGame: () => void, onNextLevel: () => void) {
        this.onStartGame = onStartGame;
        this.onPauseGame = onPauseGame;
        this.onNextLevel = onNextLevel;
        this.uiContainer = this.createUIContainer();
    }

    private createUIContainer(): HTMLElement {
        let container = document.getElementById('gameUIContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gameUIContainer';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.pointerEvents = 'none'; // Позволяет кликам проходить сквозь контейнер
            container.style.zIndex = '9998'; // Высокий z-index для всего UI
            document.body.appendChild(container);
            console.log('UI container created and appended to body');
        }
        return container;
    }

    showLevelMenu(levelNumber: number) {
        this.hideAll();
        let menuContainer = document.getElementById('levelMenu');
        if (!menuContainer) {
            menuContainer = document.createElement('div');
            menuContainer.id = 'levelMenu';
            menuContainer.style.position = 'absolute';
            menuContainer.style.top = '50%';
            menuContainer.style.left = '50%';
            menuContainer.style.transform = 'translate(-50%, -50%)';
            menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            menuContainer.style.padding = '20px';
            menuContainer.style.borderRadius = '10px';
            menuContainer.style.color = 'white';
            menuContainer.style.textAlign = 'center';
            menuContainer.style.pointerEvents = 'auto';

            const title = document.createElement('h2');
            title.innerText = `Уровень ${levelNumber}`;
            title.style.marginBottom = '20px';

            const startButton = document.createElement('button');
            startButton.innerText = 'Начать уровень';
            startButton.style.padding = '10px 20px';
            startButton.style.fontSize = '18px';
            startButton.style.cursor = 'pointer';
            startButton.style.backgroundColor = '#4CAF50';
            startButton.style.border = 'none';
            startButton.style.borderRadius = '5px';
            startButton.style.color = 'white';
            startButton.style.pointerEvents = 'auto';
            startButton.onclick = () => this.onStartGame();

            menuContainer.appendChild(title);
            menuContainer.appendChild(startButton);
            this.uiContainer.appendChild(menuContainer);
        } else {
            // Обновляем существующий элемент
            const title = menuContainer.querySelector('h2');
            if (title) {
                title.innerText = `Уровень ${levelNumber}`;
            }
            menuContainer.style.display = 'block';
        }
    }

    showLevelComplete(levelNumber: number, stats: LevelStatistics) {
        console.log('showLevelComplete начал выполнение');
        this.hideAll();
        let menuContainer = document.getElementById('levelCompleteMenu');
        if (!menuContainer) {
            console.log('Создаем новый контейнер меню');
            menuContainer = document.createElement('div');
            menuContainer.id = 'levelCompleteMenu';
            menuContainer.style.position = 'absolute';
            menuContainer.style.top = '50%';
            menuContainer.style.left = '50%';
            menuContainer.style.transform = 'translate(-50%, -50%)';
            menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            menuContainer.style.padding = '20px';
            menuContainer.style.borderRadius = '10px';
            menuContainer.style.color = 'white';
            menuContainer.style.textAlign = 'center';
            menuContainer.style.zIndex = '9999';
            menuContainer.style.minWidth = '300px';
            menuContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            menuContainer.style.pointerEvents = 'auto';

            const title = document.createElement('h2');
            title.innerText = `Уровень ${levelNumber} пройден!`;
            title.style.marginBottom = '20px';
            title.style.fontSize = '24px';

            const statsContainer = document.createElement('div');
            statsContainer.style.marginBottom = '20px';
            statsContainer.style.fontSize = '18px';
            statsContainer.innerHTML = `
                <p>Время: ${Math.round(stats.timeSpent)} сек.</p>
                <p>Уничтожено врагов: ${stats.enemiesDefeated}</p>
                <p>Точность: ${Math.round(stats.accuracy)}%</p>
                <p>Выстрелов: ${stats.totalShots}</p>
                <p>Попаданий: ${stats.successfulShots}</p>
            `;

            const nextButton = document.createElement('button');
            nextButton.innerText = 'Следующий уровень';
            nextButton.style.padding = '10px 20px';
            nextButton.style.fontSize = '18px';
            nextButton.style.cursor = 'pointer';
            nextButton.style.backgroundColor = '#4CAF50';
            nextButton.style.border = 'none';
            nextButton.style.borderRadius = '5px';
            nextButton.style.color = 'white';
            nextButton.style.marginTop = '10px';
            nextButton.style.pointerEvents = 'auto';
            nextButton.onclick = () => this.onNextLevel();

            menuContainer.appendChild(title);
            menuContainer.appendChild(statsContainer);
            menuContainer.appendChild(nextButton);
            this.uiContainer.appendChild(menuContainer);
            console.log('Меню создано и добавлено в DOM');
        } else {
            console.log('Обновляем существующий контейнер меню');
            // Обновляем существующий элемент
            const title = menuContainer.querySelector('h2');
            if (title) {
                title.innerText = `Уровень ${levelNumber} пройден!`;
            }
            const statsContainer = menuContainer.querySelector('div');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <p>Время: ${Math.round(stats.timeSpent)} сек.</p>
                    <p>Уничтожено врагов: ${stats.enemiesDefeated}</p>
                    <p>Точность: ${Math.round(stats.accuracy)}%</p>
                    <p>Выстрелов: ${stats.totalShots}</p>
                    <p>Попаданий: ${stats.successfulShots}</p>
                `;
            }
            menuContainer.style.display = 'block';
        }
        console.log('showLevelComplete завершил выполнение');
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
        pauseButton.style.pointerEvents = 'auto';
        pauseButton.id = 'pauseButton';
        pauseButton.onclick = () => this.onPauseGame();
        this.uiContainer.appendChild(pauseButton);

        // Создаем прогресс уровня при показе паузы
        this.createProgressElement();
    }

    updateLevelProgress(progress: number) {
        console.log(`Обновление прогресс-бара: ${progress}%`);
        const progressElement = document.getElementById('levelProgress') || this.createProgressElement();
        progressElement.style.width = `${progress}%`;
        console.log('Прогресс-бар обновлен');
    }

    private createProgressElement(): HTMLElement {
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
        this.uiContainer.appendChild(progressContainer);
        return progress;
    }

    hideAll() {
        ['levelMenu', 'levelCompleteMenu', 'gameCompleteMenu', 'pauseMenu', 'pauseButton', 'errorMessage'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    dispose() {
        this.hideAll();
        if (this.uiContainer && this.uiContainer.parentElement) {
            this.uiContainer.parentElement.removeChild(this.uiContainer);
        }
    }

    showGameComplete(levelNumber: number, stats: LevelStatistics) {
        this.hideAll();
        const menuContainer = document.createElement('div');
        menuContainer.id = 'gameCompleteMenu';
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '50%';
        menuContainer.style.left = '50%';
        menuContainer.style.transform = 'translate(-50%, -50%)';
        menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        menuContainer.style.padding = '20px';
        menuContainer.style.borderRadius = '10px';
        menuContainer.style.color = 'white';
        menuContainer.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.innerText = 'Поздравляем! Игра пройдена!';
        title.style.marginBottom = '20px';

        const statsContainer = document.createElement('div');
        statsContainer.style.marginBottom = '20px';
        statsContainer.innerHTML = `
            <p>Время: ${Math.round(stats.timeSpent)} сек.</p>
            <p>Уничтожено врагов: ${stats.enemiesDefeated}</p>
            <p>Точность: ${Math.round(stats.accuracy)}%</p>
            <p>Выстрелов: ${stats.totalShots}</p>
            <p>Попаданий: ${stats.successfulShots}</p>
        `;

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Начать заново';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '18px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.backgroundColor = '#4CAF50';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.color = 'white';
        restartButton.onclick = () => window.location.reload();

        menuContainer.appendChild(title);
        menuContainer.appendChild(statsContainer);
        menuContainer.appendChild(restartButton);
        this.uiContainer.appendChild(menuContainer);
    }

    showPauseMenu() {
        this.hideAll();
        const menuContainer = document.createElement('div');
        menuContainer.id = 'pauseMenu';
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '50%';
        menuContainer.style.left = '50%';
        menuContainer.style.transform = 'translate(-50%, -50%)';
        menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        menuContainer.style.padding = '20px';
        menuContainer.style.borderRadius = '10px';
        menuContainer.style.color = 'white';
        menuContainer.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.innerText = 'Пауза';
        title.style.marginBottom = '20px';

        const resumeButton = document.createElement('button');
        resumeButton.innerText = 'Продолжить';
        resumeButton.style.padding = '10px 20px';
        resumeButton.style.fontSize = '18px';
        resumeButton.style.cursor = 'pointer';
        resumeButton.style.backgroundColor = '#4CAF50';
        resumeButton.style.border = 'none';
        resumeButton.style.borderRadius = '5px';
        resumeButton.style.color = 'white';
        resumeButton.style.marginRight = '10px';
        resumeButton.onclick = () => this.onPauseGame();

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Начать заново';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '18px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.backgroundColor = '#f44336';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.color = 'white';
        restartButton.onclick = () => window.location.reload();

        menuContainer.appendChild(title);
        menuContainer.appendChild(resumeButton);
        menuContainer.appendChild(restartButton);
        this.uiContainer.appendChild(menuContainer);
    }

    showError(message: string) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'errorMessage';
        errorContainer.style.position = 'absolute';
        errorContainer.style.top = '50%';
        errorContainer.style.left = '50%';
        errorContainer.style.transform = 'translate(-50%, -50%)';
        errorContainer.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
        errorContainer.style.padding = '20px';
        errorContainer.style.borderRadius = '10px';
        errorContainer.style.color = 'white';
        errorContainer.style.textAlign = 'center';
        errorContainer.style.zIndex = '1000';

        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        messageElement.style.marginBottom = '20px';
        messageElement.style.fontSize = '18px';

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';
        okButton.style.padding = '10px 20px';
        okButton.style.fontSize = '18px';
        okButton.style.cursor = 'pointer';
        okButton.style.backgroundColor = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '5px';
        okButton.style.color = '#f44336';
        okButton.onclick = () => errorContainer.remove();

        errorContainer.appendChild(messageElement);
        errorContainer.appendChild(okButton);
        this.uiContainer.appendChild(errorContainer);
    }
} 