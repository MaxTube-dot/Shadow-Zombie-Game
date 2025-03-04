import * as THREE from "three";
import {Group, Object3DEventMap} from "three";

export class RoadSegment {
    private group: Group<Object3DEventMap>;
    constructor(lanePositions:number[], laneIndex:number, zPosition:any, roadWidth:any, roadLength:any, scene: any) {
        this.group = new THREE.Group();
        this.group.position.x = lanePositions[laneIndex];
        scene.add(this.group);
        const roadGeometry = new THREE.BoxGeometry(roadWidth, 0.1, roadLength);
        const roadMaterial = new THREE.MeshPhongMaterial({color: 0x00aa00});
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(0, -1, zPosition);
        this.group.add(road);
    }
}

