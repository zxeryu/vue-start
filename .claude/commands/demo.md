---
description: "分析git工作区代码变更，在 src/views 目录下生成对应的demo和README文档"
---

## 命令逻辑

该命令会分析 git 工作区中的代码变更，根据变更的包和组件类型，在 `src/views` 目录下生成对应的 demo 和 README 文档。

### 执行流程

1. **分析 git diff**：获取工作区中已修改的文件
2. **识别变更包**：根据文件路径识别变更涉及的包（如 `@vue-start/pro`、`@vue-start/element-pro`）
3. **匹配视图目录**：根据 mappings.md 找到对应的视图目录
4. **生成 demo**：创建 `demo/basic.tsx` 文件
5. **更新 README**：更新根目录下的 README.md 文档

### Demo 文件格式

所有 demo 文件放在 `demo/` 目录下，每个文件以 `/*--- title: ... desc: ... ---*/` 开头。

```tsx
/*---
title: 基础使用
desc: 可选，补充说明
---*/
import { defineComponent } from "vue";

export default defineComponent(() => {
  return () => <div>demo content</div>;
});
```

**解析机制**：`plugin/tsxWithCode.ts` 使用 `gray-matter` 解析 `/*--- ... ---*/` 中的 `title` 和 `desc`，组件会被 `<demo-box>` 包裹渲染 title/desc 标题区域。

### Demo 索引文件

`index.tsx` 为纯引入模式，不做描述、不加 CSS：

```tsx
import { defineComponent } from "vue";
import Basic from "./demo/basic";
import Compose from "./demo/compose";

export default defineComponent(() => {
  return () => (
    <>
      <Basic />
      <Compose />
    </>
  );
});
```

### 综合示例文件格式

综合示例用于展示组件的核心功能和交互能力，应包含多个功能点的组合使用。

```tsx
/*---
title: 综合示例
---*/
import { defineComponent, reactive, ref, computed } from "vue";
import { useWatch } from "@vue-start/hooks";
import { ElMessage } from "element-plus";

export default defineComponent(() => {
  // 状态定义
  const model = reactive({});

  // 列配置
  const columns = [];

  // 功能点：组合展示组件的核心功能
  // - Props 传递（响应式数据、配置对象）
  // - 事件处理（onXxx 回调、v-model 双向绑定）
  // - 状态控制（show/readonly/disable 状态）
  // - 插槽使用（v-slots 自定义渲染）
  // - 联动逻辑（监听变化触发联动）
  // - 扩展配置（convert/transform 数据转换）

  return () => <pro-component model={model} columns={columns} />;
});
```

### 综合示例共性功能要点

综合示例的核心目的是**动态展示/设置组件的各类属性**，让用户直观看到不同属性配置下的效果：

- **属性展示**：展示组件的各类可配置属性及其效果（border、loading、disabled 等）
- **动态切换**：通过开关、表单等控件实时切换属性状态
- **配置联动**：不同属性之间的相互影响（如 disabled 时样式变化）
- **状态反馈**：属性变化后的 UI 实时反馈

### 样式规范

使用 `@emotion/css` 的 `css` 方法，通过 `class={css({})}` 应用样式，避免 `style={}` 内联写法：

```tsx
import { css } from "@emotion/css";

const wrapCls = css({
  position: "absolute", top: 12, left: 12,
  padding: "8px 14px", background: "#fff",
  borderRadius: 8, fontSize: 13,
});

// 使用
<div class={wrapCls}>content</div>
```

### 控制面板组件

demo 中的控制面板（属性切换、状态展示）优先使用 `pro-*` 组件，减少自定义 DOM 和 CSS：

| 组件 | 用途 | 示例 |
|------|------|------|
| `pro-select` | 下拉选择 | `<pro-select v-model={value} options={[...]} />` |
| `pro-radio` | 单选切换 | `<pro-radio v-model={value} options={[...]} optionType="button" />` |
| `pro-search-form` | 搜索/设置表单 | `<pro-search-form model={state} columns={columns} />` |
| `pro-form` | 表单 | `<pro-form model={state} columns={columns} />` |

使用 `options` 数组配置选项：

```tsx
const options = [
  { value: "a", label: "选项A" },
  { value: "b", label: "选项B" },
];
```

### Demo 精简原则

- demo 文件聚焦组件用法，去掉不必要的 CSS 类名和 DOM 层级
- 控制面板用 `pro-*` 组件实现，而非自定义 `<select>` / `<div>` 组合
- 面包屑、标签等用简单 `<span>` + 少量 `css` 类实现，不堆砌样式
- 不需要在 `index.tsx` 中写描述文字和 CSS（由 `/*--- title: desc ---*/` 和 `DemoBox` 处理）

### README 文档格式

```markdown
## {组件名}

{组件简介}

### 功能特性

- 特性1
- 特性2

### API

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 说明 | `type` | default |

### 基础使用

<code id="basic" title="基础使用" />
```
