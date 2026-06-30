<script setup>
import TaskCard from './TaskCard.vue'
import TaskEmpty from './TaskEmpty.vue'

defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div v-if="tasks.length > 0" class="task-list">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
  <TaskEmpty v-else />
</template>

<style scoped>
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
