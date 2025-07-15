export class MobileUtil {
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    static updateMobileWraper(el: HTMLElement, option: { designWidth: number, designHeight: number}) {
        const { designWidth, designHeight } = option;
        const {width, height} = el.getBoundingClientRect();
        /**设计稿比例下对应px -> rem 1:1 */
        let baseFont = 1;
        const scaleX = width / designWidth;
        const scaleY = height / designHeight;
        const scale = Math.min(scaleX, scaleY);
        return {
            fontSize: baseFont * scale,
            width: designWidth * scale,
            height: designHeight * scale
        }
    }
}