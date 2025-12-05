<template>
  <div 
    v-if="visible" 
    class="mesh-tree-panel"
    ref="panelRef"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px'
    }"
  >
    <!-- 标题栏 -->
    <div 
      class="mesh-tree-title"
      @mousedown="startDrag"
    >
      {{ title }}
    </div>

    <!-- 树容器 -->
    <div class="mesh-tree-container">
      <ul class="mesh-tree-list">
        <TreeNode
          v-for="node in meshTree"
          :key="node.path"
          :node="node"
          @select="handleNodeSelect"
          @toggle="handleNodeToggle"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
// 导入ModelParser
import { ModelParser } from '../three/utils/ModelParser'
// 导入TreeNode组件
import TreeNode from './TreeNode.vue'

// 定义类型
interface HighlightableMesh {
  mesh: THREE.Mesh
  originalMaterial: THREE.Material | THREE.Material[]
  name: string
  path: string
}

interface MeshTreeNode {
  name: string
  path: string
  isLeaf: boolean
  children?: MeshTreeNode[]
  meshData?: HighlightableMesh
}

// 组件属性
interface Props {
  title?: string
  visible?: boolean
  initialPosition?: { x: number, y: number }
  camera?: any
  controls?: OrbitControls | null
  meshes?: HighlightableMesh[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '模型Mesh结构',
  visible: true,
  initialPosition: () => ({ x: 10, y: 10 })
})

// 定义事件
const emit = defineEmits<{
  select: [meshData: HighlightableMesh]
}>()

// 响应式数据
const meshTree = ref<MeshTreeNode[]>([])
const panelRef = ref<HTMLElement | null>(null)
const position = ref<{ x: number, y: number }>(props.initialPosition)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 监听meshes属性变化，自动更新树结构
watch(
  () => props.meshes,
  (newMeshes) => {
    if (newMeshes) {
      meshTree.value = createMeshTree(newMeshes)
    }
  },
  { deep: true }
)

// 拖拽相关方法
function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.body.style.cursor = 'grabbing'
}

function handleMouseMove(e: MouseEvent) {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    }
  }
}

function handleMouseUp() {
  isDragging.value = false
  document.body.style.cursor = ''
}

// 节点选择处理
function handleNodeSelect(node: MeshTreeNode) {
  if (node.isLeaf && node.meshData && props.camera) {
    // 高亮选中的Mesh
    ModelParser.highlightMesh(node.meshData)
    // 聚焦到选中的Mesh
    ModelParser.focusOnMesh(node.meshData.mesh, props.camera)
    // 调整控制器目标
    if (props.controls) {
      props.controls.target.copy(node.meshData.mesh.position)
      props.controls.update()
    }
    // 发送选择事件
    emit('select', node.meshData)
  }
}

// 节点展开/折叠处理
function handleNodeToggle(node: MeshTreeNode) {
  // 这个函数现在只是传递事件，实际的展开/折叠状态由节点自身管理
}

// 创建Mesh树结构
function createMeshTree(meshes: HighlightableMesh[]): MeshTreeNode[] {
  const tree: MeshTreeNode[] = []
  const pathMap = new Map<string, MeshTreeNode>()

  // 首先创建所有节点
  meshes.forEach(meshData => {
    const pathParts = meshData.path.split('.')
    let currentPath = ''
    let parentNode: MeshTreeNode | null = null

    pathParts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}.${part}` : part
      let node = pathMap.get(currentPath)

      if (!node) {
        node = {
          name: part,
          path: currentPath,
          isLeaf: index === pathParts.length - 1,
          children: []
        }
        
        if (node.isLeaf) {
          node.meshData = meshData
        }

        pathMap.set(currentPath, node)

        if (parentNode) {
          parentNode.children?.push(node)
        } else {
          tree.push(node)
        }
      }

      parentNode = node
    })
  })

  return tree
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// 暴露方法
defineExpose({
  createMeshTree
})
</script>

<style scoped>
.mesh-tree-panel {
  position: absolute;
  width: 280px;
  height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  font-family: Arial, sans-serif;
}

.mesh-tree-title {
  padding: 12px;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  font-size: 16px;
  cursor: move;
  user-select: none;
}

.mesh-tree-container {
  padding: 10px;
  height: calc(100% - 48px);
  overflow-y: auto;
}

.mesh-tree-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
</style>