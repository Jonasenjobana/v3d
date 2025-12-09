import { createRenderer, defineComponent, h, onMounted, onUnmounted, ref, render, Teleport, toValue, watch, watchEffect, type PropType } from "vue";
import './vTooltip.css'

export const ToolTipComponent = defineComponent({
    name: 'TooltipComponent',
    props: {
        tip: {
            type: String,
            required: true
        },
        position: {
            type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
            default: 'top'
        },
        anchor: {
            type: Object as PropType<HTMLElement|null>,// 锚点
            default: document.body
        }
    },
    setup(props) {
        const { tip, position, anchor } = props;
        const visible = ref(false);
        const dirRef = ref(position);
        const setVisible = () => {
            visible.value = true
        }
        const setHidden = () => {
            visible.value = false
        }
        // 判断tooltip是否被body遮挡
        function isTooltipVisible() {
            const tooltip = document.querySelector('.tooltip') as HTMLElement;
            const tooltipRect = tooltip.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();
            return tooltipRect.top >= bodyRect.top && tooltipRect.bottom <= bodyRect.bottom &&
                tooltipRect.left >= bodyRect.left && tooltipRect.right <= bodyRect.right;
        }
        watchEffect(() => {
            const value = toValue(visible);
            if (value && anchor) {
                const rect = anchor.getBoundingClientRect();
                const tooltip = document.querySelector('.tooltip') as HTMLElement;
                const directions = ['top', 'bottom', 'left', 'right'];
                const startIndex = directions.indexOf(position);
                let currentIndex = startIndex;
                const getPosition = (dir: string) => {
                    if (dir === 'top') {
                        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                    } else if (dir === 'bottom') {
                        tooltip.style.top = `${rect.top + rect.height + 5}px`;
                        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                    } else if (dir === 'left') {
                        tooltip.style.left = `${rect.left - tooltip.offsetWidth - 5}px`;
                        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;
                    } else if (dir === 'right') {
                        tooltip.style.left = `${rect.left + rect.width + 5}px`;
                        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;
                    }
                    return {dir, left: tooltip.style.left, top: tooltip.style.top};
                }
                // 尝试上下左右 防止遮挡
                for (let i = 0; i < directions.length; i++) {
                    const dir = directions[currentIndex];
                    const resultDir = getPosition(dir!);
                    if (isTooltipVisible()) {
                        const {dir: finalDir} = resultDir;
                        dirRef.value = finalDir as 'top' | 'bottom' | 'left' | 'right';
                        break;
                    }
                    currentIndex = (currentIndex + 1) % directions.length;
                }
                // 如果尝试了所有方向都被遮挡，默认使用原始位置
                if (!isTooltipVisible()) {
                    getPosition(position!);
                }
            }
        }, { flush: 'post'} )
        onMounted(() => {
            if (anchor) {
                anchor.addEventListener('mouseenter', setVisible)
                anchor.addEventListener('mouseleave', setHidden)
            }
        })
        onUnmounted(() => {
            anchor?.removeEventListener('mouseenter', setVisible)
            anchor?.removeEventListener('mouseleave', setHidden)
        });
        return {
            visible,
            tip,
            anchor,
            dirRef
        }
    },
    render() {
        return h(Teleport, {
            to: this.anchor
        }, [
            h('div', {
                class: `tooltip tooltip-${this.dirRef}`,
                style: {
                    display: this.visible ? 'block' : 'none'
                }
            }, this.tip)
        ])
    }
})
export const vTooltip = {
    mounted(el, binding) {
        const { value, instance } = binding;
        console.log("🚀 ~ binding:", binding)
        const { position = 'top', tip } = value;
        const vTooltipNode = h(ToolTipComponent, {
            position,
            tip,
            anchor: el
        });
        render(vTooltipNode, el);
    },
    unmounted(el, binding) {
        const { value, instance } = binding;
        const { position = 'top', tip } = value;
        render(null, el);
    }
}