import { onMounted, onUnmounted, provide, ref, shallowReactive, shallowRef, watch, type InjectionKey, type Reactive, type Ref, type ShallowReactive } from "vue";
import * as THREE from "three";
import { AnimeControl } from "./AnimeControl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls, RenderPass, type EffectComposer } from "three/examples/jsm/Addons.js";
export const SLTHREE: InjectionKey<Reactive<SLThreeInstance>> = Symbol("SLTHREE");
export interface SLThreeInstance {
  tRender: THREE.WebGLRenderer | null;
  tScene: THREE.Scene | null;
  tCamera: THREE.Camera | null;
  tCompose: EffectComposer | null;
  renderState: boolean;
}
export function useSLThree(canvasRef: Ref<HTMLCanvasElement>, option: any) {
  const defaultConfig = {
    frameRate: 60,
  };
  const config = Object.assign(defaultConfig, option);
  const slIntance: Reactive<SLThreeInstance> = shallowReactive({
    tRender: null,
    tScene: null,
    tCamera: null,
    renderState: true,
    tCompose: null
  });
  const helper = new THREE.AxesHelper(5);
  const animeControl = new AnimeControl(config.frameRate);
  let animeFlag: number = -1;
  provide(SLTHREE, slIntance);
  onMounted(() => {
    const tScene = slIntance.tScene = new THREE.Scene();
    const tRender = slIntance.tRender = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.value });
    const tCamera = slIntance.tCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const orbitControls = new OrbitControls(slIntance.tCamera, canvasRef.value);
    orbitControls.update();
    tScene.add(helper);
    resize();
    animate();
  });
  onUnmounted(() => {
    dispose();
  });
  watch(() => slIntance.renderState, (e) => {
      e ? animeControl.start(renderFrame) : animeControl.stop();
  }, {
    deep: true
  })
  function resize() {
    const el = canvasRef.value;
    const { width, height } = el.getBoundingClientRect();
    slIntance.tRender?.setSize(width, height);
    // slIntance.tCamera?.aspect = width / height;
  }
  function renderFrame() {
    const { tRender, tScene, tCamera, tCompose } = slIntance;
    if (tCompose) {
        tCompose.addPass(new RenderPass(tScene!, tCamera!));
    }
    tRender!.render(tScene!, tCamera!);
  }
  function animate() {
    animeControl.start(() => {
      console.log("ok");
      renderFrame();
    });
  }
  function dispose() {
    animeControl.stop();
    slIntance.tRender?.dispose();
  }
  return {
    slThreeInstance: slIntance,
  };
}
export class SLThree {
    cameraControl: OrbitControls | FirstPersonControls | null = null;
    constructor() {
        
    }
    init() {

    }
    destroy() {
        
    }
}