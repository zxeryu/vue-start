# Pro 表格组件

## ProTable

基于 Element Plus Table 的增强表格组件。

```tsx
<ProTable
  :columns="columns"
  :dataSource="dataList"
  :paginationState="pageState"
/>
```

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TTableColumns` |
| `dataSource` | 数据源 | `Record<string, any>[]` |
| `column` | 公共列配置 | `TTableColumn` |
| `columnEmptyText` | 空值显示文本 | `string` |
| `serialNumber` | 序号列 | `boolean \| object` |
| `paginationState` | 分页状态 | `{ page, pageSize }` |
| `rowKey` | 行唯一标识 | `string` |
| `operate` | 操作栏配置 | `ITableOperate` |
| `toolbar` | 工具栏配置 | `{ columnSetting? }` |
| `mergeOpts` | 合并配置 | `TTableMergeOpts` |
| `virtual` | 虚拟滚动 | `boolean` |

### 插槽

| 名称 | 说明 |
|------|------|
| `toolbar` | 工具栏 |
| `toolbarExtra` | 工具栏额外内容 |
| `columnSetting` | 列设置 |

## TableColumn

表格列配置，继承 TColumn。

```ts
interface TTableColumn extends TColumn {
  children?: TTableColumn[];     // 子列
  customRender?: (opt) => VNode; // 自定义渲染
  fixed?: boolean | string;      // 固定列
  width?: number | string;       // 列宽
}
```

### 示例

```ts
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '名称', dataIndex: 'name' },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ value }) => value ? '启用' : '禁用'
  },
  {
    title: '金额',
    children: [
      { title: '收入', dataIndex: 'income' },
      { title: '支出', dataIndex: 'expense' },
    ]
  }
];
```

## 操作栏

### ITableOperate

```ts
interface ITableOperate {
  column?: TColumn;              // 列配置
  items?: IOperateItem[];        // 操作项
  itemState?: Record<string, IOperateItem>; // 操作项状态
}
```

### IOperateItem

```ts
interface IOperateItem {
  value: string | number;         // 唯一标识
  label?: string;                 // 显示文本
  show?: boolean | ((record) => boolean);    // 显示条件
  disabled?: boolean | ((record) => boolean); // 禁用条件
  loading?: boolean | ((record) => boolean);  // 加载状态
  onClick?: (record) => void;     // 点击事件
  routeOpts?: { name: string; query: string[] }; // 路由跳转
  per?: string;                   // 权限标识
  tip?: string;                   // 提示文本
}
```

### 示例

```tsx
<ProTable
  :columns="columns"
  :operate="{
    items: [
      { value: 'edit', label: '编辑', onClick: handleEdit },
      { value: 'delete', label: '删除', show: (record) => record.status === 1 },
      { value: 'detail', label: '详情', routeOpts: { name: 'Detail', query: ['id'] } }
    ]
  }"
/>
```

## ColumnSetting

列设置组件。

```tsx
<ProTable
  :toolbar="{ columnSetting: {} }"
/>
```

## 使用 Hooks

```ts
import { useProTable } from "@vue-start/pro";

const { columns, selectIdsRef } = useProTable();
```

### Provide

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `Ref<TTableColumns>` |
| `originColumns` | 原始列配置 | `Ref<TTableColumns>` |
| `selectIdsRef` | 选中列 ID | `Ref<string[]>` |
