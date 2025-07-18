import { defineStore } from "pinia";
import { nextTick, reactive, ref, shallowReactive, toRef, type MaybeRef, type Reactive, type Ref, type ShallowReactive } from "vue";
import * as THREE from "three";
import { OrbitControls, RenderPass } from "three/examples/jsm/Addons.js";
import { AnimeControl } from "@/views/3D/three/utils/AnimeControl";
export const useSlThree = defineStore("slThree", () => {
  const slThreeData: ShallowReactive<{
    scene: THREE.Scene;
    render: THREE.WebGLRenderer;
    camera: THREE.Camera;
    controls: any;
  }> = shallowReactive({
    scene: null!,
    render: null!,
    camera: null!,
    controls: {},
  });
  const tick = ref(Symbol(1))
  const animeControl = new AnimeControl(60);
  const container: Ref<HTMLElement | null> = ref(null);
  async function initThree(elRef: MaybeRef<HTMLCanvasElement>, config: any) {
    const el = toRef(elRef).value;
    const {width, height} = el.getBoundingClientRect();
    container.value = el;
    el.width = width;
    el.height = height;
    await nextTick();
    const tScene = (slThreeData.scene = new THREE.Scene());
    const tRender = (slThreeData.render = new THREE.WebGLRenderer({ antialias: true, canvas: el }));
    const tCamera = (slThreeData.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    tCamera.position.set(0, 0, 100);
    tCamera.updateProjectionMatrix();
    tCamera.lookAt(0,0,0)
    const orbitControls = (slThreeData.controls["orbit"] = new OrbitControls(tCamera, el));
    animate();
  }

  let renderFrame = (cb?: Function) => {
    if (!cb) {
      const { render, scene, camera } = slThreeData;
      render!.render(scene!, camera!);
    }
    tick.value = Symbol(1);
  }
  function animate() {
    animeControl.start(() => {
      renderFrame();
    });
  }
  function renderCb(cb: () => void) {
    renderFrame = () => {
      cb();
      tick.value = Symbol(1);
    };
  }
  return {
    slThreeData,
    initThree,
    tick,
    container,
    renderCb,
  };
});
