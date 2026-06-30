import { ref, computed } from 'vue'

const STORAGE_KEY = 'task-dashboard-tasks'

let _idCounter = 0

function generateId() {
  try {
    return crypto.randomUUID()
  } catch {
    // HTTP 下 crypto.randomUUID 不可用时的降级方案
    _idCounter++
    const ts = Date.now().toString(36)
    const rand = Math.random().toString(36).slice(2, 10)
    return `${ts}-${rand}-${_idCounter}`
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}

const tasks = ref(loadTasks())
export const searchQuery = ref('')
export const statusFilter = ref('')
export const priorityFilter = ref('')

export function useTasks() {
  const filteredTasks = computed(() => {
    let result = tasks.value
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      result = result.filter(t => t.title.toLowerCase().includes(q))
    }
    if (statusFilter.value) {
      result = result.filter(t => t.status === statusFilter.value)
    }
    if (priorityFilter.value) {
      result = result.filter(t => t.priority === priorityFilter.value)
    }
    return [...result].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  function addTask({ title, status, priority }) {
    const task = {
      id: generateId(),
      title: title.trim(),
      status,
      priority,
      createdAt: new Date().toISOString()
    }
    tasks.value = [task, ...tasks.value]
    return saveTasks(tasks.value)
  }

  function updateTask(id, updates) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx === -1) return true
    const updated = { ...tasks.value[idx], ...updates }
    if (updates.title) updated.title = updates.title.trim()
    tasks.value = [
      ...tasks.value.slice(0, idx),
      updated,
      ...tasks.value.slice(idx + 1)
    ]
    return saveTasks(tasks.value)
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    return saveTasks(tasks.value)
  }

  return {
    tasks,
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    addTask,
    updateTask,
    deleteTask
  }
}
