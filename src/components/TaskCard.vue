<script setup>
import { ElCard, ElTag, ElButton } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_TAG_TYPE, PRIORITY_TAG_TYPE, formatTime } from '../constants.js'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-detail', 'delete'])

function statusLabel(value) {
  const opt = STATUS_OPTIONS.find(o => o.value === value)
  return opt ? opt.label : value
}

function priorityLabel(value) {
  const opt = PRIORITY_OPTIONS.find(o => o.value === value)
  return opt ? opt.label : value
}
</script>

<template>
  <ElCard
    class="task-card"
    shadow="hover"
    @click="emit('open-detail', task)"
  >
    <div class="task-card__header">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <ElButton
        :icon="Delete"
        circle
        size="small"
        class="task-card__delete-btn"
        @click.stop="emit('delete', task.id)"
      />
    </div>
    <div class="task-card__tags">
      <ElTag :type="STATUS_TAG_TYPE[task.status] || 'info'" size="small">
        {{ statusLabel(task.status) }}
      </ElTag>
      <ElTag :type="PRIORITY_TAG_TYPE[task.priority] || 'info'" size="small">
        {{ priorityLabel(task.priority) }}
      </ElTag>
    </div>
    <p
      v-if="task.description"
      class="task-card__desc"
    >
      {{ task.description }}
    </p>
    <p class="task-card__time">{{ formatTime(task.createdAt) }}</p>
  </ElCard>
</template>

<style scoped>
.task-card {
  cursor: pointer;
}

.task-card__header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.task-card__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.task-card:hover .task-card__title {
  color: var(--el-color-primary);
}

.task-card__delete-btn {
  flex-shrink: 0;
  margin-top: 1px;
}

.task-card__delete-btn:hover {
  color: var(--el-color-danger);
  border-color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}

.task-card__tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.task-card__desc {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-regular);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__time {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
