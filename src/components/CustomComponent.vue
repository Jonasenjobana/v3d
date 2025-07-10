<template>
    <div>
        <span>{{ title }}</span>
        <button @click="total++">{{ total }}</button>
        {{ tip }}
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, watch, defineEmits, defineModel} from "vue";
const total = ref(1);
const emit = defineEmits(['totalChange'])
defineProps({
    title: {
        type: String,
        default: '测试'
    }
})
const tip = defineModel('tip', {
    type: String
})
watch(total, () => {
    console.log('wtf', total.value)
    emit('totalChange', total.value)
    axios.get('/api/user').then(res => {
        console.log(res)
    })
})
</script>

<style scoped>

</style>