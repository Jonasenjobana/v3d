<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card elevation="12">
              <v-card-title class="text-h5 text-center">登录</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="username"
                  label="用户名"
                  prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="密码"
                  type="password"
                  prepend-icon="mdi-lock"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="login">登录</v-btn>
                <v-btn color="primary" @click="test">test</v-btn>

              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  <v-snackbar
      v-model="snackbar"
    >
      {{ username }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup lang="ts">
let globalSnackbarParent: any
import { useAccountStore } from "@/stores/auth";
import { useUserStore } from "@/stores/userStore";
import { postRequest } from "@/utils/request"; // 引入 postRequest 方法
import { getCurrentInstance, h, ref, render } from "vue";
import { useRouter } from "vue-router";
import { VBtn } from "vuetify/components";
import MapPlayground from "../MapPlayground.vue";
const username = ref("");
const password = ref("");
const snackbar = ref(false);
const authStore = useAccountStore();
const router = useRouter();
const userStore = useUserStore();
function test() {
}
const login = async () => {
  const response = await postRequest('/api/login', {
      username: username.value,
      password: password.value,
    });
    const { userInfo, token } = response as any;
    userStore.setUserInfo(userInfo, token);
    snackbar.value = true;
    console.log(userInfo, token); // 打印登录成功后的用户信息和 token
};
</script>

<style scoped lang="less">
// ... existing code ...
</style>
