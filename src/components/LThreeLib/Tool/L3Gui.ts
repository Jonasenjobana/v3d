import { Color } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
export interface L3GuiItem {
  /**此调试项的名称 */
  name: string;
  /**被控制的属性名(可通过 . 获取更深层级) */
  param: string;
  /**选项数据(增设选择项) */
  items?: Object;
  /**颜色采样(增设颜色配置) */
  ifColor?: boolean;
  /**数值设置 [最小值,最大值,单步大小] */
  ifNums?: [number | undefined, number | undefined, number | undefined];
  /**点击回调 */
  callback?: Function;
  /**是否监听 */
  listen?: boolean;
  /**变更回调事件 */
  change?: (data: any) => void;
}
export class L3Gui {
  private static gui = new GUI({ width: 310 });
  private static folders: { [name: string]: GUI } = {};
  /**添加GUI文件夹控制
   * @param obj 要控制的对象
   * @param name 文件夹名称
   */
  public static on(obj: any, name: string, ctrs: L3GuiItem[]) {
    if (!this.gui) return;
    let floder = (this.folders[name] = this.folders[name] || this.gui.addFolder(`${name}`));
    for (let i = 0, len = ctrs.length; i < len; i++) {
      const { name, param, listen, ifColor, ifNums, ifNums: [min, max, step] = [], callback, items, change } = ctrs[i];
      let data = obj,
        ctr;
      let parmas = param.split(".") || [],
        last = parmas[parmas.length - 1];
      for (let i = 0, len = parmas.length - 1; i < len; i++) {
        data = data[parmas[i]];
      }
      if (ifColor) {
        const info = data[last];
        if (info instanceof Color) {
          let obj = { color: info.getHex() };
          ctr = floder.addColor(obj, "color");
          ctr.onChange((e: number) => {
            info.setHex(e);
          });
        } else {
          ctr = floder.addColor(obj, last);
        }
      } 
      else if (callback) ctr = floder.add( { [last]: callback }, last, {});
      else if (ifNums) ctr = floder.add(data, last).step(step!).min(min!).max(max!);
      else ctr = floder.add(data, last, items!);
      if (listen) ctr.listen();
      if (change) ctr.onChange(change);
      ctr.name(name);
    }
  }
  /**添加GUI文件夹基础控制
   * @param obj 要控制的对象
   * @param name 文件夹名称
   */
  public static onGuiFolderBase(mesh: any, name: string, min: number = -100, max: number = 100) {
    if (!this.gui) return;
    let floder = (this.folders[name] = this.folders[name] || this.gui.addFolder(`${name}`));
    floder.add(mesh.rotation, "x").step(0.001).min(-5).max(5).name("rotationX").listen();
    floder.add(mesh.rotation, "y").step(0.001).min(-5).max(5).name("rotationY").listen();
    floder.add(mesh.rotation, "z").step(0.001).min(-5).max(5).name("rotationZ").listen();
    floder.add(mesh.position, "x").step(0.001).min(min).max(max).name("positionX").listen();
    floder.add(mesh.position, "y").step(0.001).min(min).max(max).name("positionY").listen();
    floder.add(mesh.position, "z").step(0.001).min(min).max(max).name("positionZ").listen();
  }
  public static hideFolder(name: string) {
    this.folders[name].hide();
  }
  public static showFolder(name: string) {
    this.folders[name].show();
  }
}
