import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
export class SlRenderManager {
    get threeRenderer() {
        return this.renderer;
    }
    constructor(protected renderer: THREE.WebGLRenderer) {
        // 后处理通道
        this.composer = new EffectComposer(this.renderer);
    }
    protected composer: EffectComposer;
    // 开启后处理
    get enablePostProcessing() {
        return this.usePostProcessing;
    }
    set enablePostProcessing(value: boolean) {
        this.usePostProcessing = value;
    }
    private usePostProcessing: boolean = false;
    render(scene: THREE.Scene, camera: THREE.Camera) {
        if (this.usePostProcessing) {
            this.composer.render();
        } else {
            this.renderer.render(scene, camera);
        }
    }
    // processChains: THREE.WebGLRenderTarget[] = [];
}