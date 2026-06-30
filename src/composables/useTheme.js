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

const isDark = ref(loadTheme())

// 同步 class（首屏由 index.html 内联脚本保证）
applyTheme(isDark.value)

let _initialized = false

export function useTheme() {
  // watch + OS 监听仅初始化一次，绑定到组件生命周期以支持 HMR 清理
  if (!_initialized) {
    _initialized = true

    watch(isDark, (val) => {
      applyTheme(val)
      saveTheme(val)
    })

    // 无保存偏好时跟随系统主题变化（如 macOS 自动切日夜）
    try {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      mql.addEventListener('change', (e) => {
        try {
          // 用户已手动切换过的不覆盖
          if (localStorage.getItem(STORAGE_KEY) !== null) return
        } catch {
          // localStorage 不可读时继续跟随系统
        }
        isDark.value = e.matches
      })
    } catch {
      // matchMedia 不可用时静默降级
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
