import * as THREE from "three";
export abstract class SlThreeMesh<T extends THREE.BufferGeometry, R extends THREE.Mesh> {
    constructor() {
        this.init();
    }
    abstract geometry: THREE.BufferGeometry;
    abstract mesh: THREE.Mesh;
    parent: THREE.Object3D | null = null;
    abstract init(): THREE.Mesh;
    addTo(parent: THREE.Object3D): SlThreeMesh<T, R> {
        parent.add(this.mesh);
        return this;
    }
    remove() {
        this.parent?.remove(this.mesh);
    }
    updateMaterial(idx: number) {
    }
} 