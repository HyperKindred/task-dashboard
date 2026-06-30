<script setup>
import { ElButton } from 'element-plus'
import { Download, Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '../composables/useTheme.js'
import { useTasks } from '../composables/useTasks.js'

const emit = defineEmits(['add'])
const { isDark, toggleTheme } = useTheme()
const { exportTasksAsJson } = useTasks()
</script>

<template>
  <div class="task-header">
    <h1 class="task-header__title">任务看板</h1>
    <div class="task-header__actions">
      <ElButton
        :icon="isDark ? Sunny : Moon"
        circle
        @click="toggleTheme"
        :title="isDark ? '切换亮色模式' : '切换暗黑模式'"
      />
      <ElButton
        :icon="Download"
        circle
        @click="exportTasksAsJson"
        title="导出所有任务为 JSON"
      />
      <ElButton type="primary" @click="emit('add')">添加任务</ElButton>
    </div>
  </div>
</template>

<style scoped>
.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-header__title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.task-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
