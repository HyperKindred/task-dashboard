<script setup>
import { ref, watch, computed } from 'vue'
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
const editingTask = ref(null)

const isFiltering = computed(() =>
  searchQuery.value || statusFilter.value || priorityFilter.value
)

// 对话框关闭时清除 editingTask 引用，防止残留
watch(dialogVisible, (val) => {
  if (!val) {
    editingTask.value = null
  }
})

function handleAdd() {
  editingTask.value = null
  dialogVisible.value = true
}

function handleEdit(task) {
  editingTask.value = task
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
  if (editingTask.value) {
    saved = updateTask(editingTask.value.id, formData)
  } else {
    saved = addTask(formData)
  }
  if (saved) {
    ElMessage.success(editingTask.value ? '任务已更新' : '任务已添加')
  } else {
    ElMessage.warning(editingTask.value ? '任务已更新，但本地存储写入失败，刷新后将丢失' : '任务已添加，但本地存储写入失败，刷新后将丢失')
  }
  dialogVisible.value = false
  editingTask.value = null
}
</script>

<template>
  <div class="task-dashboard">
    <TaskHeader @add="handleAdd" />
    <TaskToolbar
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
    <TaskList
      :tasks="filteredTasks"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <TaskFormDialog
      v-model:visible="dialogVisible"
      :task="editingTask"
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
  min-height: 100vh;
}

@media (max-width: 768px) {
  .task-dashboard {
    padding: 12px;
    gap: 12px;
  }
}

.task-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  padding: 0 4px;
}
</style>
