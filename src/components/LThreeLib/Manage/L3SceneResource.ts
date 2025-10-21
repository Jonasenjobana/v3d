import { L3Component } from "../L3Component";
import type { L3Scene } from "../L3Scene";
type L3ResourceType = 'loading' | 'init' | 'finish';
export interface L3Resource {
    type: ''
    value: any
}
export class L3SceneResource extends L3Component<L3ResourceType> {
    resources: any[] = [];
    constructor(name: string | symbol, l3Scene: L3Scene) {
        super(name, l3Scene);
    }
    loadResource() {
        
    }
}