<!-- flex布局管理容器 -->
<template>
  <div class="flex-layer-container-component" :id="props.layerName">
    <component :is=""></component>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    vertical: boolean; // 垂直布局
    maxCount?: number; // 容器最大子元素个数 -1 为无限
    scroll?: boolean; // 超过容器宽高时是否启用滚动
    hoverScroll?: boolean; // hover 显示滚动条
    layerName: string
  }>(),
  {
    layer: 'default-layer',
    vertical: true,
    width: "100%",
    height: "100%",
    scroll: true,
    maxCount: -1,
  }
);

</script>

<style scoped></style>
