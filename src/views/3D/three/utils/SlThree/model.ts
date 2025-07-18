import * as THREE from "three";
export abstract class SlThreeMesh {
    constructor() {
        this.init();
    }
    abstract geometry: THREE.BufferGeometry;
    abstract mesh: THREE.Mesh;
    parent: THREE.Object3D | null = null;
    abstract init(): THREE.Mesh;
    addTo(parent: THREE.Object3D) {
        parent.add(this.mesh);
        return this;
    }
    remove() {
        this.parent?.remove(this.mesh);
    }
} 