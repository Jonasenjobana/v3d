
function setStyles(el: HTMLElement, styles: Record<string, string>) {
    for (const key in styles) {
        setStyle(el, key, styles[key]);
    }
}
function setStyle(el: HTMLElement, key: string, value: string) {
    el.style.setProperty(key, value);
}
/** translate可能常用涉及多次变化 或者shadow */
function addStyleProperty(el: HTMLElement, key: string, value: string) {
    const preValue = el.style.getPropertyValue(key);
    el.style.setProperty(key, `${preValue}, ${value}`);
}
export const SLU_Style = {
    setStyle,
    setStyles
}