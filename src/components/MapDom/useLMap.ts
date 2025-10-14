import type { InjectionKey, Ref } from "vue";
import type { CanvasLayer } from "./layer/CanvasLayer";
import { string } from "@tensorflow/tfjs";

export const LMapToken: InjectionKey<Ref<L.Map>> = Symbol('Map');
export const LCanvasLayerToken: InjectionKey<Ref<CanvasLayer>> = Symbol('CanvasLayer');
export interface TilesData {
    name: string;
    url: string;
    option: any;
}
type GroupType = 'image' | 'custom'
export type GroupData = {
    latlng: [number, number];
    lat: number
    lng: number
} | {
    type: 'image',
    size: [number, number];
    imgUrl: string
    rotate: number
    clickable: boolean
} | {
    type: 'custom',
}
export const TilesDataList: TilesData[] = [
    {
        url: 'http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk={key}',
        option: {
            zIndex: 52,
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            key: 'b67f963f0e98f92fd90aede8e352ed58',
        },
        name: 'tianditu',
    }
]