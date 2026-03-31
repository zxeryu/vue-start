---
description: "分析git工作区代码变更，在 src/views 目录下生成对应的demo和README文档"
---

## 命令逻辑

该命令会分析 git 工作区中的代码变更，根据变更的包和组件类型，在 `src/views` 目录下生成对应的 demo 和 README 文档。

### 执行流程

1. **分析 git diff**：获取工作区中已修改的文件
2. **识别变更包**：根据文件路径识别变更涉及的包（如 `@vue-start/pro`、`@vue-start/element-pro`）
3. **匹配组件类型**：根据文件路径识别变更的组件类型（如 form、table、layout）
4. **生成 demo**：在对应的 `src/views/{ui}/{component}/demo/` 目录下创建或更新 demo 文件
5. **更新 README**：更新对应目录下的 README.md 文档

### 目录映射规则

详细目录映射规则见 [mappings.md](./mappings.md)

### 示例

**场景**：在 `@vue-start/pro` 中有 form 相关的代码更新

1. 分析 git diff，发现 `@vue-start/pro/src/comp/form/Form.tsx` 文件有变更
2. 识别组件类型：`form`
3. 在 `src/views/element/form/demo/` 中新增或修改对应 demo
4. 更新 `src/views/element/form/README.md` 文档

**注意**：demo 文件需遵循现有命名规范（如 `basic.tsx`、`field-change.tsx` 等）