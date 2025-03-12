import { inject, markRaw, reactive, ref, shallowReactive, shallowRef, type Reactive, type Ref, type ShallowReactive } from "vue";
import type { DynamicComponent } from "./model";
import { uuid } from "@/utils/common";
/**
 *  const a = reactive(new DynamicComponentManager())
 */
export class DynamicComponentManager {
  id: string = uuid();
  allComponents: Array<DynamicComponent<any>> = [];
  get viewComponents(): Array<DynamicComponent<any>> {
    return this.allComponents.filter((ele) => ele.active);
  }
  state:
    | {
        type: string;
        component: string | DynamicComponent<any>;
        list: Array<DynamicComponent<any>>;
      }
    | {} = {};
  private getIndex(name: string) {
    return this.allComponents.findIndex((ele) => ele.name == name);
  }
  removeAllByName(name: string) {
    if (this.allComponents.findIndex((ele) => ele.name == name) == -1) return;
    this.allComponents = this.allComponents.filter((ele) => ele.name !== name);
    this.state = {
      type: "remove_all",
      component: { name },
      list: this.allComponents,
    };
  }
  /**
   * 添加一个动态组件
   * popup
   * layer
   * @param component
   */
  addComponent<E extends abstract new (...args: any[]) => any>(c: DynamicComponent<E>): ShallowReactive<DynamicComponent<E>> {
    // 标记不监听 不代理
    c.component = markRaw(c.component);
    if (!c.name || !c.type) {
      console.error("必须传入type 和 组件的name 字段");
    }
    const index = this.getIndex(c.name);
    c.active = true;
    if (index < 0 || c.concurrence) {
      c.uuid = uuid();
      this.allComponents.push(c);
      this.state = {
        type: "add",
        component: c,
        list: this.allComponents,
      };
    } else {
      if (!c.onOpen) c.onOpen = undefined;
      if (!c.onClose) c.onClose = undefined;
      if (c.destroy == false) {
        c = Object.assign(this.allComponents[index], c);
      } else {
        c = Object.assign({}, this.allComponents[index], c);
        c.uuid = uuid();
      }
      this.allComponents.splice(index, 1, c);
      this.state = {
        type: "refresh",
        component: c,
        list: this.allComponents,
      };
    }
    return c;
  }
  initRegister(list: Array<DynamicComponent<any>>) {
    this.allComponents = [];
    list.forEach((ele) => {
      this.addComponent(ele);
    })
  }
}
