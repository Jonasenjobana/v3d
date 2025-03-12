<template>
    <div>
        {{ text }}
        <input type="text" v-model="text">
        <span>wtfffffffffffffff</span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useModel, type ComputedRef } from 'vue';
defineOptions({
    name: 'sl-markdown'
})
const props = defineProps({
    mdText: {
        type: String,
        default: ''
    }
});
const text = ref(props.mdText);
defineExpose({
    text
})
</script>

<style scoped>

</style>