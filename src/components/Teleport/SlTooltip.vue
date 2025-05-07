<template>
    <div class="sl-tooltip">
        <slot></slot>
        <span>{{ content }}</span>
    </div>
</template>
<script lang="ts">
import { defineComponent, h, onMounted, type MaybeRef, type PropType } from "vue";
export default defineComponent({
    name: 'SlTooltip',
    props: {
        content: String,
        type: {
            type: String as PropType<'hover'>,
            default: 'hover'
        },
        duration: {
            type: Number,
            default: 2000
        }
    },
    setup: (props, { slots }) => {
        
    },
})
</script>
<style scoped lang="less">
.sl-tooltip {
    position: absolute;
    background-color: #fff;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2), -2px 0 2px rgba(0, 0, 0, 0.2);
    transform: translateX(-50%);
    top: -40px;
    width: auto;
    padding: 0 4px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #000;
    border-radius: 4px;
    &::after {
      // 倒三角形气泡角 还有阴影
      content: "";
      position: absolute;
      height: 10px;
      width: 20px;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      background-color: #fff;
      transform: translateX(-50%);
      left: 50%;
      bottom: -10px;
    }
  }
</style>