<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants.js'

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const statusFilter = defineModel('statusFilter', { type: String, default: '' })
const priorityFilter = defineModel('priorityFilter', { type: String, default: '' })

const localSearch = ref(searchQuery.value)
let debounceTimer = null

watch(localSearch, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = val
  }, 300)
})

onUnmounted(() => {
  clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="task-toolbar">
    <ElInput
      v-model="localSearch"
      class="task-toolbar__search"
      placeholder="搜索任务..."
      clearable
      prefix-icon="Search"
    />
    <ElSelect
      v-model="statusFilter"
      class="task-toolbar__filter"
      placeholder="全部状态"
      clearable
    >
      <ElOption
        v-for="opt in STATUS_OPTIONS"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </ElSelect>
    <ElSelect
      v-model="priorityFilter"
      class="task-toolbar__filter"
      placeholder="全部优先级"
      clearable
    >
      <ElOption
        v-for="opt in PRIORITY_OPTIONS"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </ElSelect>
  </div>
</template>

<style scoped>
.task-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.task-toolbar__search {
  flex: 1;
  max-width: 320px;
}

.task-toolbar__filter {
  width: 140px;
}

@media (max-width: 768px) {
  .task-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .task-toolbar__search {
    max-width: none;
  }

  .task-toolbar__filter {
    width: 100%;
  }
}
</style>
