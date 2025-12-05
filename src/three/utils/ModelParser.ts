import * as THREE from "three";

/**
 * 可高亮的Mesh接口
 */
export interface HighlightableMesh {
  /** Mesh对象 */
  mesh: THREE.Mesh;
  /** 原始材质，用于恢复 */
  originalMaterial: THREE.Material | THREE.Material[];
  /** Mesh名称 */
  name: string;
  /** Mesh层级路径 */
  path: string;
}



/**
 * 模型解析器类，提供通用的模型解析和点击高亮功能
 */
export class ModelParser {
  /** 当前高亮的Mesh */
  private static highlightedMesh: HighlightableMesh | null = null;
  /** 高亮材质 */
  private static highlightMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });

  /**
   * 递归解析模型的所有子对象，识别出所有的Mesh
   * @param object 要解析的对象
   * @param parentName 父对象名称
   * @returns 所有Mesh的数组
   */
  public static parseModel(object: THREE.Object3D, parentName: string = ""): HighlightableMesh[] {
    const meshes: HighlightableMesh[] = [];

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name || "mesh";
        const path = parentName ? `${parentName}.${name}` : name;
        meshes.push({
          mesh: child,
          originalMaterial: child.material.clone(),
          name,
          path
        });
        console.log(`Found mesh: ${path}`);
      }
    });

    return meshes;
  }



  /**
   * 相机聚焦到指定Mesh
   * @param mesh 目标Mesh
   * @param camera 相机
   */
  public static focusOnMesh(mesh: THREE.Mesh, camera: THREE.Camera): void {
    // 计算Mesh的边界球
    mesh.geometry.computeBoundingSphere();
    const boundingSphere = mesh.geometry.boundingSphere;

    if (!boundingSphere) return;

    // 计算相机需要移动的距离
    const radius = boundingSphere.radius;
    const distance = radius / Math.tan((camera as THREE.PerspectiveCamera).fov / 2 * Math.PI / 180);

    // 设置相机位置
    const direction = new THREE.Vector3()
      .subVectors(mesh.position, camera.position)
      .normalize()
      .multiplyScalar(distance * 2);

    camera.position.add(direction);
  }

  /**
   * 设置模型点击高亮功能
   * @param renderer WebGL渲染器
   * @param camera 相机
   * @param scene 场景
   * @param meshes 可高亮的Mesh数组
   * @param onClick 点击回调函数
   */
  public static setupClickHighlight(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    scene: THREE.Scene,
    meshes: HighlightableMesh[],
    onClick?: (mesh: HighlightableMesh) => void
  ): void {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener("click", (event) => {
      // 计算鼠标在标准化设备坐标中的位置
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      // 设置射线投射器
      raycaster.setFromCamera(mouse, camera);

      // 获取所有可交互的Mesh
      const intersectableMeshes = meshes.map(m => m.mesh);

      // 检测点击
      const intersects = raycaster.intersectObjects(intersectableMeshes);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        // 找到对应的HighlightableMesh
        const clickedMesh = meshes.find(m => m.mesh === clickedObject);
        
        if (clickedMesh) {
          // 恢复之前高亮的Mesh
          if (ModelParser.highlightedMesh) {
            ModelParser.highlightedMesh.mesh.material = ModelParser.highlightedMesh.originalMaterial;
          }

          // 高亮当前点击的Mesh
          clickedMesh.mesh.material = ModelParser.highlightMaterial;
          ModelParser.highlightedMesh = clickedMesh;

          console.log(`Clicked on mesh: ${clickedMesh.name}`);
          
          // 调用回调函数
          if (onClick) {
            onClick(clickedMesh);
          }
        }
      }
    });
  }

  /**
   * 清理高亮材质、事件监听
   */
  public static dispose(): void {
    if (ModelParser.highlightedMesh) {
      ModelParser.highlightedMesh.mesh.material = ModelParser.highlightedMesh.originalMaterial;
      ModelParser.highlightedMesh = null;
    }
    ModelParser.highlightMaterial.dispose();
  }

  /**
   * 手动高亮指定的Mesh
   * @param mesh 要高亮的Mesh
   */
  public static highlightMesh(mesh: HighlightableMesh): void {
    // 恢复之前高亮的Mesh
    if (ModelParser.highlightedMesh) {
      ModelParser.highlightedMesh.mesh.material = ModelParser.highlightedMesh.originalMaterial;
    }

    // 高亮当前Mesh
    mesh.mesh.material = ModelParser.highlightMaterial;
    ModelParser.highlightedMesh = mesh;
  }

  /**
   * 清除所有高亮
   */
  public static clearHighlight(): void {
    if (ModelParser.highlightedMesh) {
      ModelParser.highlightedMesh.mesh.material = ModelParser.highlightedMesh.originalMaterial;
      ModelParser.highlightedMesh = null;
    }
  }
}