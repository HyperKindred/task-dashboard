<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTasks } from './composables/useTasks.js'
import TaskHeader from './components/TaskHeader.vue'
import TaskToolbar from './components/TaskToolbar.vue'
import TaskList from './components/TaskList.vue'
import TaskFormDialog from './components/TaskFormDialog.vue'

const {
  tasks,
  filteredTasks,
  searchQuery,
  statusFilter,
  priorityFilter,
  addTask,
  updateTask,
  deleteTask
} = useTasks()

const dialogVisible = ref(false)
const selectedTask = ref(null)

const toolbarRef = ref(null)

function handleKeydown(e) {
  const tag = e.target?.tagName?.toLowerCase()
  const isInput = ['input', 'textarea', 'select', 'button'].includes(tag) || e.target?.isContentEditable

  // Ctrl+K 或 / → 聚焦搜索框
  if ((e.ctrlKey && e.key === 'k') || (!isInput && e.key === '/')) {
    e.preventDefault()
    toolbarRef.value?.focusSearch?.()
    return
  }

  // Enter（非输入框内、弹窗未打开时）→ 添加任务
  if (e.key === 'Enter' && !isInput && !dialogVisible.value) {
    e.preventDefault()
    handleAdd()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const isFiltering = computed(() =>
  searchQuery.value || statusFilter.value || priorityFilter.value
)

// 对话框关闭时清除 selectedTask 引用，防止残留
watch(dialogVisible, (val) => {
  if (!val) {
    selectedTask.value = null
  }
})

function handleAdd() {
  selectedTask.value = null
  dialogVisible.value = true
}

function handleOpenDetail(task) {
  selectedTask.value = task
  dialogVisible.value = true
}

async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const saved = deleteTask(id)
    if (saved) {
      ElMessage.success('任务已删除')
    } else {
      ElMessage.warning('任务已删除，但本地存储写入失败，刷新后将丢失')
    }
  } catch {
    // 用户取消删除
  }
}

function handleSave(formData) {
  let saved
  if (selectedTask.value) {
    saved = updateTask(selectedTask.value.id, formData)
  } else {
    saved = addTask(formData)
  }
  if (saved) {
    ElMessage.success(selectedTask.value ? '任务已更新' : '任务已添加')
  } else {
    ElMessage.warning(selectedTask.value ? '任务已更新，但本地存储写入失败，刷新后将丢失' : '任务已添加，但本地存储写入失败，刷新后将丢失')
  }
  dialogVisible.value = false
  selectedTask.value = null
}
</script>

<template>
  <div class="task-dashboard">
    <TaskHeader @add="handleAdd" />
    <TaskToolbar
      ref="toolbarRef"
      v-model:searchQuery="searchQuery"
      v-model:statusFilter="statusFilter"
      v-model:priorityFilter="priorityFilter"
    />
    <div class="task-count" v-if="tasks.length > 0">
      共 <strong>{{ tasks.length }}</strong> 个任务
      <template v-if="isFiltering">
        ，已筛选出 <strong>{{ filteredTasks.length }}</strong> 个
      </template>
    </div>
    <div class="task-list-wrapper">
      <TaskList
        :tasks="filteredTasks"
        @open-detail="handleOpenDetail"
        @delete="handleDelete"
      />
    </div>
    <TaskFormDialog
      v-model:visible="dialogVisible"
      :task="selectedTask"
      @saved="handleSave"
    />
  </div>
</template>

<style scoped>
.task-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .task-dashboard {
    padding: 12px;
    gap: 12px;
  }
}

.task-list-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.task-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  padding: 0 4px;
  flex-shrink: 0;
}
</style>
