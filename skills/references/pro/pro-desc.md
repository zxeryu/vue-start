# Pro 详情组件

用于展示结构化数据的详情页组件。

## 快速开始

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  const descColumns = [
    { title: "姓名", dataIndex: "name" },
    { title: "年龄", dataIndex: "age" },
    {
      title: "状态",
      dataIndex: "status",
      render: (val: number) => (val ? "启用" : "禁用"),
    },
  ];

  const userData = {
    name: "张三",
    age: 25,
    status: 1,
  };

  return () => {
    return <pro-desc columns={descColumns} data={userData} />;
  };
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TDescColumns` |
| `data` | 数据源 | `Record<string, any>` |
| `column` | 公共列配置（默认列数） | `number` |
| `border` | 是否显示边框 | `boolean` |
| `size` | 尺寸 | `'small' \| 'default' \| 'large'` |

### 分组机制

`columns` 支持分组展示：当一个 column 没有 `dataIndex` 时，该行作为分组标题。

```tsx
const descColumns = [
  { title: "基本信息" },                    // 分组标题行
  { title: "姓名", dataIndex: "name" },     // 数据行
  { title: "年龄", dataIndex: "age" },
  { title: "联系方式" },                    // 分组标题行
  { title: "邮箱", dataIndex: "email" },
  { title: "电话", dataIndex: "phone" },
];
```

### span 属性

每个 column 可通过 `span` 控制占据的列数（共 `column` 列）：

```tsx
const descColumns = [
  { title: "姓名", dataIndex: "name", span: 2 },  // 占2列
  { title: "年龄", dataIndex: "age" },              // 默认1列
  { title: "邮箱", dataIndex: "email", span: 3 },  // 占3列
];
```

---

## 综合示例

展示分组展示、列跨度、边框等核心功能。

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  const userData = {
    name: "张三",
    age: 25,
    status: 1,
    email: "zhangsan@example.com",
    createTime: "2024-01-01",
  };

  // 分组列配置
  const descColumns = [
    { title: "基本信息" },
    { title: "姓名", dataIndex: "name", span: 2 },
    { title: "年龄", dataIndex: "age" },
    {
      title: "状态",
      dataIndex: "status",
      render: (val: number) => (val ? "启用" : "禁用"),
    },
    { title: "联系方式" },
    { title: "邮箱", dataIndex: "email", span: 3 },
    { title: "创建时间", dataIndex: "createTime" },
  ];

  return () => {
    return (
      <pro-desc
        columns={descColumns}
        data={userData}
        border
        size="default"
      />
    );
  };
});
```
---