<script setup>
import { ElCard, ElTag, ElButton } from 'element-plus'
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_TAG_TYPE, PRIORITY_TAG_TYPE } from '../constants.js'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

function formatTime(iso) {
  try {
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}

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
  <ElCard class="task-card" shadow="hover">
    <div class="task-card__body">
      <h3 class="task-card__title" @click="emit('edit', task)">{{ task.title }}</h3>
      <div class="task-card__tags">
        <ElTag :type="STATUS_TAG_TYPE[task.status]" size="small">
          {{ statusLabel(task.status) }}
        </ElTag>
        <ElTag :type="PRIORITY_TAG_TYPE[task.priority]" size="small">
          {{ priorityLabel(task.priority) }}
        </ElTag>
      </div>
      <p class="task-card__time">{{ formatTime(task.createdAt) }}</p>
      <div class="task-card__actions">
        <ElButton size="small" @click="emit('edit', task)">编辑</ElButton>
        <ElButton size="small" type="danger" @click="emit('delete', task.id)">删除</ElButton>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.task-card {
  cursor: default;
}

.task-card__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.task-card__title:hover {
  color: var(--el-color-primary);
}

.task-card__tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.task-card__time {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-card__actions {
  display: flex;
  gap: 8px;
}
</style>
