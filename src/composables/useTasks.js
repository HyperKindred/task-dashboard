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
    if (!Array.isArray(data)) return []
    // 兼容旧数据：新增字段时给缺失的字段设默认值
    return data.map(t => ({
      ...t,
      description: t.description ?? ''
    }))
  } catch (e) {
    console.warn('[task-dashboard] 读取 localStorage 失败，数据已损坏或不存在:', e)
    return []
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch (e) {
    console.warn('[task-dashboard] 写入 localStorage 失败:', e)
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
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      )
    }
    if (statusFilter.value) {
      result = result.filter(t => t.status === statusFilter.value)
    }
    if (priorityFilter.value) {
      result = result.filter(t => t.priority === priorityFilter.value)
    }
    // 空结果或无筛选时跳过排序
    if (result.length < 2) return [...result]
    return [...result].sort((a, b) => {
      const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (timeDiff !== 0) return timeDiff
      // 时间相同时按 id 排序，保证顺序稳定
      return a.id < b.id ? 1 : -1
    })
  })

  function addTask({ title, description, status, priority }) {
    const now = new Date().toISOString()
    const task = {
      id: generateId(),
      title: title.trim(),
      description: (description || '').trim(),
      status,
      priority,
      createdAt: now,
      updatedAt: now
    }
    tasks.value = [task, ...tasks.value]
    return saveTasks(tasks.value)
  }

  function updateTask(id, updates) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx === -1) {
      console.warn('[task-dashboard] 更新失败：未找到 id 为', id, '的任务')
      return false
    }
    const now = new Date().toISOString()
    const updated = { ...tasks.value[idx], ...updates, updatedAt: now }
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
