<script setup>
import { ElButton } from 'element-plus'

const emit = defineEmits(['add'])
</script>

<template>
  <div class="task-header">
    <h1 class="task-header__title">任务看板</h1>
    <ElButton type="primary" @click="emit('add')">添加任务</ElButton>
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
</style>
