import { defineStore } from "pinia";
import { nextTick, reactive, shallowReactive, toRef, type MaybeRef, type Reactive, type ShallowReactive } from "vue";
import * as THREE from "three";
import { OrbitControls, RenderPass } from "three/examples/jsm/Addons.js";
import { AnimeControl } from "@/views/3D/three/utils/AnimeControl";
export const useSlThree = defineStore("slThree", () => {
  const slThreeData: ShallowReactive<{
    scene: THREE.Scene | null;
    render: THREE.WebGLRenderer | null;
    camera: THREE.Camera | null;
    controls: any;
  }> = shallowReactive({
    scene: null,
    render: null,
    camera: null,
    controls: {},
  });
  const animeControl = new AnimeControl(60);
  async function initThree(elRef: MaybeRef<HTMLElement>, config: any) {
    const el = toRef(elRef).value;
    await nextTick();
    const tScene = (slThreeData.scene = new THREE.Scene());
    const tRender = (slThreeData.render = new THREE.WebGLRenderer({ antialias: true, canvas: el }));
    const tCamera = (slThreeData.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const orbitControls = (slThreeData.controls["orbit"] = new OrbitControls(tCamera, el));
    animate();
  }
  function renderFrame() {
    const { render, scene, camera } = slThreeData;
    render!.render(scene!, camera!);
  }
  function animate() {
    animeControl.start(() => {
      renderFrame();
    });
  }
  return {
    slThreeData,
    initThree,
  };
});
