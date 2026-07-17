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
| `listProps` | 列表组件配置（透传给 [pro-list](./pro-list.md)） | `{ searchProps?, tableProps?, paginationProps?, searchInTable?, ... }` |
| `formProps` | 表单组件配置（透传给 [pro-form](./pro-form.md)） | `{ operate?, row?, col?, convertColumn?, ... }` |
| `modalProps` | 弹窗/页面配置（透传给 pro-modal 或 pro-page） | `{ title?, width?, ... }` |
| `columnState` | 列状态 | `Record<string, any>` |
| `columnState2` | 列状态2 | `Record<string, any>` |
| `curdState` | 外部传入的 curd 状态（可选） | `ICurdState` |

### listProps 详解

`listProps` 是 pro-curd 内部传递给 [pro-list](./pro-list.md) 的配置，pro-list 的文档即为 listProps 的完整参考。常用属性：

| 属性 | 说明 | 类型 |
|------|------|------|
| `listProps.searchProps` | 搜索表单配置（同 pro-list 的 searchProps） | `{ columns, searchMode?, debounceKeys?, debounceTime? }` |
| `listProps.tableProps` | 表格配置（同 pro-list 的 tableProps） | `{ columns, operate?, toolbar?, bordered?, ... }` |
| `listProps.paginationProps` | 分页配置（同 pro-list 的 paginationProps） | `{ total?, showSizeChanger?, showQuickJumper? }` |
| `listProps.searchInTable` | 搜索是否在表格 toolbar 内 | `boolean` |

```tsx
// 典型用法：通过 listProps 配置表格操作列宽度
<pro-curd-module
  columns={columns}
  operates={operates}
  listProps={{
    searchProps: { searchMode: "MANUAL" },
    tableProps: {
      operate: { column: { minWidth: 200 } },
      toolbar: { columnSetting: {} },
    },
    paginationProps: { showSizeChanger: true },
  }}
/>
```

### formProps 详解

`formProps` 是 pro-curd 内部传递给 [pro-form](./pro-form.md) 的配置：

| 属性 | 说明 |
|------|------|
| `formProps.operate` | 操作按钮配置 |
| `formProps.row` | Grid Row 配置 |
| `formProps.col` | Grid Col 配置 |
| `formProps.convertColumn` | 列转换处理 |
| `formProps.debounceSubmit` | 防抖提交延迟 |

### modalProps 详解

`modalProps` 在 `modalType="modal"` 时透传给 pro-modal，在 `modalType="page"` 时透传给 pro-page：

| 属性 | 说明 |
|------|------|
| `modalProps.title` | 弹窗/页面标题 |
| `modalProps.width` | 弹窗宽度（modal 模式） |

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
## 子组件与拆分模式

`pro-curd-module` 是组合语法糖，内部由以下子组件构成。当需要自定义布局（如自定义弹窗、插入 Tabs、外部控制 curdState）时，可以拆分配置。

### 组件关系

```
pro-curd-module (组合语法糖)
  └── pro-modal-curd 或 pro-page-curd (CRUD 容器，提供上下文)
        ├── pro-curd-list-connect           (渲染列表：搜索+表格+分页)
        ├── pro-curd-modal-form-connect     (渲染内置弹窗表单，modalType="modal")
        ├── pro-curd-page-form-connect      (渲染内置页面表单，modalType="page")
        └── 自定义内容 (自定义弹窗、额外 UI 等)
```

### 三种使用模式

| 模式 | 适用场景 | 组成 |
|------|---------|------|
| 组合模式 | 标准 CRUD，无自定义布局 | `pro-curd-module` 一行 |
| 拆分 + 内置表单 | 需自定义 columnState/formProps/modalProps，但表单用内置 | `pro-modal-curd` + `pro-curd-list-connect` + `pro-curd-modal-form-connect` |
| 拆分 + 自定义弹窗 | 弹窗内容完全自定义（审核记录、关联选择） | `pro-modal-curd` + `pro-curd-list-connect` + 自定义弹窗 |

### 子组件 Props

`pro-modal-curd` / `pro-page-curd` 继承 `pro-curd-module` 的所有 props，额外支持：

| 属性 | 说明 |
|------|------|
| `curdState` | 外部传入 curd 状态，用于外部读取/控制当前操作模式 |
| `ref` | 获取 curd 实例引用，调用内部方法 |

### 示例 1：拆分 + 内置表单（自定义 columnState + formProps）

