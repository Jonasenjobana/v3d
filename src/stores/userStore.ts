import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as { [key: string]: any } | null,
    token: null as string | null,
  }),
  actions: {
    // 设置用户信息和 token
    setUserInfo(userInfo: { [key: string]: any }, token: string) {
      this.userInfo = userInfo;
      this.token = token;
    },
    // 清除用户信息和 token，通常用于退出登录
    clearUserInfo() {
      this.userInfo = null;
      this.token = null;
    },
  },
  getters: {
    // 获取用户信息
    getUser: (state) => state.userInfo,
    // 获取 token
    getToken: (state) => state.token,
  },
});