import { onMounted, provide, ref, shallowRef, type InjectionKey, type Ref, type ShallowRef } from "vue";
import * as L from 'leaflet'
export const MapKey: InjectionKey<ShallowRef<L.Map|null>> = Symbol('map')
export function slMap(id: string) {
    const map: ShallowRef<L.Map | null> = shallowRef(null);
    provide(MapKey, map);
    onMounted(() => {
        map.value = L.map(id).setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.value);
    })
    return {
        map
    }
}