```tsx
import { defineComponent, ref, reactive } from "vue";
import { CurdAction } from "@vue-start/pro";

export default defineComponent({
  setup() {
    const curdRef = ref();
    const curdState = reactive({ detailData: {} as any });

    const columns = [
      { dataIndex: "name", title: "姓名", valueType: "text", extra: { search: true, form: true, table: true } },
      { dataIndex: "assetType", title: "资产类型", valueType: "select", extra: { form: true, table: true } },
    ];

    const operates = [
      { action: CurdAction.LIST, actor: getList, convertData: (actor) => ({ total: actor.res?.data?.total, dataSource: actor.res?.data?.list }) },
      { action: CurdAction.ADD, actor: addItem, label: "新增" },
      { action: CurdAction.EDIT, actor: editItem, label: "编辑" },
      { action: CurdAction.DELETE, actor: deleteItem, label: "删除" },
    ];

    const listProps = {
      searchProps: { searchMode: "MANUAL" },
      tableProps: { operate: { column: { minWidth: 200 } }, toolbar: { columnSetting: {} } },
    };

    return () => (
      <pro-page>
        <pro-modal-curd
          curdState={curdState}
          ref={curdRef}
          columns={columns}
          operates={operates}
          listProps={listProps}
          columnState={{
            assetType: { formFieldProps: { options: tzcList.options } },
          }}
          formProps={{
            row: { gutter: 30 },
            col: { span: 8 },
            labelPosition: "top",
          }}
          modalProps={{
            title: `${curdState.detailData.id ? "修改" : "新增"}记录`,
            width: 900,
          }}
        >
          <pro-curd-list-connect />
          <pro-curd-modal-form-connect />
        </pro-modal-curd>
      </pro-page>
    );
  },
});
```

### 示例 2：拆分 + 自定义弹窗（审核记录 + 额外弹窗）

```tsx
import { defineComponent, ref, reactive } from "vue";
import { CurdAction } from "@vue-start/pro";

export default defineComponent({
  setup() {
    const curdRef = ref();
    const state = reactive({ auditModal: false, id: "" });

    const columns = [
      { dataIndex: "name", title: "姓名", valueType: "text", extra: { search: true, form: true, table: true } },
      { dataIndex: "status", title: "状态", valueType: "select", extra: { search: true, form: true, table: true } },
    ];

    const operates = [
      { action: CurdAction.LIST, actor: getList, convertData: (actor) => ({ total: actor.res?.data?.total, dataSource: actor.res?.data?.list }) },
      { action: CurdAction.ADD, actor: addItem, label: "新增" },
      { action: CurdAction.EDIT, actor: editItem, label: "编辑" },
      { action: CurdAction.DELETE, actor: deleteItem, label: "删除" },
      {
        value: "audit",
        label: "审核记录",
        tableOperate: true,
        onClick: (record) => { state.id = record.id; state.auditModal = true; },
      },
    ];

    return () => (
      <pro-page>
        <pro-modal-curd
          key={curdKey.value}
          ref={curdRef}
          columns={columns}
          operates={operates}
          listProps={listProps}
          columnState={{
            status: { formFieldProps: { options: recordStatusEnum.options } },
          }}
        >
          <pro-curd-list-connect />
          <pro-curd-modal-form-connect />
        </pro-modal-curd>

        {/* 额外的自定义弹窗 */}
        <pro-modal
          title="审核记录"
          visible={state.auditModal}
          width={900}
          onClosed={() => (state.auditModal = false)}
          footer={false}
        >
          <AuditTimeline v-model={state.auditModal} actor={getAuditList} id={state.id} />
        </pro-modal>
      </pro-page>
    );
  },
});
```

### 示例 3：拆分 + Tabs 切换刷新列表

```tsx
import { defineComponent, ref, reactive } from "vue";
import { CurdAction } from "@vue-start/pro";

export default defineComponent({
  setup() {
    const state = reactive({ type: "all" });
    const key = ref(0);

    const tabOptions = [
      { value: "all", label: "全部" },
      { value: "active", label: "启用" },
      { value: "inactive", label: "禁用" },
    ];

    const handleChange = () => { key.value++; };

    return () => (
      <pro-page
        v-slots={{
          title: () => (
            <pro-tabs v-model={state.type} options={tabOptions} onTabChange={handleChange} />
          ),
        }}
      >
        <pro-modal-curd
          key={key.value}
          columns={columns}
          operates={operates}
          listProps={listProps}
        >
          <pro-curd-list-connect />
          <pro-curd-modal-form-connect />
        </pro-modal-curd>
      </pro-page>
    );
  },
});
```

