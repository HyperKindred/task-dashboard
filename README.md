# 任务看板（Task Dashboard）

基于 Vue 3 + Vite + Element Plus 构建的**个人每日任务管理**单页应用。

## 特性

- **任务管理**：增删改查，支持标题、状态（待办/进行中/已完成）、优先级（高/中/低）
- **搜索筛选**：按关键词搜索，按状态/优先级下拉筛选
- **数据持久化**：localStorage 存储，刷新不丢失
- **响应式布局**：桌面 Grid 多列，移动端单列适配
- **亮/暗主题**：跟随系统 `prefers-color-scheme`
- **防抖搜索**：300ms 防抖，避免频繁过滤
- **删除确认**：删除前二次确认弹窗
- **未保存提示**：关闭编辑弹窗时检测未保存修改

## 技术栈

| 技术 | 版本 |
|------|------|
| Vue | 3.5 |
| Vite | 8 |
| Element Plus | 2.14 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（含 HMR 热更新）
npm run dev

# 构建生产版本
npm run build

# 本地预览生产构建
npm run preview
```

## 项目结构

```
task-dashboard/
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json                # 依赖和脚本
├── CLAUDE.md                   # Claude Code 项目指引
├── public/
│   └── favicon.svg             # 网站图标
└── src/
    ├── main.js                 # 应用启动（注册 Element Plus）
    ├── App.vue                 # 根组件（编排布局）
    ├── style.css               # 全局样式（亮色/暗色主题字体）
    ├── constants.js            # 常量（状态、优先级选项 + 工具函数）
    ├── composables/
    │   └── useTasks.js         # 任务数据层（CRUD + localStorage 持久化）
    └── components/
        ├── TaskHeader.vue      # 页头标题 + 添加按钮
        ├── TaskToolbar.vue     # 搜索框 + 状态/优先级筛选
        ├── TaskList.vue        # 响应式 Grid 卡片列表
        ├── TaskCard.vue        # 单个任务卡片
        ├── TaskEmpty.vue       # 空状态占位
        └── TaskFormDialog.vue  # 添加/编辑弹窗表单
```
