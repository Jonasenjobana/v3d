<template>
    <div>
        <sl-date v-model="date" :inRange="true"></sl-date>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlDate from './SlDate.vue';
const date = ref(new Date())
</script>

<style scoped>

</style>