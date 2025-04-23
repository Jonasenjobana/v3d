import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountStore = defineStore("Account", () => {
    const token = ref("");
    const user = ref({});
    function logout() {

    }
    function login() {
        
    }
    return {
        token,
        user
    }
});
