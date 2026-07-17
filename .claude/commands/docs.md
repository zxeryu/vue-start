---
description: "更新 skills 文档"
---

# 斜杠命令：更新 skills 文档

## 命令目的

分析 git 工作区代码变化，参考 src/views 目录下的 demo 实现，更新 skills 目录下对应的文档。

## 工作流程

1. **分析阶段**：读取 git 工作区新增/修改的代码文件
2. **对照阶段**：在 src/views 目录查找对应 demo 示例
3. **更新阶段**：更新 skills/references 目录下对应的 .md 文档
4. **新增阶段**：如无对应文档，则新建文档

详细目录映射规则见 [mappings.md](./mappings.md)

## 文档结构

- skills/references/pro.md - Pro 组件总览
- skills/references/pro/pro-form.md - 表单组件
- skills/references/pro/pro-table.md - 表格组件
- skills/references/pro/pro-curd.md - CRUD 组件
- skills/references/pro/pro-module.md - 模块组件 (待新增)

## 示例

当 git 工作区新增 CompElement.tsx 文件时：
1. 分析代码中使用的组件（ProModule、useProModule 等）
2. 在 src/views 查找 module 相关 demo
3. 更新或新建 skills/references/pro/pro-module.md

## 文档编写规范

### 入口文件（SKILL.md）

- 必须是**场景路由器**：按"你要做什么 → 读哪个"组织，不是按包名罗列
- 每个场景指向 1-2 个文件

### 组件文档

- 覆盖**组件关系图**（ASCII 图），展示语法糖与子组件的层级关系
- 同时覆盖**组合模式**和**拆分模式**（如 pro-curd-module 的三种用法）
- 列出"适用场景表格"：组合模式/拆分+内置/拆分+自定义

### Props 透传

- 透传的 props 不要写成 `object`，必须标注**透传目标**和**关键属性**
- 示例：`listProps` → 透传给 pro-list，展开 `searchProps`、`tableProps`、`paginationProps`

### 代码示例

- 必须包含 `import` 语句
- 展示**真实业务场景**（如 Tabs 切换、自定义弹窗、审核记录），不是玩具示例
- 同时覆盖简单用法和复杂用法

### 类型签名

- 所有 hooks 和函数提供完整 TypeScript 类型签名
- 类型定义跟随组件文档，不单独建文件

### 文档结构

每个组件文档按此顺序：Props → Events → Slots → 综合示例 → 核心类型

### Token 效率

- 合并 < 200 行的短文档
- 不重复类型定义
- 文件数最小化

### 交叉引用

- 底层组件开头标注"通常由哪个上层组件透传配置"
- 上层组件透传的 props 链接到底层组件文档
- 所有链接使用相对路径