export class EventDispatch<T extends string> {
  // 事件存储结构: { 事件名: [{回调函数, 是否一次性}, ...] }
  private events: Record<T, Array<{ cb: Function; once: boolean; that?: any }>>;

  constructor() {
    this.events = Object.create(null); // 初始化空对象存储事件
  }
  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param cb 回调函数
   */
  on(event: T, cb: Function, that?: any): void {
    if (typeof cb !== "function") {
      throw new TypeError("回调必须是函数类型");
    }

    // 初始化事件数组（如果不存在）
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push({ cb, once: false, that });
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param cb 要移除的回调函数
   */
  off(event: T, cb: Function): void {
    const eventList = this.events[event];
    if (!eventList) return;

    // 过滤掉目标回调
    this.events[event] = eventList.filter((item) => item.cb !== cb);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给回调的参数
   */
  fire(event: T, ...args: any[]): void {
    const eventList = this.events[event];
    if (!eventList || eventList.length === 0) return;

    // 复制一份当前回调列表（防止触发中修改原数组）
    const callbacks = [...eventList];
    // 存储需要保留的非一次性回调
    const remaining: Array<{ cb: Function; once: boolean }> = [];

    callbacks.forEach((item) => {
      // 执行回调并绑定上下文
      item.cb.apply(item.that ?? this, args);
      // 非一次性回调保留
      if (!item.once) {
        remaining.push(item);
      }
    });

    // 更新事件列表（移除已执行的一次性回调）
    this.events[event] = remaining;
  }

  /**
   * 注册一次性事件监听器（触发后自动移除）
   * @param event 事件名称
   * @param cb 回调函数
   */
  once(event: T, cb: Function, that?: any): void {
    if (typeof cb !== "function") {
      throw new TypeError("回调必须是函数类型");
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push({ cb, once: true, that });
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events = Object.create(null);
  }
}
