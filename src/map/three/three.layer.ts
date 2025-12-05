import L from "leaflet";
import * as THREE from "three";
export class ThreeLayer extends L.Layer {
  scene!: THREE.Scene;
  camera!: THREE.OrthographicCamera;
  renderer!: THREE.WebGLRenderer;
  threeContainer!: HTMLElement;
  animeFlag: number = -1;
  cube!: THREE.Mesh;
  onAdd(map: L.Map) {
    const threeContainer = (this.threeContainer = this.threeContainer ?? L.DomUtil.create("div", "three-container"));
    threeContainer.style.position = "fixed";
    threeContainer.style.top = "0";
    threeContainer.style.left = "0";
    map.getPanes().overlayPane.appendChild(threeContainer);
    this.init3D();
    this.anime();
    this._map.on("move zoom resize", this.updateThreePosition, this);
    return this;
  }
  onRemove(map: L.Map) {
    map.getPanes().overlayPane.removeChild(this.threeContainer);
    return this;
  }
  destroy() {
    this.renderer.dispose();
    this.threeContainer.removeChild(this.renderer.domElement);
  }
  init3D() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, this._map.getSize().x, this._map.getSize().y, 0, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true, // 透明背景
    });
    this.renderer.setSize(this._map.getSize().x, this._map.getSize().y);
    this.threeContainer.appendChild(this.renderer.domElement);
  }
  // 5. 坐标换算函数：经纬度→正交世界坐标
  latLngToWorld(latLng: L.LatLngExpression) {
    const screenPoint = this._map.latLngToContainerPoint(latLng);
    const worldX = screenPoint.x;
    const worldY = this._map.getSize().y - screenPoint.y;
    return { x: worldX, y: worldY, z: 0 };
  }
  _resize(canvas: HTMLCanvasElement) {
    const { x: width, y: height } = this._map.getSize();
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;
    canvas.style.transformOrigin = "50% 50%";
  }
  updateThreePosition() {
    let topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.threeContainer, topLeft);
    // 更新地图尺寸
    const mapWidth = this.threeContainer.clientWidth;
    const mapHeight = this.threeContainer.clientHeight;
    // 更新正交相机参数
    this.camera.left = 0;
    this.camera.right = mapWidth;
    this.camera.top = mapHeight;
    this.camera.bottom = 0;
    this.camera.updateProjectionMatrix(); // 必须更新投影矩阵！
    // 更新渲染器尺寸
    this.renderer.setSize(mapWidth, mapHeight);
    // 更新3D物体位置（绑定到北京坐标）
    const worldPos = this.latLngToWorld([39.9042, 116.4074]);
    this.cube.position.set(worldPos.x, worldPos.y, 0);
  }
  anime() {
    cancelAnimationFrame(this.animeFlag);
    this.animeFlag = requestAnimationFrame(() => {
      this.anime();
    });
    this.test();
    this.renderer.render(this.scene, this.camera);
  }
  test() {
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    } else {
      this.cube = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      this.scene.add(this.cube);
    }
  }
}
