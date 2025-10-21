import { L3Component } from "../L3Component";
import type { L3Renderer } from "../L3Renderer";
import type { L3Scene } from "../L3Scene";
type L3SceneManageEvent = 'add' | 'remove' | 'update'
interface SceneInfo {
    name: string | symbol
    scene: L3Scene
}
export class L3SceneManage extends L3Component<L3SceneManageEvent> {
    scenes: SceneInfo[] = [];
    currentScene: L3Scene | null = null
    constructor(public renderer: L3Renderer) {
        super(Symbol(1), renderer);
    }
    loadScene(name: string | symbol, scene: L3Scene) {
        const cached = this.getScene(name)
        if (cached) {
            cached.renderChange(this.renderer);
            console.error(`场景${typeof name == 'string' ? name : name.toString()}已存在`);
            return;
        }
        scene.renderChange(this.renderer);
        this.scenes.push({ name, scene });
        return scene;
    }
    getScene(name: string | symbol) {
        return this.scenes.find((scene) => scene.name == name)?.scene;
    }
    setScene(name?: string | symbol) {
        let scene = null;
        if (!name) {
            scene = this.scenes[0]?.scene;
        }
        scene = name ? this.getScene(name) : scene;
        if (!scene) {
            console.error(`场景${name ? typeof name == 'string' ? name : name.toString() : ''}不存在`);
            return;
        }
        this.currentScene?.unweak();
        this.currentScene = scene;
        this.currentScene.weak();
    }
    destroyScene(name: string | symbol) {
        const scene = this.getScene(name);
        if (!scene) {
            console.error(`场景${typeof name == 'string' ? name : name.toString()}不存在`);
            return;
        }
        scene.destroyed();
    }
}