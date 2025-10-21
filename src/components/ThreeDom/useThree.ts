import { inject, provide, type InjectionKey, type Ref, ref, onMounted, reactive, onUnmounted, watch, shallowReactive } from "vue";
import * as THREE from 'three';
import { useResizeObserver } from "@/utils/element/event";
import { LThreeHelper } from "./LThreeHelper/helper";
export const TThreeHelperToken: InjectionKey<LThreeHelper> = Symbol('helper');
export const TRenderToken: InjectionKey<THREE.WebGLRenderer> = Symbol('render');
export const TSceneToken: InjectionKey<Ref<THREE.Scene>> = Symbol('scene');
export function useLThree(containerRef: Ref<HTMLElement>) {
    const render = shallowReactive(new THREE.WebGLRenderer({
        antialias: true,
        depth: true,
        alpha: true,
        /**出现面闪烁问题时改为true */
        logarithmicDepthBuffer: false,
    }))
    // const {
    //     clearColor = 0xFFFFFF,
    //     clearAlpha = 1,
    //     pixelRatio = 1,
    //     localClippingEnabled = false,
    //     autoClear = true,
    //     shadowMap = {
    //         enabled: true,
    //         autoUpdate: false,
    //         needsUpdate: false,
    //     }
    // } = {};
    // render.setPixelRatio(pixelRatio)
    // render.outputColorSpace = THREE.SRGBColorSpace;
    // render.autoClear = autoClear;
    // render.sortObjects = false;
    // /**开启阴影渲染 */
    // render.shadowMap.enabled = !!shadowMap.enabled;
    // /**指定阴影的渲染模式 */
    // render.shadowMap.type = THREE.PCFSoftShadowMap;
    // // instance.shadowMap.autoUpdate = !!shadowMap.autoUpdate;
    // // instance.shadowMap.needsUpdate = !!shadowMap.needsUpdate;
    // render.localClippingEnabled = localClippingEnabled;
    // /**调整渲染器的色调映射和曝光 */
    // render.toneMapping = THREE.NoToneMapping;
    // render.toneMappingExposure = 1.12;
    const lHelper = shallowReactive(new LThreeHelper(render));
    provide(TThreeHelperToken, lHelper);
    const DOMViewInfo = reactive<{width: number, height: number, aspect: number, containerEl: HTMLElement | null, canvasEl: HTMLCanvasElement | null}>({
        aspect: 0,
        width: 0,
        height: 0,
        containerEl: null,
        canvasEl: null
    })
    onMounted(() => {
        updateContainerSize();
        DOMViewInfo.canvasEl = render.domElement;
        containerRef.value.appendChild(DOMViewInfo.canvasEl!);
        lHelper.renderStart();
    })
    useResizeObserver(containerRef, () => {
        updateContainerSize();
    })
    onUnmounted(() => {
        lHelper.destroy();
        // 销毁处理
    })
    function updateContainerSize() {
        const containerEl = containerRef.value;
        const { width, height } = containerEl.getBoundingClientRect();
        DOMViewInfo.aspect = width / height;
        DOMViewInfo.width = width;
        DOMViewInfo.height = height;
        lHelper.domElement.width = width;
        lHelper.domElement.height = height;
    }
    function updateRender() {
        render.setSize(DOMViewInfo.width, DOMViewInfo.height);
        render.setPixelRatio(window.devicePixelRatio);
        render.setViewport(0, 0, DOMViewInfo.width, DOMViewInfo.height);
        render.setScissor(0, 0, DOMViewInfo.width, DOMViewInfo.height);
    }
    watch(DOMViewInfo, () => {
        updateRender();
    }, { deep: true, immediate: false, flush: 'post' })
    return {
        render,
        DOMViewInfo,
        lHelper
    }
}