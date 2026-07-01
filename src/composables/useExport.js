import { ElMessage } from 'element-plus'
import { useTasks } from './useTasks.js'

export function useExport() {
  const { tasks } = useTasks()

  function exportTasksAsJson() {
    const blob = new Blob([JSON.stringify(tasks.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const localDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    a.download = `task-dashboard-${localDate}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('任务数据已导出为 JSON')
  }

  return { exportTasksAsJson }
}
