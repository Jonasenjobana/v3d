<template>
  <li 
    class="mesh-tree-node"
    :class="{
      'leaf-node': node.isLeaf,
      'parent-node': !node.isLeaf,
      'expanded': isExpanded
    }"
  >
    <div 
      class="node-content"
      @click="handleNodeClick"
    >
      <span v-if="!node.isLeaf" class="expand-icon">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span class="node-name">{{ node.name }}</span>
    </div>
    
    <ul v-if="!node.isLeaf && isExpanded" class="node-children">
      <TreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TreeNodeProps {
  node: any
}

const props = defineProps<TreeNodeProps>()
const emit = defineEmits<{
  select: [node: any]
  toggle: [node: any]
}>()

// 节点展开状态
const isExpanded = ref(false)

// 处理节点点击
function handleNodeClick() {
  if (props.node.isLeaf) {
    emit('select', props.node)
  } else {
    isExpanded.value = !isExpanded.value
    emit('toggle', props.node)
  }
}
</script>

<style scoped>
.mesh-tree-node {
  margin: 4px 0;
}

.node-content {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.node-content:hover {
  background-color: #f0f0f0;
}

.expand-icon {
  margin-right: 4px;
  font-size: 10px;
  width: 12px;
  text-align: center;
}

.node-name {
  font-weight: normal;
}

.parent-node .node-name {
  font-weight: bold;
  color: #0066cc;
}

.node-children {
  list-style: none;
  padding-left: 15px;
  margin: 0;
}
</style>