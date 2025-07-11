<template>
  <div class="map-playground">
    <div id="map" ref="mapElRef"></div>
  </div>
</template>

<script setup lang="ts">
import rbush from "rbush";
import { useMapStore } from "@/stores/map/useMap";
import { PixiOverlayLayer } from "@/utils/map/layer/pixi-overlay";
import { onMounted, ref, toRefs, watch } from "vue";
import * as PIXI from "pixi.js";
import { BaseSelectRect, BaseShip, BaseShip2, BaseTextRect, OverlapCollisionBBox, ShaderElement, updateBoundByBaseSize } from "@/utils/canvas/pixi";
import { noise, randomLatlng, randomMMSI, randomType } from "@/utils/random";
import { AABBUtil } from "@/utils/math";
const { lMap, initMap } = toRefs(useMapStore());
const mapElRef = ref<HTMLDivElement | null>(null);
onMounted(() => {
  lMap.value = initMap.value(mapElRef.value!);
  setPixiLayer();
});
function setPixiLayer() {
  const pixiLayer = new PixiOverlayLayer().addTo(lMap.value!);
  const { stage } = pixiLayer.app!;
  const shipContainer = new PIXI.Container({
    eventMode: "static",
  });

  const baseShip = new Array(20).fill(0).map((el) => {
    const ship = {
      latlng: randomLatlng([33, 111], [44, 144]) as any,
      type: randomType(["1", "2", "3", "4", "5", "6", "7", "8", "9"]) as any,
      rotation: Math.random() * 2 * Math.PI,
    };
    const base = Math.random() > 0.5 ? BaseShip2(ship) : BaseShip(ship);
    base.on("click", () => {
      selector.latlng = base.latlng;
      selector.position.set(base.x, base.y);
      selector.visible = true;
      updateBoundByBaseSize(selector, base);
    });
    return base;
  });
  // aabb 查看
  const rectContainer = new PIXI.Container({ eventMode: "static" });
  const rect = baseShip.map((el) => {
    const { minX, minY, maxX, maxY } = el.getBounds();
    const r = new PIXI.Graphics().rect(minX, minY, maxX - minX, maxY - minY).stroke(0x00ff00);
    r.latlng = el.latlng;
    return r;
  });
  const texts = baseShip.map((el) => {
    const text = BaseTextRect(randomMMSI());
    text.latlng = el.latlng;
    text.linkContainer = el;
    return text;
  });
  const selector = BaseSelectRect();
  stage.eventMode = 'static'
  stage.addChild(shipContainer, rectContainer);
  shipContainer.addChild(...baseShip);
  rectContainer.addChild(...rect, selector, ...texts);
  const lineContainer = new PIXI.Container();
  stage.addChild(lineContainer);
  const shaderContainer = new PIXI.Container();
  stage.addChild(shaderContainer);
  pixiLayer.updatePosition();
  const overlap = new OverlapCollisionBBox();
  let el2: PIXI.Mesh<any, any> | null = null;
  ShaderElement().then((el) => {
    el2 = el;
    stage.on('mousemove', (e) => {
      const {movementX, movementY} = e
      const c = el2!.shader!.resources.uniforms.uniforms.center;
      el2!.shader!.resources.uniforms.uniforms.scale += 1;
      // el2!.shader!.resources.uniforms.uniforms.center = [c[0] + movementX * 0.01, c[1] + movementY * 0.01];
      
    })
    shaderContainer.addChild(el);
  });
  pixiLayer.updateContainer(() => {
    overlap.setAllRbush(texts.map((text) => ({ ...text.getBounds(), data: text })));
    lineContainer.removeChildren();
    let renderAABB: any = [];
    let lines: PIXI.Graphics[] = [];
    texts.forEach((text) => {
      const { x, y } = lMap.value!.latLngToContainerPoint(text.latlng!);
      const result = overlap.avoidCollision({ minX: x, minY: y, maxX: x, maxY: y, width: 0, height: 0 }, text.getBounds(), { minDistance: 30, maxDistance: 50, tollerance: 0 });
      if (!result) {
        text.visible = false;
      } else {
        text.visible = true;
        text.position.set(result.minX, result.minY);
        renderAABB.push(result);
        const points = AABBUtil.getAABBNearPoints(text.getBounds(), text.linkContainer!.getBounds());
        const line = new PIXI.Graphics()
          .moveTo(...points[0])
          .lineTo(...points[1])
          .stroke({ width: 2, color: 0xff0000 });
        line.x = 0;
        line.y = 0;
        lines.push(line);
      }
      overlap.setAllRbush(renderAABB);
    });
    lineContainer.addChild(...lines);

    pixiLayer.app!.ticker.add((delta) => {
      if (el2) {
        // 0.3~0.7 平滑生成
        const v = noise(delta.lastTime / 100000000, .3985123)
        el2.shader!.resources.uniforms.uniforms.iTime = Math.sin(v);
        const factor = Math.max(0.1, Math.log(el2.shader!.resources.uniforms.uniforms.scale));
        el2.shader!.resources.uniforms.uniforms.iterations = factor * 500;
      }
    });
  });
}
</script>

<style scoped>
.map-playground {
  position: relative;
  width: 100%;
  height: 100%;
}

#map {
  height: 100%;
  z-index: 1;
  width: 100%;
}
</style>
