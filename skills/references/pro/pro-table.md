# Pro 表格组件

基于 Element Plus Table 的增强表格组件。

## 快速开始

```tsx
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return <pro-table columns={columns} dataSource={dataSource} />;
  };
});
```

## Props

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
| `border` | 边框 | `boolean` |
| `bordered` | 斑马纹 | `boolean` |
| `selectedRowKeys` | v-model 选中行 | `string[]` |
| `rowSelection` | 选择配置 | `object` |

---

## 综合示例

展示分页、多选、表头分组、操作栏、插槽等核心功能。

```tsx
import { defineComponent, reactive, computed } from "vue";

export default defineComponent(() => {
  // 列配置 - 基础列
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "名称", dataIndex: "name" },
    { title: "状态", dataIndex: "status", valueType: "select" },
  ];

  // 列配置 - 表头分组
  const groupColumns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "金额",
      children: [
        { title: "收入", dataIndex: "income" },
        { title: "支出", dataIndex: "expense" },
      ],
    },
    { title: "时间", dataIndex: "createTime" },
  ];

  const dataSource = [
    { id: 1, name: "张三", status: 1, income: 1000, expense: 500, createTime: "2024-01-01" },
    { id: 2, name: "李四", status: 0, income: 2000, expense: 800, createTime: "2024-01-02" },
  ];

  // 分页状态
  const pageState = reactive({ page: 1, pageSize: 10 });

  // 多选模式
  const state = reactive({
    selectedRowKeys: [] as string[],
  });

  const rowSelection = computed(() => ({
    type: "multi" as const,
    column: {
      selectable: (record: any) => record.status !== 0, // status=0 不可选
    },
    onChange: (ids: string[], rows: any[]) => {
      console.log("选中行:", ids, rows);
    },
  }));

  // 操作栏
  const handleEdit = (record: any) => {
    console.log("编辑", record);
  };

  const operate = {
    items: [
      { value: "edit", label: "编辑", onClick: handleEdit },
      {
        value: "delete",
        label: "删除",
        show: (record: any) => record.status === 1,
      },
    ],
  };

  // 插槽
  const slots = {
    bodyCell: ({ value, column }: any) => {
      if (column.dataIndex === "name") {
        return <span style={{ color: "red" }}>重写：{value}</span>;
      }
      return undefined;
    },
    headerCell: ({ title, column }: any) => {
      if (column.dataIndex === "name") {
        return <span style={{ color: "red" }}>重写：{title}</span>;
      }
      return title;
    },
  };

  return () => {
    return (
      <pro-table
        columns={columns}
        dataSource={dataSource}
        paginationState={pageState}
        v-model:selectedRowKeys={state.selectedRowKeys}
        rowSelection={rowSelection.value}
        operate={operate}
        serialNumber
        columnEmptyText={"--"}
        column={{ align: "center" }}
        border
        bordered
        toolbar={{ columnSetting: {} }}
        v-slots={slots}
      />
    );
  };
});
```

## 综合示例

展示分页、多选、表头分组、操作栏、单元格合并、列设置、动态操作栏、路由跳转、自定义操作列、虚拟滚动、点击拦截等核心功能。

