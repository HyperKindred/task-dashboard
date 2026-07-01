<script setup>
import { ref, watch, shallowRef, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElTag, ElMessageBox } from 'element-plus'
import { EditPen, Close } from '@element-plus/icons-vue'
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_TAG_TYPE, PRIORITY_TAG_TYPE, formatTime } from '../constants.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'saved'])

const isEditing = ref(false)
const isCreateMode = computed(() => !props.task)
const formRef = ref(null)

const form = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium'
})
const isDirty = ref(false)
const initialFormSnapshot = shallowRef(null)

const rules = {
  title: [
    { required: true, whitespace: true, message: '请输入任务标题', trigger: 'blur' },
    { max: 100, message: '标题不能超过 100 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
}

watch(() => props.visible, (val) => {
  if (val) {
    isEditing.value = isCreateMode.value
    if (props.task) {
      form.value = {
        title: props.task.title,
        description: props.task.description || '',
        status: props.task.status,
        priority: props.task.priority
      }
    } else {
      form.value = {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium'
      }
    }
    isDirty.value = false
    initialFormSnapshot.value = { ...form.value }
    formRef.value?.clearValidate()
  }
})

watch(form, () => {
  if (!initialFormSnapshot.value) return
  const s = initialFormSnapshot.value
  isDirty.value = (
    form.value.title !== s.title ||
    form.value.description !== s.description ||
    form.value.status !== s.status ||
    form.value.priority !== s.priority
  )
})

function startEditing() {
  isEditing.value = true
  initialFormSnapshot.value = { ...form.value }
  isDirty.value = false
}

async function handleCancel() {
  if (isDirty.value) {
    try {
      await ElMessageBox.confirm('有未保存的修改，确定要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '继续编辑',
        type: 'warning'
      })
    } catch {
      return
    }
  }
  if (isCreateMode.value) {
    emit('update:visible', false)
  } else {
    // 取消编辑：重置表单到原始数据，防止下次进入编辑时显示过期值
    if (props.task) {
      form.value = {
        title: props.task.title,
        description: props.task.description || '',
        status: props.task.status,
        priority: props.task.priority
      }
    }
    isEditing.value = false
    isDirty.value = false
    initialFormSnapshot.value = null
    formRef.value?.clearValidate()
  }
}

async function handleClose() {
  if (isDirty.value) {
    try {
      await ElMessageBox.confirm('有未保存的修改，确定要关闭吗？', '提示', {
        confirmButtonText: '确定关闭',
        cancelButtonText: '继续编辑',
        type: 'warning'
      })
    } catch {
      return
    }
  }
  isEditing.value = false
  emit('update:visible', false)
}

async function handleConfirm() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    isDirty.value = false
    initialFormSnapshot.value = null
    emit('saved', { ...form.value })
  } catch {
    // 验证不通过，不做处理
  }
}

function statusLabel(value) {
  const opt = STATUS_OPTIONS.find(o => o.value === value)
  return opt ? opt.label : value
}

function priorityLabel(value) {
  const opt = PRIORITY_OPTIONS.find(o => o.value === value)
  return opt ? opt.label : value
}

const dialogTitle = computed(() => {
  if (isCreateMode.value) return '添加任务'
  return isEditing.value ? '编辑任务' : '任务详情'
})
</script>

<template>
  <ElDialog
    :model-value="visible"
    width="500px"
    :show-close="false"
    @close="handleClose"
    class="task-detail-dialog"
  >
    <template #header>
      <div class="task-detail-dialog__header">
        <span class="el-dialog__title">{{ dialogTitle }}</span>
        <div class="task-detail-dialog__header-actions">
          <ElButton
            v-if="!isCreateMode && !isEditing"
            :icon="EditPen"
            circle
            size="small"
            @click="startEditing"
          />
          <ElButton
            :icon="Close"
            circle
            size="small"
            @click="handleClose"
          />
        </div>
      </div>
    </template>

    <!-- 详情查看模式 -->
    <div class="dialog-content">
      <div v-if="!isCreateMode && !isEditing" class="detail-view">
        <div class="detail-view__field">
          <span class="detail-view__label">标题</span>
          <span class="detail-view__value detail-view__value--title">{{ task.title }}</span>
        </div>
        <div class="detail-view__field detail-view__field--desc">
          <span class="detail-view__label">描述</span>
          <p v-if="task.description" class="detail-view__value detail-view__value--desc">
            {{ task.description }}
          </p>
          <span v-else class="detail-view__value--empty">暂无描述</span>
        </div>
        <div class="detail-view__field">
          <span class="detail-view__label">状态</span>
          <div class="detail-view__value">
            <ElTag :type="STATUS_TAG_TYPE[task.status] || 'info'" size="small">
              {{ statusLabel(task.status) }}
            </ElTag>
          </div>
        </div>
        <div class="detail-view__field">
          <span class="detail-view__label">优先级</span>
          <div class="detail-view__value">
            <ElTag :type="PRIORITY_TAG_TYPE[task.priority] || 'info'" size="small">
              {{ priorityLabel(task.priority) }}
            </ElTag>
          </div>
        </div>
        <div class="detail-view__field">
          <span class="detail-view__label">创建时间</span>
          <span class="detail-view__value">{{ formatTime(task.createdAt) }}</span>
        </div>
        <div v-if="task.updatedAt" class="detail-view__field">
          <span class="detail-view__label">最后修改</span>
          <span class="detail-view__value">{{ formatTime(task.updatedAt) }}</span>
        </div>
      </div>

      <!-- 编辑 / 添加模式 -->
      <ElForm
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <ElFormItem label="标题" prop="title">
          <ElInput v-model="form.title" placeholder="请输入任务标题" />
        </ElFormItem>
        <ElFormItem label="描述" prop="description">
          <ElInput
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="任务描述（选填）"
            maxlength="500"
            show-word-limit
          />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElSelect v-model="form.status" placeholder="请选择状态">
            <ElOption
              v-for="opt in STATUS_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="优先级" prop="priority">
          <ElSelect v-model="form.priority" placeholder="请选择优先级">
            <ElOption
              v-for="opt in PRIORITY_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </div>

    <template #footer>
      <template v-if="isEditing || isCreateMode">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleConfirm">保存</ElButton>
      </template>
      <template v-else>
        <ElButton @click="handleClose">关闭</ElButton>
      </template>
    </template>
  </ElDialog>
</template>

<style scoped>
/* ===== 自定义对话框头部 ===== */
.task-detail-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
}

.task-detail-dialog__header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== 详情查看模式 ===== */
.detail-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-view__field {
  display: flex;
  gap: 12px;
}

.detail-view__field--desc {
  /* 描述区域允许换行 */
  align-items: flex-start;
}

.detail-view__label {
  flex-shrink: 0;
  width: 80px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.detail-view__value {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
  word-break: break-word;
}

.detail-view__value--title {
  font-weight: 600;
  font-size: 16px;
}

.detail-view__value--desc {
  margin: 0;
  white-space: pre-wrap;
}

.detail-view__value--empty {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
  font-style: italic;
}

/* ===== textarea 滚动条 & 主题适配 ===== */
.dialog-content {
  max-height: 420px;
  overflow-y: auto;
  padding: 4px 0;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
  padding-bottom: 20px;
}

:deep(.el-textarea__inner) {
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) transparent;
  padding-bottom: 28px;
}

:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background: var(--el-border-color-darker);
  border-radius: 3px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb:hover) {
  background: var(--el-text-color-secondary);
}
</style>
