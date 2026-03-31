---
description: "更新skills文档"
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
