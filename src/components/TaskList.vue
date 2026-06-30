<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FixedSizeGrid as ElFixedSizeGrid } from 'element-plus'
import TaskCard from './TaskCard.vue'
import TaskEmpty from './TaskEmpty.vue'

const VIRTUAL_THRESHOLD = 100
const MIN_COLUMN_WIDTH = 320
const ROW_HEIGHT = 160
const GRID_GAP = 16

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const containerRef = ref(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

let resizeObserver = null

function updateSize() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
    containerHeight.value = containerRef.value.clientHeight
  }
}

onMounted(() => {
  updateSize()
  resizeObserver = new ResizeObserver(() => {
    updateSize()
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

/** 超过阈值时启用虚拟滚动 */
const useVirtual = computed(() => props.tasks.length > VIRTUAL_THRESHOLD)

/** 根据容器宽度计算列数（模拟 minmax(320px, 1fr)） */
const columns = computed(() => {
  if (!containerWidth.value) return 1
  return Math.max(1, Math.floor((containerWidth.value + GRID_GAP) / (MIN_COLUMN_WIDTH + GRID_GAP)))
})

/** 每列实际像素宽度 */
const columnWidth = computed(() => {
  const cols = columns.value
  if (!cols || !containerWidth.value) return MIN_COLUMN_WIDTH
  return Math.floor(containerWidth.value / cols)
})

/** 总行数 */
const totalRow = computed(() => {
  const cols = columns.value
  if (!cols) return 0
  return Math.ceil(props.tasks.length / cols)
})

/** 根据行列索引获取任务 */
function getTask(rowIndex, columnIndex) {
  const idx = rowIndex * columns.value + columnIndex
  return props.tasks[idx] ?? null
}
</script>

<template>
  <div ref="containerRef" class="task-list-root">
    <ElFixedSizeGrid
      v-if="useVirtual"
      :column-width="columnWidth"
      :height="containerHeight"
      :row-height="ROW_HEIGHT + GRID_GAP"
      :total-column="columns"
      :total-row="totalRow"
      :width="containerWidth"
      :data="tasks"
      class="virtual-grid"
    >
      <template #default="{ columnIndex, rowIndex, data, style }">
        <div
          v-if="getTask(rowIndex, columnIndex)"
          :style="{ ...style, paddingRight: GRID_GAP + 'px', paddingBottom: GRID_GAP + 'px', boxSizing: 'border-box' }"
        >
          <TaskCard
            :task="getTask(rowIndex, columnIndex)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </template>
    </ElFixedSizeGrid>

    <div v-else-if="tasks.length > 0" class="task-list">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <TaskEmpty v-else />
  </div>
</template>

<style scoped>
.task-list-root {
  height: 100%;
}

.virtual-grid {
  border: none;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .task-list {
    grid-template-columns: 1fr;
  }
}
</style>
