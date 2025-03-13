import { defineComponent, h, reactive } from "vue"

export interface SlMessageOption {
    content: string
    type: 'success' | 'error' | 'warn'
    duration?: number //ms
}
export const SlMessageComponent = defineComponent((props, { slots, emit }) => {
    const message = reactive([]);
    return () => (
        h('div', {class: 'sl-message'}, [
            h('div', {class: 'sl-message-content'}, slots.default?.())
        ])
    )
}, {
    props: ['content', 'type', 'duration']
})
export function useMessage(message: SlMessageOption) {
    
}