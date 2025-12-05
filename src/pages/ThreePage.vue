<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 左侧导航栏 -->
    <div class="w-64 bg-gray-800 text-white flex flex-col">
      <!-- 导航栏头部 -->
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">Three.js Demos</h2>
      </div>
      
      <!-- 导航栏内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <h3 class="text-lg font-semibold mb-2 text-gray-300">示例Demo</h3>
        <ul class="space-y-1">
          <li v-for="demo in demos" :key="demo.name">
            <button 
              @click="switchDemo(demo.name)" 
              class="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              :class="{ 'bg-gray-700': currentDemoName === demo.name }"
            >
              <div class="font-medium">{{ demo.name }}</div>
              <div class="text-sm text-gray-400">{{ demo.description }}</div>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 导航栏底部 -->
      <div class="p-4 border-t border-gray-700">
        <router-link to="/" class="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">
          返回首页
        </router-link>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部标题栏 -->
      <div class="p-4 bg-white border-b border-gray-200">
        <h1 class="text-2xl font-bold">Three.js 演示</h1>
        <p class="text-gray-600" v-if="currentDemo">当前演示: {{ currentDemo.name }}</p>
      </div>
      
      <!-- 主内容区：Three.js 容器 + MeshTreePanel -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Three.js 容器 -->
        <div id="three-container" class="flex-1"></div>
        
        <!-- MeshTreePanel 组件 - 仅在风扇演示时显示 -->
        <MeshTreePanel 
          v-if="currentDemoName === 'demo4'"
          :camera="camera"
          :controls="controls"
          :meshes="fanDemoMeshes"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as THREE from 'three'
import { ThreeDemoManager } from '../three/ThreeDemoManager'
import { CubeDemo } from '../three/demos/CubeDemo'
import { ParticleDemo } from '../three/demos/ParticleDemo'
import { SmokeDemo } from '../three/demos/SmokeDemo'
import { FanDemo } from '../three/demos/FanDemo'
import MeshTreePanel from '../components/MeshTreePanel.vue'
import { ModelParser } from '../three/utils/ModelParser'

onMounted(() => {
  // 初始化Three.js场景
  initThreeScene()
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  
  // 清理demo管理器
  if (demoManager.value) {
    // 清理当前demo
    const currentDemo = demoManager.value.getCurrentDemo()
    if (currentDemo) {
      currentDemo.dispose()
    }
  }
})

// 响应式数据
const route = useRoute()
const router = useRouter()
const currentDemoName = ref<string>('')
const demos = ref<Array<{ name: string, description: string }>>([])
const demoManager = ref<ThreeDemoManager | null>(null)
const currentDemo = computed(() => {
  if (!demoManager.value) return null
  return demoManager.value.getCurrentDemo()
})

// 监听路由参数变化
watch(
  () => route.params.demoName,
  (newDemoName) => {
    if (newDemoName && demoManager.value && demos.value.length > 0) {
      // 确保演示名称存在
      const demoExists = demos.value.some(demo => demo.name === newDemoName)
      if (demoExists) {
        switchDemo(newDemoName as string)
      }
    }
  },
  { immediate: true }
)

// Three.js 核心对象
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let container: HTMLElement | null

// MeshTreePanel 相关数据
const fanDemoMeshes = ref<any[]>([])
const controls = ref<any>(null)

function initThreeScene() {
  container = document.getElementById('three-container')
  if (!container) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)
  
  // 创建demo管理器
  demoManager.value = new ThreeDemoManager(scene, camera, renderer)
  
  // 注册demo
  const cubeDemo = new CubeDemo()
  const particleDemo = new ParticleDemo()
  const smokeDemo = new SmokeDemo()
  const fanDemo = new FanDemo()

  demoManager.value.registerDemo(cubeDemo)
  demoManager.value.registerDemo(particleDemo)
  demoManager.value.registerDemo(smokeDemo)
  demoManager.value.registerDemo(fanDemo)
  
  // 更新demo列表
  demos.value = demoManager.value.getAllDemos().map(demo => ({
    name: demo.name,
    description: demo.description
  }))
  
  // 加载演示：优先使用路由参数，否则使用第一个演示
  if (demos.value.length > 0) {
    const demoName = route.params.demoName as string
    // 检查演示名称是否存在
    const validDemoName = demos.value.some(demo => demo.name === demoName) ? demoName : demos.value[0]!.name
    switchDemo(validDemoName)
  }
  
  // 处理窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 切换demo
function switchDemo(demoName: string) {
  if (!demoManager.value) return
  
  const success = demoManager.value.switchDemo(demoName)
  if (success) {
    currentDemoName.value = demoName
    // 更新路由参数
    router.push({
      name: 'three',
      params: { demoName }
    })
    
    // 如果是风扇演示，获取解析后的Mesh数据
    if (demoName === '风扇模型') {
      setTimeout(() => {
        const currentDemo = demoManager.value?.getCurrentDemo()
        if (currentDemo && currentDemo instanceof FanDemo) {
          // 获取相机和控制器
          controls.value = currentDemo.controls
          
          // 设置解析后的Mesh数据
          if (currentDemo.parsedMeshes) {
            fanDemoMeshes.value = currentDemo.parsedMeshes
          }
        }
      }, 1000) // 等待模型加载完成
    } else {
      fanDemoMeshes.value = []
    }
  }
}

// 处理窗口大小变化
function handleResize() {
  if (!container || !camera || !renderer) return
  
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}
</script>

<style scoped>
/* 可以在这里添加组件特定样式 */
</style>