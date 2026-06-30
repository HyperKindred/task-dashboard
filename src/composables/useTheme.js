import { ref, watch } from 'vue'

const STORAGE_KEY = 'task-dashboard-theme'

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === 'dark'
  } catch (e) {
    console.warn('[task-dashboard] 读取主题设置失败:', e)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function saveTheme(dark) {
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    return true
  } catch (e) {
    console.warn('[task-dashboard] 写入主题设置失败:', e)
    return false
  }
}

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

const isDark = ref(loadTheme())

// 初始化时立即应用主题
applyTheme(isDark.value)

// 监听变化：同步 class + 持久化
watch(isDark, (val) => {
  applyTheme(val)
  saveTheme(val)
})

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(dark) {
    isDark.value = dark
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
