export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '已完成' }
]

export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
]

export const STATUS_TAG_TYPE = {
  todo: 'info',
  'in-progress': 'warning',
  done: 'success'
}

export const PRIORITY_TAG_TYPE = {
  high: 'danger',
  medium: 'warning',
  low: 'info'
}

/**
 * 格式化 ISO 时间为本地可读字符串
 * @param {string} iso - ISO 8601 时间字符串
 * @returns {string} 格式化的 "YYYY-MM-DD HH:mm"
 */
export function formatTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}
