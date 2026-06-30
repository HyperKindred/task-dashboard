# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 项目概览

一个 **task-dashboard**，基于 Vue 3、Vite 8 和 Element Plus 构建的单页应用，用于管理个人每日任务。核心是增删改查 + localStorage 数据持久化。

当前处于活跃开发阶段，已完成功能：
- 任务卡片展示（响应式 Grid）
- 添加/编辑/删除任务
- 搜索防抖 + 状态/优先级筛选
- 删除确认弹窗 + 未保存修改提示
- 亮色/暗色主题

## 技术选型

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API, `<script setup>`) | UI 框架 |
| Vite 8 | 构建工具 |
| Element Plus 2.x | UI 组件库 |
| CSS Custom Properties | 主题控制 |

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
- **UI 库**：Element Plus（全局注册于 [src/main.js](src/main.js)）
- **数据层**：模块级 Composable `useTasks.js`，将响应式状态定义在模块作用域，所有调用方共享同一实例
- **入口**：[index.html](index.html) 加载 [src/main.js](src/main.js)，创建 Vue 应用并挂载到 `#app`
- **根组件**：[src/App.vue](src/App.vue) — 编排 Header、Toolbar、TaskList、FormDialog
- **样式**：[src/style.css](src/style.css) 中仅保留必要全局字体样式，主体样式由 Element Plus 提供
- **持久化**：localStorage，读写均包裹 try-catch

## 文件结构

```
task-dashboard/
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json                # 依赖和脚本
├── CLAUDE.md                   # 本文件
├── README.md                   # 项目说明
├── .claude/
│   └── settings.local.json     # Claude Code 权限配置
├── .vscode/
│   └── extensions.json         # 推荐插件
├── public/
│   └── favicon.svg             # 网站图标
└── src/
    ├── main.js                 # 应用启动（注册 Element Plus）
    ├── App.vue                 # 根组件
    ├── style.css               # 全局样式
    ├── constants.js            # 常量（状态/优先级选项 + formatTime）
    ├── composables/
    │   └── useTasks.js         # 任务 CRUD + 筛选逻辑
    └── components/
        ├── TaskHeader.vue      # 页头 + 添加按钮
        ├── TaskToolbar.vue     # 搜索（防抖）+ 筛选
        ├── TaskList.vue        # 卡片列表容器
        ├── TaskCard.vue        # 单张任务卡片
        ├── TaskEmpty.vue       # 空状态占位
        └── TaskFormDialog.vue  # 添加/编辑弹窗
```

## 开发约定

### 性能
- v-for / map 里用唯一 id 作为 key
- 搜索输入框用 debounce（延迟 300ms）
- 弹窗/抽屉等非首屏组件用 defineAsyncComponent 懒加载

### 代码质量
- 所有 localStorage 读取用 try-catch 包裹，给默认值，失败时输出 console.warn
- 列表为空时显示"暂无任务"占位图
- try-catch 包裹异步操作
- 删除前二次确认

### Git 规范
- 使用 feat: / fix: / refactor: 等 commit 格式
- 在 dev 分支开发，合并回 main

## 注意事项

- 无路由库（单页应用）
- 无状态管理库（Composable 模块级状态足以满足当前需求）
- 项目在 package.json 中使用 `"type": "module"` 启用 ESM
- VSCode 推荐插件：`Vue.volar`
- **请勿引用 `icons.svg` 中已清理的图标**——初始模板的社交图标已在清理中移除
