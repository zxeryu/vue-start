# Pro 表单组件

## ProForm

基于 Element Plus Form 的增强表单组件。

```tsx
<ProForm
  :columns="columns"
  :columnState="columnState"
  @finish="handleFinish"
/>
```

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TColumns` |
| `columnState` | 列状态 | `Record<string, any>` |
| `columnState2` | 列状态2 | `Record<string, any>` |
| `elementMap` | 展示组件集 | `TElementMap` |
| `formElementMap` | 录入组件集 | `TElementMap` |
| `readonly` | 只读模式 | `boolean` |
| `showState` | 显示状态控制 | `Record<string, boolean>` |
| `readonlyState` | 只读状态控制 | `Record<string, boolean>` |
| `disableState` | 禁用状态控制 | `Record<string, boolean>` |
| `row` | Grid Row 配置 | `object` |
| `col` | Grid Col 配置 | `object` |

### Events

| 事件 | 说明 | 参数 |
|------|------|------|
| `finish` | 表单提交 | `(values) => void` |

### 值类型

通过 `valueType` 指定字段类型：

```ts
columns = [
  { dataIndex: 'name', valueType: 'text' },           // 文本输入
  { dataIndex: 'status', valueType: 'select', formFieldProps: { options: [] } },  // 选择
  { dataIndex: 'date', valueType: 'date' },          // 日期
  { dataIndex: 'dateRange', valueType: 'dateRange' }, // 日期范围
  { dataIndex: 'image', valueType: 'image' },        // 图片
  { dataIndex: 'file', valueType: 'file' },          // 文件
  { dataIndex: 'switch', valueType: 'switch' },      // 开关
  { dataIndex: 'radio', valueType: 'radio' },        // 单选
  { dataIndex: 'checkbox', valueType: 'checkbox' },  // 多选
  { dataIndex: 'textarea', valueType: 'textarea' }, // 多行文本
  { dataIndex: 'digit', valueType: 'digit' },         // 数字
  { dataIndex: 'password', valueType: 'password' },   // 密码
  { dataIndex: 'cascader', valueType: 'cascader' },   // 级联选择
  { dataIndex: 'treeSelect', valueType: 'treeSelect' }, // 树形选择
]
```

### 状态控制

```tsx
<ProForm
  :columns="columns"
  :readonlyState="{ name: true }"
  :disableState="{ status: formState.type === 'edit' }"
>
```

## SearchForm

搜索表单，继承 ProForm。

```tsx
<SearchForm
  :columns="searchColumns"
  searchMode="MANUAL"
  @finish="handleSearch"
/>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `initEmit` | 初始化触发搜索 | `boolean` | - |
| `searchMode` | 搜索模式 | `AUTO` / `MANUAL` | - |
| `debounceKeys` | 防抖字段 | `string[]` | - |
| `debounceTime` | 防抖时间 | `number` | 300 |

## ProFormItem

表单项组件。

```tsx
<ProFormItem name="name" label="名称">
  <ElInput v-model="form.name" />
</ProFormItem>
```

## ProFormList

动态表单项。

```tsx
<ProFormList name="users">
  <ProFormText name="name" label="姓名" />
  <ProFormText name="age" label="年龄" />
</ProFormList>
```

### Slots

| 名称 | 说明 |
|------|------|
| `itemAdd` | 添加按钮 |
| `itemMinus` | 删除按钮 |
| `add` | 整体添加按钮 |
