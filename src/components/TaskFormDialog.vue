<script setup>
import { ref, watch, shallowRef } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessageBox } from 'element-plus'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants.js'

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

const formRef = ref(null)
const form = ref({
  title: '',
  status: 'todo',
  priority: 'medium'
})
const isDirty = ref(false)

// 初始化表单的原始值快照，用于脏检测
const initialFormSnapshot = shallowRef(null)

const rules = {
  title: [
    { required: true, whitespace: true, message: '请输入任务标题', trigger: 'blur' },
    { max: 100, message: '标题不能超过 100 个字符', trigger: 'blur' }
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
    if (props.task) {
      form.value = {
        title: props.task.title,
        status: props.task.status,
        priority: props.task.priority
      }
    } else {
      form.value = {
        title: '',
        status: 'todo',
        priority: 'medium'
      }
    }
    isDirty.value = false
    initialFormSnapshot.value = { ...form.value }
    // 清除上次残留的验证错误
    formRef.value?.clearValidate()
  }
})

// 表单变化时标记为 dirty（仅当值真正改变时）
watch(form, () => {
  if (!initialFormSnapshot.value) return
  const s = initialFormSnapshot.value
  isDirty.value = (
    form.value.title !== s.title ||
    form.value.status !== s.status ||
    form.value.priority !== s.priority
  )
}, { deep: true })

async function handleClose() {
  if (isDirty.value) {
    try {
      await ElMessageBox.confirm('有未保存的修改，确定要关闭吗？', '提示', {
        confirmButtonText: '确定关闭',
        cancelButtonText: '继续编辑',
        type: 'warning'
      })
    } catch {
      // 用户选择继续编辑，不关闭弹窗
      return
    }
  }
  isDirty.value = false
  initialFormSnapshot.value = null
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

const dialogTitle = () => props.task ? '编辑任务' : '添加任务'
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="dialogTitle()"
    width="480px"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <ElFormItem label="标题" prop="title">
        <ElInput v-model="form.title" placeholder="请输入任务标题" />
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
    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">确认</ElButton>
    </template>
  </ElDialog>
</template>
