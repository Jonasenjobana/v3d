import { computed, inject, provide, reactive, ref, shallowReactive, watch, type Component, type InjectionKey, type Reactive, type Ref, type ShallowReactive } from "vue";
import type { DynamicComponentItem, DynamicHost } from "./model";

export const HostKey: InjectionKey<Reactive<DynamicHost>> = Symbol("DynamicHostKey");
export const ParentHostKey: InjectionKey<ShallowReactive<DynamicHost> | null> = Symbol("DynamicParentHostKey");
function getHostKey(hostId?: string): ShallowReactive<DynamicHost> | null {
  let hostDynamic = inject(HostKey, null);
  let parentHostDynamic = getParentHostKey();
  if (!hostDynamic || hostDynamic.hostId !== hostId) {
    if (!hostId) {
      return parentHostDynamic;
    } else {
      hostDynamic = shallowReactive({
        hostId: hostId,
        hostChildren: [],
        parentHost: parentHostDynamic,
        dynamicChildren: [],
      });
      parentHostDynamic?.hostChildren.push(hostDynamic);
      provide(ParentHostKey, hostDynamic);
      provide(HostKey, hostDynamic);
      return hostDynamic;
    }
  }
  return hostDynamic;
}
function getParentHostKey() {
  return inject(ParentHostKey, null);
}
/**
 * hostId为空则默认用最上一层的host容器
 * @param config 
 */
export function useDynamicComponents(config?: { hostId?: string }) {
  const { hostId } = config || {};
  const hostDynamic = getHostKey(hostId) as ShallowReactive<DynamicHost>;
  if (!hostDynamic) {
    // throw new Error('useDynamicComponents: hostId not found');
  }
  const { hostChildren, dynamicChildren = [] } = hostDynamic || {};
  console.log("🚀 ~ useDynamicComponents ~ hostDynamic:", hostDynamic)
  const dynamicList = computed(() => {
    return hostDynamic.dynamicChildren;
  })
  function addDynamicComponent(dynamic: DynamicComponentItem) {
    const cached = dynamicChildren.find(item => item.id == dynamic.id);
    if (hostDynamic.dynamicChildren.find(item => item.id == dynamic.id)) {
        return cached
    }
    dynamicChildren.push(dynamic);
  }
  function removeDynamicComponent(dynamic: Pick<DynamicComponentItem, 'id'> | string) {
    const { id } = typeof dynamic === 'string' ? { id: dynamic } : dynamic;
    const index = dynamicChildren.findIndex(item => item.id == id);
    if (index > -1) {
      dynamicChildren.splice(index, 1);
    }
  }
  watch(() => hostDynamic, (newVal, oldVal) => {
    console.log("🚀 hostDynamichostDynamichostDynamichostDynamichostDynamichostDynamichostDynamichostDynamichostDynamichostDynamic:", newVal, oldVal)
  })
  return {
    hostDynamic,
    dynamicList,
    addDynamicComponent,
    removeDynamicComponent,
  }
}
