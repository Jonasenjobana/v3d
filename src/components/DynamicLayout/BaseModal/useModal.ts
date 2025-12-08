import { getCurrentInstance, h, nextTick, render, type ComponentInternalInstance } from "vue";
import type { BaseModalProps } from "./model";
import BaseModal from "./BaseModal.vue";
const modalWraperEl = document.createElement('div');
document.body.appendChild(modalWraperEl);
modalWraperEl.className = 'modal-wraper';
export interface BaseModalConfig extends BaseModalProps {
    parent?: ComponentInternalInstance | null
}
export function createBaseModal(props: BaseModalConfig) {
    const container = document.createElement('div');
    const parentInstance = props.parent || getCurrentInstance()
    modalWraperEl.appendChild(container);
    const vnode = h(BaseModal, {...props, onClose: () => {
        render(null, container)
    }})
    render(vnode, container);
    vnode.appContext = parentInstance?.appContext || vnode.appContext;
    vnode['parent'] = parentInstance;
}