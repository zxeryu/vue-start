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

### 单元格合并

```tsx
import { defineComponent } from "vue";
import { getNameMapByMergeOpts } from "@vue-start/hooks";

export default defineComponent(() => {
  const list = [
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

  const columns = [
    { title: "年份", dataIndex: "year", customCell },
    { title: "月份", dataIndex: "month", customCell },
    { title: "天", dataIndex: "day", customCell },
    { title: "A-1", dataIndex: "A-1", customCell },
    { title: "A-2", dataIndex: "A-2", customCell },
    { title: "A-total", dataIndex: "A-total" },
  ];

  return () => {
    return (
      <pro-table border bordered columns={columns} dataSource={list} mergeOpts={mergeOpts} />
    );
  };
});
```

---

## 核心类型

### TTableColumn

```ts
interface TTableColumn extends TColumn {
  children?: TTableColumn[];     // 子列
  customRender?: (opt) => VNode; // 自定义渲染
  customCell?: (record, index, column) => { rowSpan?, colSpan? }; // 自定义单元格
  fixed?: boolean | string;      // 固定列
  width?: number | string;       // 列宽
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
  routeOpts?: { name: string; query: string[] };
  per?: string;
  tip?: string;
}
```

---