### 子组件速查

| 组件 | 用途 |
|------|------|
| `pro-modal-curd` | 弹窗模式 CRUD 容器（`modalType="modal"`） |
| `pro-page-curd` | 页面模式 CRUD 容器（`modalType="page"`） |
| `pro-curd-list-connect` | 连接容器上下文，渲染列表（搜索+表格+分页） |
| `pro-curd-modal-form-connect` | 连接容器上下文，渲染内置弹窗表单 |
| `pro-curd-page-form-connect` | 连接容器上下文，渲染内置页面表单 |
| `pro-curd-list` | 独立列表，不依赖容器上下文，需手动传 `curdState` |
| `pro-curd-modal` | 独立弹窗表单，不依赖容器上下文 |
| `pro-curd-page` | 独立页面表单，不依赖容器上下文 |

### 拆分模式注意事项

- `pro-curd-list-connect` / `pro-curd-modal-form-connect` 自动从父级 curd 容器获取上下文
- 容器的 `key` 变化会触发列表刷新（用于 Tabs 切换等场景）
- 自定义弹窗需手动控制 `visible`，不影响内置表单的增删改查操作
- 拆分模式下，新增/编辑/删除操作仍由 `operates` 控制，内置表单连接器自动响应

---
## 综合示例

展示完整配置，包括：参数转换（convertParams）、结果转换（convertData）、操作回调（onSuccess/onFailed）、新增默认数据（defaultAddRecord）、表格操作栏扩展（tableOperate）。

```tsx
import { defineComponent } from "vue";
import { ProCurdModule, CurdAction } from "@vue-start/pro";
import { getList, addItem, editItem, deleteItem, getDetail } from "@/api";
import { IRequestActor } from "@vue-start/request";
import { ElMessage } from "element-plus";

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
      {
        dataIndex: "creator",
        title: "创建人",
        valueType: "text",
        extra: { form: true, table: true },
      },
    ];

    // 操作成功回调 - 只对删除操作做提示
    const handleDeleteSuccess = (actor: any) => {
      ElMessage.success("删除成功");
    };

    // 操作失败回调
    const handleFailed = (actor: any) => {
      ElMessage.error(`操作失败: ${actor.err?.message || "未知错误"}`);
    };

    return () => (
      <pro-curd-module
        columns={columns}
        rowKey="id"
        listType="page"
        modalType="modal"
        // 新增默认数据
        defaultAddRecord={{
          status: 1,
          creator: "系统管理员",
        }}
        operates={[
          // 列表
          {
            action: CurdAction.LIST,
            actor: getList,
            // 结果转换：从响应中提取列表数据
            convertData: (actor: IRequestActor) => {
              const data = actor.res?.data?.data;
              return { total: data?.total, dataSource: data?.list };
            },
          },
          // 新增
          {
            action: CurdAction.ADD,
            actor: addItem,
            label: "新增",
            title: "新增用户",
            // 参数转换：添加额外字段
            convertParams: (values: any) => {
              return { body: { ...values, createTime: new Date() } };
            },
            onSuccess: () => ElMessage.success("新增成功"),
            onFailed: handleFailed,
          },
          // 编辑
          {
            action: CurdAction.EDIT,
            actor: editItem,
            label: "编辑",
            title: "编辑用户",
            // 参数转换：合并原记录与新值
            convertParams: (values: any, type: string, record: any) => {
              return { body: { ...record, ...values }, id: record.id };
            },
            onSuccess: () => ElMessage.success("编辑成功"),
            onFailed: handleFailed,
          },
          // 删除
          {
            action: CurdAction.DELETE,
            actor: deleteItem,
            label: "删除",
            onSuccess: handleDeleteSuccess,
            onFailed: handleFailed,
          },
          // 详情
          {
            action: CurdAction.DETAIL,
            actor: getDetail,
            label: "查看详情",
            title: "用户详情",
          },
          // 表格操作栏扩展（不触发弹窗）
          {
            value: "export",
            label: "导出",
            tableOperate: true,
            onClick: (record: any) => {
              console.log("导出", record);
            },
          },
        ]}
        modalProps={{ title: "用户管理" }}
        listProps={{
          tableProps: {
            operate: {
              column: { minWidth: 200 },
            },
          },
        }}
      />
    );
  },
});
```

