# Pro CRUD 业务组件

## ProCurdModule（推荐）

聚合组件，组合了列表、搜索、分页、弹窗表单等完整 CRUD 功能。

### 工作模式

```
listType="page"  →  ProCurdListPage（页面布局 + 列表）
listType="list"  →  ProCurdList（搜索在工具栏）
listType="none"  →  不展示列表

modalType="modal" →  ProCurdModalFormConnect（弹窗表单）
```

### 使用示例

```tsx
import { ProCurdModule } from "@vue-start/pro";
import { getList, addItem, editItem, deleteItem, getDetail } from "@/api";

export const UserManage = defineComponent({
  setup() {
    return () => (
      <ProCurdModule
        columns={columns}
        rowKey="id"
        listType="page"
        modalType="modal"
        operates={[
          { action: 'ADD', actor: addItem },
          { action: 'EDIT', actor: editItem },
          { action: 'DELETE', actor: deleteItem },
          { action: 'DETAIL', actor: getDetail },
        ]}
        modalProps={{ title: '用户管理' }}
      />
    );
  },
});

const columns = [
  {
    dataIndex: 'name',
    title: '姓名',
    valueType: 'text',
    extra: { search: true, form: true, table: true, detail: true },
  },
  {
    dataIndex: 'status',
    title: '状态',
    valueType: 'select',
    formFieldProps: { options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
    extra: { search: true, form: true, table: true, detail: true },
  },
];
```

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 通用列配置 | `TColumns` |
| `rowKey` | 行唯一标识 | `string` |
| `listType` | 列表展示模式 | `'page'` / `'list'` / `'none'` |
| `modalType` | 表单模式 | `'modal'` |
| `operates` | 操作配置 | `ICurdOperateOpts[]` |
| `title` | 模块标题 | `string` |
| `defaultAddRecord` | 新增默认数据 | `object` |
| `listProps` | 列表组件配置 | `object` |
| `formProps` | 表单组件配置 | `object` |
| `modalProps` | 弹窗组件配置 | `object` |
| `columnState` | 列状态 | `Record<string, any>` |
| `columnState2` | 列状态2 | `Record<string, any>` |

### ICurdOperateOpts

```ts
interface ICurdOperateOpts {
  action: CurdAction;         // 操作类型
  actor?: IRequestActor;      // 请求接口
  tableOperate?: boolean;     // 是否加入表格操作栏
  convertParams?: (...params) => Record<string, any>;
  convertData?: (actor) => any;
  onSuccess?: (actor) => void;
  onFailed?: (actor) => void;
  title?: string;             // 弹窗标题
  label?: string;             // 操作按钮文本
}
```

### CurdAction

```ts
enum CurdAction {
  LIST = "LIST",     // 列表
  DETAIL = "DETAIL", // 详情
  ADD = "ADD",       // 新增
  EDIT = "EDIT",     // 编辑
  DELETE = "DELETE",  // 删除
}
```

---

## Column 分类配置

通过 `extra` 标记 column 用于哪些场景。

```tsx
const columns = [
  {
    dataIndex: 'name',
    title: '姓名',
    valueType: 'text',
    extra: {
      search: true,   // 搜索表单
      form: true,     // 表单
      table: true,    // 表格
      detail: true,   // 详情
    },
  },
];
```

---

## ICurdState

```ts
interface ICurdState {
  listLoading?: boolean;
  listData?: { total: number; dataSource: any[] };
  mode?: 'ADD' | 'EDIT' | 'DETAIL';
  detailLoading?: boolean;
  detailData?: Record<string, any>;
  operateLoading?: boolean;
}
```

---

## Hooks

### useProCurd

获取 CRUD 上下文。

```ts
const {
  columns,
  curdState,
  formColumns,
  tableColumns,
  searchColumns,
  descColumns,
  sendCurdEvent,
  refreshList,
  getOperate,
} = useProCurd();
```

### useCurdCommon

```ts
const { clearMode, operate, opeTitle } = useCurdCommon();

clearMode();              // 清除 mode
operate.value;            // 当前操作配置
opeTitle.value;           // 弹窗标题，如 '用户管理-编辑'
```

---

## 拆分组件（历史代码理解）

以下组件在 `ProCurdModule` 内部使用，大模型理解历史代码时需要。

### ProCurdList

列表组件：搜索 + 表格 + 分页 + 新增按钮。

- `ProCurdListPage` - 包装在 ProPage 中的列表
- `ProCurdListConnect` - Connect 版本

### ProCurdForm

表单组件，根据 `curdState.mode` 决定渲染模式：
- `ADD` - 新增表单
- `EDIT` - 编辑表单
- `DETAIL` - 只读详情

### ProCurdModal

弹窗组件，根据 `curdState.mode` 决定显示/隐藏。

- `ProCurdModalForm` - 弹窗 + 表单
- `ProCurdModalFormConnect` - Connect 版本

### ModalCurdOpe

事件处理组件，监听并处理：
- `ADD-EMIT` → 设置 mode
- `EDIT-EMIT` → 设置 mode + 请求详情
- `SUCCESS` → 刷新列表

### 组件关系

```
ProCurdModule
├── ProCurd
│   ├── ProModule
│   ├── Curd
│   │   ├── ProCurdListPageConnect (listType="page")
│   │   ├── ProCurdListConnect (listType="list")
│   │   ├── ProCurdModalFormConnect (modalType="modal")
│   │   └── ModalCurdOpe (事件处理)
│   └── ...
```

### 事件流

```
用户点击编辑 → sendCurdEvent({ action: 'EDIT', type: 'EMIT', record })
           ↓
ModalCurdOpe 监听 → 设置 curdState.mode = 'EDIT'
           ↓
           → 请求详情（如果配置了 actor）
           ↓
ProCurdModal 显示 → ProCurdForm 渲染（readonly=false）
           ↓
用户提交 → sendCurdEvent({ action: 'EDIT', type: 'EXECUTE', values })
           ↓
Curd 监听 → 发起请求
           ↓
请求成功 → ModalCurdOpe 监听 SUCCESS → refreshList()
```