```tsx
import { defineComponent, reactive, computed } from "vue";
import { getNameMapByMergeOpts } from "@vue-start/hooks";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent(() => {
  // 基础列配置
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "名称", dataIndex: "name" },
    { title: "状态", dataIndex: "status", valueType: "select" },
  ];

  // 表头分组列配置
  const groupColumns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "金额",
      children: [
        { title: "收入", dataIndex: "income" },
        { title: "支出", dataIndex: "expense" },
        { title: "净额", dataIndex: "net" },
      ],
    },
    { title: "时间", dataIndex: "createTime" },
  ];

  const dataSource = [
    { id: 1, name: "张三", status: 1, income: 1000, expense: 500, net: 500, createTime: "2024-01-01" },
    { id: 2, name: "李四", status: 0, income: 2000, expense: 800, net: 1200, createTime: "2024-01-02" },
  ];

  // 分页状态
  const pageState = reactive({ page: 1, pageSize: 10 });

  // 多选模式
  const selectedRowKeys = reactive<string[]>([]);
  const rowSelection = computed(() => ({
    type: "multi" as const,
    column: { selectable: (record: any) => record.status !== 0 },
    onChange: (keys: string[], rows: any[]) => {
      selectedRowKeys.value = keys;
      console.log("选中行:", keys, rows);
    },
  }));

  // 单元格合并
  const mergeList = [
    { year: 2020, month: 1, day: "01", "A-1": 1, "A-2": 2, "A-total": 6 },
    { year: 2021, month: 1, day: "01", "A-1": 1, "A-2": 2, "A-total": 6 },
    { year: 2021, month: 2, day: "01", "A-1": 1, "A-2": 2, "A-total": 6 },
    { year: "--", month: "--", day: "--", "A-1": "A2", "A-2": "A2", "A-total": 6 },
  ];
  const mergeOpts = {
    columns: ["year", "month", "day", "A-1", "A-2", "A-total"],
    rowNames: ["year", ["year", "month"]],
    colNames: [["year", "month", "day"], ["A-1", "A-2"]],
    extra: { "A-total": ["year", "month"] },
    colMergeFlag: (record: any) => record.year === "--",
  };
  const nameMap = getNameMapByMergeOpts(mergeOpts);
  const customCell = (record: any, index: number, column: any) => {
    const name = column.dataIndex;
    if (nameMap[name]) {
      const rs = record[nameMap[name] as string];
      const cs = record[name + "-colspan"];
      return { rowSpan: rs, colSpan: cs };
    }
  };
  const mergeColumns = [
    { title: "年份", dataIndex: "year", customCell },
    { title: "月份", dataIndex: "month", customCell },
    { title: "天", dataIndex: "day", customCell },
    { title: "A-1", dataIndex: "A-1", customCell },
    { title: "A-2", dataIndex: "A-2", customCell },
    { title: "A-total", dataIndex: "A-total" },
  ];

  // 动态操作栏
  const operate = {
    items: [
      {
        value: "edit",
        label: "编辑",
        show: (record: any) => record.status !== 0,
        onClick: (record: any) => console.log("编辑", record),
      },
      {
        value: "delete",
        label: "删除",
        disabled: (record: any) => record.status === 0,
        loading: (record: any) => record.id === 2,
      },
      {
        value: "export",
        label: "导出",
        tableOperate: true, // 不触发弹窗/页面
        onClick: (record: any) => console.log("导出", record),
      },
    ],
  };

  // 路由跳转
  const routeOperate = {
    items: [
      {
        value: "view",
        label: "查看详情",
        routeOpts: { name: "user-detail", query: ["id"] },
      },
      {
        value: "edit",
        label: "编辑",
        routeOpts: (record: any) => ({ name: "user-edit", query: { id: record.id, from: "list" } }),
      },
    ],
  };

  // 自定义操作列
  const customOperate = {
    items: [
      {
        value: "actions",
        element: (record: any) => (
          <el-space>
            <el-button size="small" onClick={() => console.log("编辑", record)}>编辑</el-button>
            <el-button size="small" type="danger" onClick={() => console.log("删除", record)}>删除</el-button>
          </el-space>
        ),
      },
    ],
  };

  // 点击拦截
  const operateItemClickMap = {
    edit: (record: any) => console.log("拦截编辑", record),
    delete: (record: any) => {
      ElMessageBox.confirm("确定删除该记录吗?", "提示").then(() => {
        console.log("确认删除", record);
      });
    },
  };

  return () => (
    <>
      <pro-table
        columns={columns}
        dataSource={dataSource}
        paginationState={pageState}
        v-model:selectedRowKeys={selectedRowKeys.value}
        rowSelection={rowSelection.value}
        operate={operate}
        serialNumber
        columnEmptyText={"--"}
        column={{ align: "center" }}
        border
        bordered
        toolbar={{ columnSetting: {} }}
        operateItemClickMap={operateItemClickMap}
      />
      {/* 表头分组 */}
      <pro-table columns={groupColumns} dataSource={dataSource} bordered />
      {/* 单元格合并 */}
      <pro-table border bordered columns={mergeColumns} dataSource={mergeList} mergeOpts={mergeOpts} />
      {/* 虚拟滚动 */}
      <pro-table
        columns={columns}
        dataSource={Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `用户${i + 1}`, status: 1 }))}
        virtual
      />
    </>
  );
});
```

---

## 核心类型

### TTableColumn

```ts
interface TTableColumn extends TColumn {
  children?: TTableColumn[];
  customRender?: (opt) => VNode;
  customCell?: (record, index, column) => { rowSpan?, colSpan? };
  fixed?: boolean | string;
  width?: number | string;
}
```

### ITableOperate

```ts
interface ITableOperate {
  column?: TColumn;
  items?: IOperateItem[];
  itemState?: Record<string, IOperateItem>;
}
```

### IOperateItem

```ts
interface IOperateItem {
  value: string | number;
  label?: string;
  show?: boolean | ((record) => boolean);
  disabled?: boolean | ((record) => boolean);
  loading?: boolean | ((record) => boolean);
  onClick?: (record) => void;
  routeOpts?: { name: string; query: string[] } | ((record) => Record<string, any>);
  tableOperate?: boolean;
  per?: string;
  tip?: string;
  element?: (record, item) => VNode;
}
```

---