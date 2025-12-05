import L from "leaflet";
import lottie, { AnimationItem } from 'lottie-web';
interface LottieMarkerOptions extends L.MarkerOptions {
    url: string;
    size: [number, number]
    rotate?: number
    offset?: [number, number]
}
interface LottieIconOptions extends L.DivIconOptions {
    iconUrl: string;
    size: [number, number]
    rotate?: number
    offset?: [number, number]
}
export class LottieMarker extends L.Marker {
    constructor(latlng: L.LatLng, options: LottieMarkerOptions) {
        const icon = new LottieIcon({
            iconUrl: options.url,
            size: options.size,
            rotate: options.rotate,
            offset: options.offset,
        });
        super(latlng, {icon});
    }
}
export class LottieIcon extends L.DivIcon {
    constructor(public options: LottieIconOptions) {
        super(options);
    }
    lottieInstance?: AnimationItem | null;
    divElement?: HTMLElement;
    createIcon(oldIcon?: HTMLElement): HTMLElement {
        const {size, offset = [0, 0], rotate = 0} = this.options;
		const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div')
        div.style.width = `${size[0]}px`;
        div.style.height = `${size[1]}px`;
        div.replaceChildren();
        const div2 = document.createElement('div');
        div.appendChild(div2);
        this.divElement = div2;
        div2.style.transform = `translate(${offset[0]}px, ${offset[1]}px) rotate(${rotate}deg)`;
        this.initLottie();
        // div.querySelector('svg')?.setAttribute('transform', `rotate(${rotate}deg) translate(${200}px, ${offset[1]}px)`);
        return div;
    }
    onRemove(map: L.Map): this {
        this.destroyLottie();
        return this;
    }
    destroyLottie() {
        if (this.lottieInstance) {
            this.lottieInstance.destroy();
        }
        this.lottieInstance = null;
    }
    initLottie() {
        this.destroyLottie();
        this.lottieInstance = lottie.loadAnimation({
            path: this.options.iconUrl,
            container: this.divElement!,
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });
    }
}