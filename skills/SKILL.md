---
name: vue-start
description: vue-start 组件库和工具集技能文档索引
---

# vue-start Skills

vue-start 是一个基于 Vue3 的 Monorepo 组件库和工具集。本文档是使用场景路由器，根据你的任务选择对应文档。

## 代码风格

所有示例代码采用 **TSX/JSX 语法**（`@vue/babel-plugin-jsx`），组件名使用 **kebab-case**：

| 规范 | 示例 |
|------|------|
| 组件名 | PascalCase → **kebab-case**：`ProTable` → `pro-table` |
| Props | JSX 语法：`columns={[...]}` |
| 事件 | JSX 语法：`onFinish={handleFinish}` |
| 插槽 | `v-slots` 或 `v-slot:xxx` |

## 使用场景速查

| 你要做什么 | 读这个 |
|-----------|--------|
| 从零开始接入项目 | [setup](references/setup.md) |
| 新建一个 CRUD 页面（列表+新增+编辑+删除） | [pro-curd](references/pro/pro-curd.md) |
| 新建一个纯表单页 | [pro-form](references/pro/pro-form.md) |
| 新建一个纯表格页 | [pro-table](references/pro/pro-table.md) |
| 配置页面布局和菜单 | [pro-layout](references/pro/pro-layout.md) |
| 新建一个列表页（搜索+表格+分页） | [pro-list](references/pro/pro-list.md) |
| 新建一个详情页 | [pro-desc](references/pro/pro-desc.md) |
| 配置操作按钮组 | [pro-operate](references/pro/pro-operate.md) |
| 配置页面容器（标题/返回） | [pro-page](references/pro/pro-page.md) |
| 自定义表单字段类型/扩展组件 | [setup](references/setup.md#自定义扩展) |
| 发起 HTTP 请求 | [request](references/request.md) |
| 全局状态管理 | [store](references/store.md) |
| 运行时配置管理 | [config](references/config.md) |
| 使用原子 CSS 类 | [css](references/css.md) |
| 数据持久化 | [persist](references/persist.md) |
| 加个图表（ECharts） | [chart](references/chart.md) |
| 加个地图 | [map](references/map.md) |
| 预览媒体文件 | [media](references/media.md) |
| 报错了/不显示 | [troubleshooting](references/troubleshooting.md) |
| 所有 Hooks 和工具函数 | [hooks](references/hooks.md) |

## 包结构

```
@vue-start/
├── hooks        # Vue3 Composition API Hooks（无外部依赖）
├── request      # HTTP 请求封装（依赖 axios + rxjs）
├── store        # 状态管理（依赖 rxjs）
├── config       # 配置管理（依赖 js-base64）
├── css          # 样式工具（原子 CSS）
├── chart        # 图表组件（依赖 echarts）
├── map          # 地图组件（依赖 @amap/amap-jsapi-loader）
├── media        # 媒体预览组件
├── pro          # Pro 高级业务组件（依赖 element-pro 或 antd-pro）
├── persist      # 持久化存储（依赖 localforage + store）
├── element-pro  # Element Plus 增强（依赖 element-plus + pro）
└── antd-pro     # Ant Design Vue 增强（依赖 ant-design-vue + pro）
```

## 技术栈

- **框架**: Vue 3.x
- **构建工具**: Vite
- **UI 库**: Element Plus / Ant Design Vue
- **样式**: @emotion/css
- **语言**: TypeScript
- **状态管理**: RxJS

## 文档索引

### 入门

- [项目接入与配置](references/setup.md) — 安装、入口、ProConfig、自定义扩展

### 基础模块

- [Hooks](references/hooks.md)
- [Request](references/request.md)
- [Store](references/store.md)
- [Config](references/config.md)
- [CSS](references/css.md)
- [Persist](references/persist.md)

### 展示模块

- [Chart](references/chart.md)
- [Map](references/map.md)
- [Media](references/media.md)

### UI 增强

- [Element Plus 增强](references/element-pro.md)
- [Ant Design Vue 增强](references/antd-pro.md)

### Pro 组件

- [Pro 总览](references/pro.md) — 组件列表、valueType 速查
  - [Layout](references/pro/pro-layout.md)
  - [Table](references/pro/pro-table.md)
  - [Form](references/pro/pro-form.md)
  - [List](references/pro/pro-list.md)
  - [Page](references/pro/pro-page.md)
  - [Desc](references/pro/pro-desc.md)
  - [Operate](references/pro/pro-operate.md)
  - [CRUD](references/pro/pro-curd.md)

### 其他

- [常见问题](references/troubleshooting.md)