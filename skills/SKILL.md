---
name: vue-start
description: vue-start 组件库和工具集技能文档索引
---

# vue-start Skills

## 概述

vue-start 是一个基于 Vue3 的 Monorepo 组件库和工具集，提供了一系列开箱即用的组件和 hooks。

## 代码风格说明

本文档所有示例代码均采用 **TSX/JSX 语法**，由 `defineComponent` 创建的组件，组件名使用 **kebab-case**：

```tsx
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => {
      return (
        <pro-table columns={columns} dataSource={dataSource} />
      );
    };
  },
});
```

### 语法规范

| 规范 | 示例 |
|------|------|
| 组件名 | PascalCase → **kebab-case**：`ProTable` → `pro-table` |
| Props | 使用 JSX 语法：`columns={[...]}` |
| 事件 | 使用 JSX 语法：`onFinish={handleFinish}` |
| 插槽 | 使用 `v-slots` 或 `v-slot:xxx` |

---

## 包结构

```
@vue-start/
├── hooks      # Vue3 Composition API Hooks
├── request    # HTTP 请求封装
├── store      # 状态管理
├── config     # 配置管理
├── css        # 样式工具
├── chart      # 图表组件
├── map        # 地图组件
├── media      # 媒体组件
├── pro        # Pro 高级组件
├── persist    # 持久化存储
├── element-pro # Element Plus 增强
├── antd-pro   # Ant Design Vue 增强
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

## 技术栈

- **框架**: Vue 3.x
- **构建工具**: Vite
- **UI库**: Ant Design Vue / Element Plus
- **样式**: @emotion/css
- **语言**: TypeScript

---

## 相关资源

### 基础模块

- [Hooks 使用指南](references/hooks.md)
- [Request 使用指南](references/request.md)
- [Store 使用指南](references/store.md)
- [Config 使用指南](references/config.md)
- [CSS 使用指南](references/css.md)
- [Persist 使用指南](references/persist.md)

### 展示模块

- [Chart 使用指南](references/chart.md)
- [Map 使用指南](references/map.md)
- [Media 使用指南](references/media.md)

### UI 增强

- [Element Plus 增强](references/element-pro.md)
- [Ant Design Vue 增强](references/antd-pro.md)

### Pro 组件

- [Pro 使用指南](references/pro.md) - 全局配置、权限、主题、国际化
  - [Layout 布局](references/pro/pro-layout.md)
  - [Table 表格](references/pro/pro-table.md)
  - [Form 表单](references/pro/pro-form.md)
  - [List 列表](references/pro/pro-list.md)
  - [Page 页面](references/pro/pro-page.md)
  - [Desc 详情](references/pro/pro-desc.md)
  - [Operate 操作栏](references/pro/pro-operate.md)
  - [CRUD 业务组件](references/pro/pro-curd.md)
