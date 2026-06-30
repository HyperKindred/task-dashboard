# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 项目概览

一个 **task-dashboard**，基于 Vue 3、Vite 8 和 Element Plus 构建。目前从 Vite + Vue 起始模板搭建，处于早期开发阶段。

## 项目目标

做一个单页应用，用于管理个人每日任务。核心是增删改查 + 数据持久化，但我们要把它做得“像个真实企业项目”。

## 技术选型

Vue 3 + Vite + Element Plus

## 功能需求
- **任务列表展示**：卡片或表格形式展示所有任务，包含标题、状态（待办/进行中/已完成）、优先级（高/中/低）、创建时间
- **添加任务**：弹窗或表单，填写标题、状态、优先级
- **编辑任务**：点击任务可编辑标题、状态、优先级
- **删除任务**：单个删除，删除前有确认弹窗
- **搜索/筛选**：按关键词搜索标题；按下拉筛选状态和优先级
- **数据持久化**：使用 localStorage 存储，刷新页面数据不丢失
- **响应式布局**：在手机和电脑上都能正常使用


## 常用命令

```bash
# 启动开发服务器（含 HMR 热更新）
npm run dev

# 构建生产版本
npm run build

# 本地预览生产构建
npm run preview
```

尚未配置测试或 lint 命令。

## 架构

- **框架**：Vue 3，使用 `<script setup>` SFC（组合式 API）
- **构建工具**：Vite 8，配置于 [vite.config.js](vite.config.js)，使用 `@vitejs/plugin-vue` 插件
- **UI 库**：Element Plus（`element-plus`）——已添加为依赖，但尚未在应用中引入
- **入口**：[index.html](index.html) 加载 [src/main.js](src/main.js)，创建 Vue 应用并挂载到 `#app`
- **根组件**：[src/App.vue](src/App.vue)——当前渲染 `HelloWorld`，无路由
- **样式**：[src/style.css](src/style.css) 中的全局 CSS，使用 CSS 自定义属性实现主题（通过 `prefers-color-scheme` 支持亮色/暗色）
- **图标**：[public/icons.svg](public/icons.svg) 中的 SVG 精灵系统，通过 `<use href="/icons.svg#图标名称">` 引用

## 文件结构

```
task-dashboard/
├── index.html            # HTML 入口
├── vite.config.js         # Vite 配置
├── package.json           # 依赖和脚本
├── public/
│   ├── favicon.svg
│   └── icons.svg          # SVG 图标精灵
└── src/
    ├── main.js            # 应用启动
    ├── App.vue            # 根组件
    ├── style.css          # 全局样式（亮色/暗色主题）
    ├── assets/            # 静态资源（图片）
    └── components/
        └── HelloWorld.vue  # 起始组件（占位）
```

## 注意事项

- 尚未配置路由库——当前为单页应用，未使用 Vue Router
- 尚未配置状态管理库
- VSCode 推荐插件：`Vue.volar`（见 [.vscode/extensions.json](.vscode/extensions.json)）
- 项目在 package.json 中使用 `"type": "module"` 启用 ESM 导入
- 尚未设置测试、linter 或格式化工具


## 规范

### 性能优化（必须做）
- 列表渲染：v-for / map 里用唯一 id 作为 key
- 搜索防抖：输入框搜索用 debounce（延迟 300ms）
- 路由懒加载（如果用路由）：() => import()
- 组件懒加载：弹窗/抽屉等非首屏组件用 defineAsyncComponent 或 React.lazy

### 代码质量（必须做）
- 防御性编程：所有从 localStorage 读取的数据，用 try-catch 包裹，并给默认值
- 空状态处理：列表为空时显示“暂无任务”占位图
- 加载状态：模拟异步请求时显示 loading 骨架屏或 Spin
- 错误边界（React）或 try-catch 包裹异步操作
- 删除确认：删除前弹窗二次确认

### 工程化规范（强烈建议）
- 创建 CLAUDE.md：放在项目根目录，写清技术栈、目录结构、运行命令
- 用 Claude Code / Cursor 辅助开发：先 /init，再用 Plan Mode 规划，再执行
- 代码格式化：配置 Prettier 和 ESLint（哪怕只配最基础的）

### Git 规范（加分项）
- 使用 feat: 添加任务列表、fix: 修复搜索防抖 这样的 commit 格式
- 至少创建一个分支（如 dev）再合并回 main