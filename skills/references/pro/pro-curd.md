# Pro CRUD 业务组件

聚合组件，组合了列表、搜索、分页、弹窗表单等完整 CRUD 功能。

## 快速开始

```tsx
import { defineComponent } from "vue";
import { ProCurdModule, CurdAction } from "@vue-start/pro";
import { getList, addItem, editItem, deleteItem, getDetail } from "@/api";

export default defineComponent({
  setup() {
    const columns = [
      {
        dataIndex: "name",
        title: "姓名",
        valueType: "text",
        extra: { search: true, form: true, table: true, detail: true },
      },
      {
        dataIndex: "status",
        title: "状态",
        valueType: "select",
        formFieldProps: {
          options: [
            { value: 1, label: "启用" },
            { value: 0, label: "禁用" },
          ],
        },
        extra: { search: true, form: true, table: true, detail: true },
      },
    ];

    return () => (
      <pro-curd-module
        columns={columns}
        rowKey="id"
        listType="page"
        modalType="modal"
        operates={[
          { action: CurdAction.ADD, actor: addItem },
          { action: CurdAction.EDIT, actor: editItem },
          { action: CurdAction.DELETE, actor: deleteItem },
          { action: CurdAction.DETAIL, actor: getDetail },
        ]}
        modalProps={{ title: "用户管理" }}
      />
    );
  },
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 通用列配置 | `TColumns` |
| `rowKey` | 行唯一标识 | `string` |
| `listType` | 列表展示模式 | `'page'` / `'list'` / `'none'` |
| `modalType` | 表单模式 | `'page'` / `'modal'` |
| `operates` | 操作配置 | `ICurdOperateOpts[]` |
| `title` | 模块标题 | `string` |
| `defaultAddRecord` | 新增默认数据 | `object` |
| `listProps` | 列表组件配置 | `object` |
| `formProps` | 表单组件配置 | `object` |
| `modalProps` | 弹窗组件配置 | `object` |
| `columnState` | 列状态 | `Record<string, any>` |
| `columnState2` | 列状态2 | `Record<string, any>` |
| `curdState` | 外部传入的 curd 状态（可选） | `ICurdState` |

---

## 工作模式

```
listType="page"  →  ProCurdListPage（页面布局 + 列表）
listType="list"  →  ProCurdList（搜索在工具栏）
listType="none"  →  不展示列表

modalType="page"  →  ProCurdPage（页面表单）
modalType="modal" →  ProCurdModal（弹窗表单）
```

---

## 综合示例

展示工作模式、操作按钮、参数转换、自定义回调等核心功能。

```tsx
import { defineComponent, reactive } from "vue";
import { ProCurdModule, CurdAction } from "@vue-start/pro";
import { getList, addItem, editItem, deleteItem, getDetail } from "@/api";

export default defineComponent({
  setup() {
    // 列配置
    const columns = [
      {
        dataIndex: "name",
        title: "姓名",
        valueType: "text",
        extra: { search: true, form: true, table: true, detail: true },
      },
      {
        dataIndex: "age",
        title: "年龄",
        valueType: "digit",
        extra: { form: true, table: true, detail: true },
      },
      {
        dataIndex: "status",
        title: "状态",
        valueType: "select",
        formFieldProps: {
          options: [
            { value: 1, label: "启用" },
            { value: 0, label: "禁用" },
          ],
        },
        extra: { search: true, form: true, table: true },
      },
    ];

    // 操作成功回调
    const handleSuccess = (actor: any) => {
      console.log("操作成功:", actor.name);
    };

    // 操作失败回调
    const handleFailed = (actor: any) => {
      console.log("操作失败:", actor.err);
    };

    return () => (
      <pro-curd-module
        columns={columns}
        rowKey="id"
        // 工作模式：listType="page" | "list" | "none"
        listType="page"
        // 表单模式：modalType="modal" | "page"
        modalType="modal"
        operates={[
          {
            action: CurdAction.ADD,
            actor: addItem,
            label: "新增",
            title: "新增用户",
            // 参数转换
            convertParams: (values: any) => {
              return { ...values, createBy: "admin" };
            },
            onSuccess: handleSuccess,
            onFailed: handleFailed,
          },
          {
            action: CurdAction.EDIT,
            actor: editItem,
            label: "编辑",
            title: "编辑用户",
            convertParams: (values: any, type: string, record: any) => {
              return { ...values, id: record.id };
            },
            onSuccess: handleSuccess,
          },
          {
            action: CurdAction.DELETE,
            actor: deleteItem,
            label: "删除",
          },
          {
            action: CurdAction.DETAIL,
            actor: getDetail,
            label: "查看详情",
            title: "用户详情",
          },
        ]}
        modalProps={{ title: "用户管理" }}
      />
    );
  },
});
```

### 外部传入 curdState

```tsx
export default defineComponent({
  setup() {
    const curdState = reactive({
      mode: "",
      listLoading: false,
      listData: { total: 0, dataSource: [] },
      detailLoading: false,
      detailData: {},
      operateLoading: false,
    });

    return () => (
      <pro-curd-module
        columns={columns}
        rowKey="id"
        curdState={curdState}
        operates={operates}
      />
    );
  },
});
```

### useProCurd Hook

```tsx
export default defineComponent({
  setup() {
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

    return () => {
      return <div>...</div>;
    };
  },
});
```

---

## ICurdOperateOpts

```ts
interface ICurdOperateOpts {
  action: CurdAction;              // 操作类型
  actor?: IRequestActor;           // 请求接口
  label?: string;                  // 按钮文本
  title?: string;                  // 弹窗标题
  tableOperate?: boolean;          // 是否加入表格操作栏
  convertParams?: (
    values: any,
    type: string,
    record?: any
  ) => Record<string, any>;         // 参数转换
  convertData?: (actor) => any;    // 数据转换
  onSuccess?: (actor) => void;      // 成功回调
  onFailed?: (actor) => void;       // 失败回调
}
```

## CurdAction

```ts
enum CurdAction {
  LIST = "LIST",       // 列表
  DETAIL = "DETAIL",  // 详情
  ADD = "ADD",         // 新增
  EDIT = "EDIT",       // 编辑
  DELETE = "DELETE",   // 删除
}
```

## ICurdState

```ts
interface ICurdState {
  mode?: "ADD" | "EDIT" | "DETAIL" | "";
  listLoading?: boolean;
  listData?: { total: number; dataSource: any[] };
  detailLoading?: boolean;
  detailData?: Record<string, any>;
  operateLoading?: boolean;
}
```

---

## Hooks

### useProCurd

```tsx
import { defineComponent } from "vue";
import { useProCurd } from "@vue-start/pro";

export default defineComponent({
  setup() {
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

    return () => {
      return <div>...</div>;
    };
  },
});
```

---

## 相关文档

- [pro-table.md](./pro-table.md) - 表格组件
- [pro-form.md](./pro-form.md) - 表单组件