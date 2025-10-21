interface L3EventMap {
    eventName: string
    cb: (...args: any[]) => void;
    once: boolean
}
export class L3Event<T extends string = string> {
    events: Record<string, L3EventMap[]> = {};
    constructor() {}
    on(eventName: T, callback: (...args: any[]) => void, opt?: {immediate: boolean}) {
        const {immediate = false} = opt || {};
        const cbs = this.events[eventName] = this.events[eventName] || [];
        const exist = cbs.find(item => item.cb === callback);
        if (immediate) {
            callback();
        }
        if (exist) {
            exist.once = false;
            return;
        }
        cbs.push({eventName, cb: callback, once: false});
    }
    off(eventName: T, callback: (...args: any[]) => void) {
        const cbs = this.events[eventName] = this.events[eventName] || [];
        const exist = cbs.find(item => item.cb === callback);
        if (exist) {
            cbs.splice(cbs.indexOf(exist), 1);
        }
    }
    trigger(eventName: T, ...args: any[]) {
        const cbs = this.events[eventName] = this.events[eventName] || [];
        const remaining: L3EventMap[] = [];
        cbs.forEach(item => {
            const {cb, once} = item;
            item.cb(...args);
            if (!once) {
                remaining.push(item);
            }
        })
        this.events[eventName] = remaining;
    }
    once(eventName: T, callback: (...args: any[]) => void) {
        const cbs = this.events[eventName] = this.events[eventName] || [];
        const exist = cbs.find(item => item.cb === callback);
        if (exist) {
            exist.once = true;
            return;
        }
        cbs.push({eventName, cb: callback, once: true});
    }
    clear(eventName?: string) {
        if (eventName) {
            this.events.eventName = [];
        } else {
            this.events = {};
        }
    }

}