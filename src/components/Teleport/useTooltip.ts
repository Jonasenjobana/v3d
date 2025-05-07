import { h, inject, onMounted, render, watch, type MaybeRef } from "vue";
import SlTooltip from "./SlTooltip.vue";
export function useTooltip(target: MaybeRef, tip: string) {
    const toolTip = h(SlTooltip, {content: tip});
    render(toolTip, document.body);
}