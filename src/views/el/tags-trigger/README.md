## TagsTrigger

触发器组件，用于展示已选中的标签列表，支持类似 el-select 的交互体验。

### 功能特性

- 支持 tags 列表展示
- 支持折叠标签（collapse-tags）模式
- 支持折叠标签 Tooltip 提示
- 支持禁用状态
- 支持清除按钮
- 支持自定义关闭和箭头图标

### API

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `options` | 选项数据 | `{ label: string; value: any }[]` | - |
| `collapseTags` | 是否折叠标签 | `boolean` | `false` |
| `collapseTagsTooltip` | 折叠标签显示 Tooltip | `boolean` | `false` |
| `maxCollapseTags` | 最大折叠标签数 | `number` | `1` |
| `closable` | 单个 tag 是否可关闭 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `label` | 显示文本（非选中状态） | `string` | - |
| `placeholder` | 占位文本 | `string` | - |
| `isFocused` | 是否聚焦 | `boolean` | `false` |
| `clearable` | 是否显示清除按钮 | `boolean` | `false` |
| `onRemove` | 移除标签回调 | `(value: any) => void` | - |
| `onClick` | 点击触发器回调 | `() => void` | - |
| `onClear` | 清除回调 | `() => void` | - |
| `renderClose` | 自定义关闭图标渲染 | `() => VNode` | - |
| `renderArrow` | 自定义箭头图标渲染 | `() => VNode` | - |

### 基础使用

<code id="basic" title="基础使用" />
