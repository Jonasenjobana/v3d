import type { BufferGeometry, NormalBufferAttributes, Mesh, Material, Object3DEventMap } from "three";
import { SlThreeMesh } from "../../utils/SlThree/model";
import * as THREE from "three";
// 网格
export class GridPlane extends SlThreeMesh {
    constructor() {
        super();
        this.init();
    }
    geometry!: THREE.PlaneGeometry;
    material!: THREE.MeshPhongMaterial;
    mesh!: Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>;
    init(): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> {
        this.geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        this.material = new THREE.MeshPhongMaterial({
            color: 0xefefef,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.geometry.rotateX(-Math.PI / 2);
        return this.mesh;
    }
    addTo(parent: THREE.Scene): this {
        super.addTo(parent);
        // this.material.envMap = parent!.environment;
        return this;
    }
    get position() {
        return this.mesh.position;
    }
}