import {ModelObject} from "./modelObject.ts";
import {IBonus} from "./BonusBase.ts";
import { Player } from "./player.ts";
import {Vector3} from "three";

export class BonusMin extends ModelObject implements IBonus {
    scaleX: number = 1;
    scaleY: number= 1;
    scaleZ: number= 1;
    rotation: number= 1;

    constructor(lanePositions: number[], zPosition: number, scene: any) {
        super(new Vector3(lanePositions[Math.floor(Math.random() * lanePositions.length)], 0.5, zPosition), scene, "public/models/gift.glb");
    }

    addBonus(player: Player): void {
        player.shootingInterval = player.shootingInterval + 50;
    }

}