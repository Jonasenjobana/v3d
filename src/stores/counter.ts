import { ref, computed } from 'vue'
import { defineStore, mapActions } from 'pinia'
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const usePrincipleStore = defineStore('pinciple', {
  state: () => ({
    authCodes: [] as String[],
    username: '' as String,
  }),
  getters: {
    hasAuthCode(state) {
    }
  },
  actions: {
    hasAuthCode(code: string | string[]) {
      if (Array.isArray(code)) {
        return code.every((c) => this.authCodes.includes(c))
      } else {
        return this.authCodes.includes(code)
      }
    }
  },
})
const a = mapActions(usePrincipleStore, {
  wtf: 'hasAuthCode'
})