---

## API 参考

### ICurdOperateOpts

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action` | `CurdAction` | 是 | 操作类型 |
| `actor` | `IRequestActor` | 否 | 请求接口（LIST 操作必填） |
| `label` | `string` | 否 | 按钮文本（默认使用 action 对应的文案） |
| `title` | `string` | 否 | 弹窗/页面标题 |
| `tableOperate` | `boolean` | 否 | 是否加入表格操作栏（不触发弹窗/页面） |
| `convertParams` | `(values: any, type?: string, record?: any) => Record<string, any>` | 否 | 提交前参数转换 |
| `convertData` | `(actor: IRequestActor) => any` | 否 | 响应数据转换（LIST 操作需返回 `{ total, dataSource }`） |
| `onSuccess` | `(actor: IRequestActor) => void` | 否 | 操作成功回调 |
| `onFailed` | `(actor: IRequestActor) => void` | 否 | 操作失败回调 |
| `value` | `string` | 否 | 自定义操作唯一标识（`tableOperate: true` 时使用） |
| `onClick` | `(record: any) => void` | 否 | 表格操作栏点击回调（`tableOperate: true` 时使用） |
| `show` | `boolean \| ((record: any) => boolean)` | 否 | 条件显示（`tableOperate: true` 时使用） |
| `disabled` | `boolean \| ((record: any) => boolean)` | 否 | 条件禁用（`tableOperate: true` 时使用） |
| `loading` | `boolean \| ((record: any) => boolean)` | 否 | 条件 loading（`tableOperate: true` 时使用） |

### CurdAction

```ts
enum CurdAction {
  LIST = "LIST",       // 列表查询（触发时自动请求数据）
  DETAIL = "DETAIL",   // 详情查看（打开详情弹窗/页面并请求详情）
  ADD = "ADD",         // 新增（打开空表单弹窗/页面）
  EDIT = "EDIT",       // 编辑（打开表单弹窗/页面并回填数据）
  DELETE = "DELETE",   // 删除（弹出确认框后执行删除请求）
}
```

### ICurdState

| 属性 | 类型 | 说明 |
|------|------|------|
| `mode` | `"ADD" \| "EDIT" \| "DETAIL" \| ""` | 当前操作模式 |
| `listLoading` | `boolean` | 列表加载状态 |
| `listData` | `{ total: number; dataSource: any[] }` | 列表数据 |
| `detailLoading` | `boolean` | 详情加载状态 |
| `detailData` | `Record<string, any>` | 详情数据 |
| `operateLoading` | `boolean` | 操作提交 loading |

### column 配置策略

column 通过 `extra` 属性控制在不同场景下的显示：

| `extra` 属性 | 场景 | 说明 |
|-------------|------|------|
| `extra.search: true` | 搜索表单 | 显示在列表页搜索区域 |
| `extra.form: true` | 新增/编辑表单 | 显示在表单中 |
| `extra.table: true` | 表格列 | 显示在表格中 |
| `extra.detail: true` | 详情 | 显示在详情中 |

```tsx
const columns = [
  {
    dataIndex: "name",
    title: "姓名",
    valueType: "text",
    // 在所有场景中显示
    extra: { search: true, form: true, table: true, detail: true },
  },
  {
    dataIndex: "id",
    title: "ID",
    // 只在表格中显示，不在表单和搜索中
    extra: { table: true },
  },
];
```

---

## Hooks

### useProCurd

用于在 CRUD 组件内部或外部获取 CRUD 状态和方法。

```tsx
import { useProCurd } from "@vue-start/pro";

const {
  columns,        // 原始 column 配置
  curdState,      // ICurdState 当前状态
  formColumns,    // extra.form 的列
  tableColumns,   // extra.table 的列
  searchColumns,  // extra.search 的列
  descColumns,    // extra.detail 的列
  sendCurdEvent,  // (action: CurdAction, record?: any) => void  发送 CRUD 事件
  refreshList,    // () => void  刷新列表
  getOperate,     // (action: CurdAction) => ICurdOperateOpts  获取操作配置
} = useProCurd();
```

---

## 相关文档

- [pro-table.md](./pro-table.md) - 表格组件
- [pro-form.md](./pro-form.md) - 表单组件
- [项目接入与配置](../setup.md) — 完整类型定义
