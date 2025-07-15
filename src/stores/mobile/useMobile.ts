import { MobileUtil } from "@/utils/mobile";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMobile = defineStore('mobile', () => {
    const config = {
        designWidth: 320,
        designHeight: 568
    }
    const mobileData = reactive({
        width: 320,
        height: 568,
        fontSize: 1
    })
    function resize(el: HTMLElement) {
        const { width, height, fontSize } = MobileUtil.updateMobileWraper(el, config);
        mobileData.width = width;
        mobileData.height = height;
        mobileData.fontSize = fontSize;
        return {
            width,
            height,
            fontSize
        }
    }
    return {
        resize,
        mobileData
    }
})