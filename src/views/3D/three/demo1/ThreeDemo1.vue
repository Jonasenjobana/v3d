<template>
  <div class="demo1">
    <!-- <button @click="test">1111</button> -->
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, ref, toValue, watch, watchEffect, type Ref } from "vue";
import * as THREE from "three";
import gsap from "gsap";
import { useSlThree } from "@/stores/useThree";
import { WaterPool } from "./arc/water";
import { GridPlane } from "./arc/plane";
import { BloomPass, EffectComposer, GlitchPass, OrbitControls, OutlinePass, RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { SpritePartial } from "./arc/sprite";
import { GlitchCube } from "./arc/glitch-cube";
import { ShaderPlane } from "./arc/shader";
// const slThreeInstance = inject(SLTHREE);
const slThree = useSlThree(),
  { slThreeData, renderCb } = slThree;
const pool = new WaterPool();
watch(
  () => slThree.tick,
  () => {
    const { render } = slThreeData;
    // tickCb();
  }
);
const emit = defineEmits(["tick"]);
let i = 0;
let effect: EffectComposer;
let renderTarget: any = null;
let testScene: THREE.Scene = new THREE.Scene();
let group: THREE.Group = new THREE.Group();
onMounted(() => {
  setTimeout(() => {
    // testPass();
    // testPartial();
    // testGlitch();
    testShader();
  }, 1000);
});
function testShader() {
  const { render, scene: mainScene, camera: mainCamera } = slThreeData;
  const m = new ShaderPlane()
  m.getPalneMesh();
  // (pool.mesh.material as any).uniforms.uEnvMap.value = slThreeData.scene!.environment?.clone();
  m.mesh.material.uniforms.uEnvMap.value = slThreeData.scene!.environment?.clone();
  m.mesh.material.uniforms.perlinTexture.value = new THREE.TextureLoader().load("/image/perlin.jpg");
  mainScene.add(m.mesh);
  // mainScene.add(pool.mesh);
  renderCb(() => {
    m.mesh.material.uniforms.uTime.value += 0.1
    render.render(mainScene, mainCamera);
  })
}
function testGlitch() {
  const { render, scene: mainScene, camera: mainCamera } = slThreeData;
  const gc = new GlitchCube()
  const {scene} = slThreeData
  const cube = gc.cube();
  scene.add(cube)
  renderCb(() => {
      i = i+1;
      cube.material.time = i
      render.setRenderTarget(null);
      render.render(mainScene, mainCamera);
  })
}
let tickCb = () => {};
function testPartial() {
  const { render, scene: mainScene, camera: mainCamera } = slThreeData;
  const sp = new SpritePartial(render);
  const ssp = sp.init();
  const { target, partial } = sp.createPartial();
  const tScene = mainScene.clone();
  const tCamera = mainCamera.clone();
  tScene.clear();
  tScene.environment = null;
  tScene.background = null;
  partial.material.color = new THREE.Color(0xff0000);
  tScene.add(partial);
  tScene.add(new THREE.AmbientLight(0xffffff));
  tScene.add(new THREE.AxesHelper(200));
  mainScene.add(ssp);
  let count = 0;
  const effect = new EffectComposer(render, target);
  effect.addPass(new RenderPass(tScene, mainCamera));
  effect.addPass(new GlitchPass());
  effect.addPass(new BloomPass());
  tickCb = () => {
    if ( target) {
      count %= 10000;
      partial.rotateX(Math.sin(count++ / 10000));
      effect.render();
      // render.setRenderTarget(target);
      // render.render(tScene, mainCamera);
      render.setRenderTarget(null);
      render.render(mainScene, mainCamera);
    }
  };
  renderCb(tickCb);
}

function testPass() {
  const { width, height } = slThree.container!.getBoundingClientRect();
  renderTarget = new THREE.RenderTarget(width, height);
  effect = new EffectComposer(slThreeData.render!, renderTarget);
  let i = 0;
  slThreeData.scene!.add(pool.mesh);
  const envLigth = new THREE.AmbientLight(0xffffff);
  // slThreeData.scene!.add(envLigth);
  const light = new THREE.PointLight(0xffffff, 100);
  slThreeData.scene?.add(group);
  light.position.set(1, 10, 1);
  light.castShadow = true;
  // testScene.add(light.clone());
  // slThreeData.scene!.add(new THREE.PointLightHelper(light));
  // slThreeData.scene!.add(light);
  const geoCube = new THREE.BoxGeometry(10, 10, 10);
  const meshcube = new THREE.Mesh(geoCube, new THREE.MeshPhongMaterial({ color: 0x00ffff, envMap: slThreeData.scene!.environment }));
  meshcube.castShadow = true;
  meshcube.position.set(0, 0, 0);
  testRenderTarget();
  testScene!.add(meshcube);
  const renderPass = new RenderPass(slThreeData.scene!, slThreeData.camera!);
  effect.addPass(renderPass);
  let selected: any = [];
  const bloomPass = new OutlinePass(new THREE.Vector2(0.5, 0.5), slThreeData.scene!, slThreeData.camera!, selected);
  // const glitch = new GlitchPass();
  setInterval(() => {
    selected = selected.length ? [] : [meshcube];
    bloomPass.selectedObjects = selected;
    // slThreeData.scene?.rotateX(i += 0.01);
  }, 3000);
  effect.addPass(bloomPass);
  // effect.addPass(glitch)
  // testScene!.add(new THREE.AmbientLight(0xffffff));

  pool.mesh.add(meshcube);
  pool.material.uniforms.uEnvMap.value = slThreeData.scene!.environment?.clone();
  // meshcube.position.set(0, 0, 0);
  // const plane = new GridPlane().addTo(slThreeData.scene!);
  // renderTarget.texture.offset.set(0.5, 0.3);
  // plane.material.map = renderTarget.texture;
}
function spriteTest() {}
function testRenderTarget() {
  const { width, height } = slThree.container!.getBoundingClientRect();
  renderTarget = new THREE.WebGLRenderTarget(width, height);
  // renderTarget.texture.generateMipmaps = true;
  // renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
}
onUnmounted(() => {});
</script>

<style scoped lang="less">
.demo1 {
  position: absolute;
  top: 0;
  left: 0;
  background-color: aliceblue;
}
</style>
