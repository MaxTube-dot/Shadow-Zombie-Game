import { Player } from './player';

export class InputManager {
    private player: Player;
    private targetLane: number;
    private maxLanes: number;
    private lanePositions: number[];

    constructor(player: Player, initialLane: number, maxLanes: number, lanePositions: number[]) {
        this.player = player;
        this.targetLane = initialLane;
        this.maxLanes = maxLanes;
        this.lanePositions = lanePositions;
        this.initializeListeners();
    }

    private initializeListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    private onKeyDown(event: KeyboardEvent) {
        if ((event.code === 'ArrowLeft' || event.code === "KeyA") && this.targetLane > 0) {
            this.targetLane--;
            this.player.isMoving = true;
        }
        if ((event.code === 'ArrowRight' || event.code === "KeyD") && this.targetLane < this.maxLanes - 1) {
            this.targetLane++;
            this.player.isMoving = true;
        }
    }

    update() {
        if (this.player.isMoving) {
            this.player.move(this.targetLane, this.lanePositions);
        }
    }

    dispose() {
        window.removeEventListener('keydown', (event) => this.onKeyDown(event));
    }
} 