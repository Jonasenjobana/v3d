<template>
    <div class="w-full h-full relative z-50">
        <slot></slot>
        <div v-for="bar in bars" :key="bar.id" class="w-full h-full absolute top-0 left-0 bg-white/50 pointer-events-auto">
            {{ bar.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWindowBar } from '@/hook/usePinia/panel/useWindowBar';
import { computed } from 'vue';
const windowBarStore = useWindowBar();
const bars = computed(() => windowBarStore.bars);
</script>

<style scoped>

</style>