import {Player} from "./player.ts";

export interface  IBonus {
    addBonus(player: Player): void;
}