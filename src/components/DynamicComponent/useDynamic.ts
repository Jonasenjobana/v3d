import { onMounted, provide, ref, type InjectionKey, type Ref } from "vue";
import type DynamicRouterLayer from "@/components/DynamicComponent/DynamicRouterLayer.vue";
import type { DynamicComponentManager } from "./Dynamic";
export const DynamicManageKey: InjectionKey<Ref<DynamicComponentManager | null>> = Symbol("dynamic");
export type DynamicRef = Ref<InstanceType<typeof DynamicRouterLayer> | null>;
export function useDynamic(dynamicRef: Ref<InstanceType<typeof DynamicRouterLayer> | null>) {
  const manageRef: Ref<DynamicComponentManager | null> = ref(null);
  provide(DynamicManageKey, manageRef);
  onMounted(() => {
    if (dynamicRef.value) {
      const layer = dynamicRef.value;
      manageRef.value = layer.manage;
      //   registerLayer();
    }
  });
  return {
    manageRef,
  };
}
