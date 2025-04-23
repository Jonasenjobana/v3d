import { ref, watch } from "vue";
const booleanRef = ref(false);
export function useBoolean() {
    const handleBoolean = () => {
        booleanRef.value = !booleanRef.value
    }
    watch(() => booleanRef.value, () => {
        console.log('ffffffffffffffffffffffffffff')
    })
    return {
        booleanRef,
        handleBoolean
    }
}