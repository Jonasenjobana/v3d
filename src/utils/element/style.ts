
function setStyles(el: HTMLElement, styles: Record<string, string>) {
    for (const key in styles) {
        setStyle(el, key, styles[key]);
    }
}
function setStyle(el: HTMLElement, key: string, value: string) {
    el.style.setProperty(key, value);
}
export const SLU_Style = {
    setStyle,
    setStyles
}