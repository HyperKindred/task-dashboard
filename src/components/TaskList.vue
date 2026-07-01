<script setup>
import TaskCard from './TaskCard.vue'
import TaskEmpty from './TaskEmpty.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['open-detail', 'delete'])
</script>

<template>
  <div class="task-list-root">
    <div v-if="tasks.length > 0" class="task-list">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @open-detail="emit('open-detail', $event)"
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
