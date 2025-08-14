<template>
    <div>
        dasd
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const route =router.currentRoute
watch(
    () => route.value,
    (e) => {
        console.log(e)
    })
</script>

<style scoped>

</style>