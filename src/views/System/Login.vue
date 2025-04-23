<template>
  <div>
    <h1>Login</h1>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const authStore = useAccountStore();
const router = useRouter();

const login = () => {
  // 模拟登录请求
  //   authStore.login(token);
};
</script>

<style scoped lang="less"></style>
