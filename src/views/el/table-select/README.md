## ProTableSelect

表格选择组件，类似于 el-select、el-tree-select、el-cascader 等选择组件模式。

### 功能特性

- 支持单选、多选模式
- 弹出层使用 ProCurdModule 实现
- 支持 Modal 和 Popover 两种弹出类型
- 触发组件展示类似 el-select 的单选/多选(tags)模式
- 支持 v-model
- 支持 collapse-tags 折叠标签展示
- 支持 trigger 插槽自定义触发器

## API

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` / `v-model` | 绑定值 | `number \| number[] \| string \| string[]` | - |
| `multiple` | 是否多选 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `clearable` | 是否显示清除按钮 | `boolean` | `false` |
| `fieldNames` | 字段映射配置 | `{ label?: string; value?: string }` | `{ value: 'value', label: 'label' }` |
| `curdModuleProps` | curdModule 配置 | `Record<string, any>` | - |
| `popupType` | 弹出类型 | `'modal' \| 'popover'` | `'modal'` |
| `modalProps` | 弹窗配置 | `Record<string, any>` | - |
| `popoverProps` | 弹窗配置 | `Record<string, any>` | - |
| `collapseTags` | 是否折叠标签 | `boolean` | `false` |
| `collapseTagsTooltip` | 折叠标签显示 tooltip | `boolean` | `false` |
| `maxCollapseTags` | 最大折叠标签数 | `number` | `3` |
| `showPopupTags` | 是否在弹出层中显示 TagsList | `boolean` | `false` |
| `options` | 回显选项数据 | `Record<string, any>[]` | - |
| `separator$` | 值分隔符（用于解析/格式化字符串值） | `string` | - |
| `parseValue$` | 自定义值解析函数 | `(value: any, props: any) => any` | - |
| `formatValue$` | 自定义值格式化函数 | `(value: any, props: any) => any` | - |
| `onChange` | 选择变化回调 | `(value: any, rows: any) => void` | - |

### 插槽

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| `trigger` | 自定义触发器 | `triggerProps` 对象，包含 options、label、disabled、placeholder、clearable、isFocused、collapseTags、collapseTagsTooltip、maxCollapseTags、onClick、onClear、onRemove |

### 单选模式

<code id="single" title="单选模式" />

### 多选模式

<code id="multiple" title="多选模式" />

### trigger 插槽

<code id="trigger-slot" title="trigger 插槽" />

### 组合

<code id="compose" title="组合" />