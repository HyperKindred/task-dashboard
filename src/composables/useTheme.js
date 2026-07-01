import { ref, watch } from 'vue'

const STORAGE_KEY = 'task-dashboard-theme'

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === 'dark'
  } catch (e) {
    console.warn('[task-dashboard] 读取主题设置失败:', e)
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

function saveTheme(dark) {
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch (e) {
    console.warn('[task-dashboard] 写入主题设置失败:', e)
  }
}

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

export const isDark = ref(loadTheme())
applyTheme(isDark.value)

// --- 模块级副作用：整个应用生命周期只执行一次 ---

// 持久化：监听 isDark 变化，自动保存 + 应用主题
watch(isDark, (val) => {
  applyTheme(val)
  saveTheme(val)
})

// 系统主题跟随：用户未手动保存偏好时，跟随系统昼夜切换
try {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  // 首次加载时若用户无保存偏好，以系统偏好为准
  if (localStorage.getItem(STORAGE_KEY) === null) {
    isDark.value = mql.matches
  }
  mql.addEventListener('change', (e) => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      isDark.value = e.matches
    }
  })
} catch {
  // matchMedia 不可用时静默降级
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
