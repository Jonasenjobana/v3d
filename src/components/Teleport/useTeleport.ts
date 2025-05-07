import { computed, warn } from "vue";
import { IN_BROWSER } from "vuetify/lib/util/globals.mjs";
/**
 * 查询挂载节点 没有则创建
 * @param target 
 * @returns 
 */
export function useTeleport(target: any) {
  const teleportTarget = computed(() => {
    const _target = target();

    if (_target === true || !IN_BROWSER) return undefined;

    const targetElement = _target === false ? document.body : typeof _target === "string" ? document.querySelector(_target) : _target;

    if (targetElement == null) {
      warn(`Unable to locate target ${_target}`);
      return undefined;
    }

    let container = [...targetElement.children].find((el) => el.matches(".v-overlay-container"));

    if (!container) {
      container = document.createElement("div");
      container.className = "v-overlay-container";
      targetElement.appendChild(container);
    }

    return container;
  });

  return { teleportTarget };
}
