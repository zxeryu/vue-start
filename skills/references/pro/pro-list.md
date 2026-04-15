# Pro 列表组件

组合搜索表单、表格、分页的列表容器组件。

## 快速开始

```tsx
import { defineComponent } from "vue";
import { take } from "lodash";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);

  return () => {
    return (
      <pro-list
        searchProps={{ columns: searchColumns }}
        tableProps={{ columns, dataSource }}
        paginationProps={{ total: 100 }}
        onSearch={(values) => console.log("搜索:", values)}
      />
    );
  };
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `searchProps` | 搜索表单配置 | `object` |
| `tableProps` | 表格配置 | `object` |
| `paginationProps` | 分页配置 | `object` |
| `searchInTable` | 搜索是否在表格内 | `boolean` |

---

## 综合示例

展示搜索表单、表格、分页、搜索位置、工具栏、插槽等完整功能。

```tsx
import { defineComponent, reactive, ref } from "vue";
import { ElButton, ElInput } from "element-plus";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);
  const pageState = reactive({ page: 1, pageSize: 10 });
  const searchInTableRef = ref(false);

  const dataSource = [
    { id: 1, name: "张三", status: "1" },
    { id: 2, name: "李四", status: "0" },
  ];

  return () => (
    <pro-list
      // 搜索位置：true 在表格 toolbar 内
      searchInTable={searchInTableRef.value}
      searchProps={{
        columns: searchColumns,
        searchMode: "MANUAL",
        debounceTime: 300,
      }}
      tableProps={{
        columns,
        dataSource,
        bordered: true,
        operate: {
          items: [
            { value: "edit", label: "编辑", show: true },
            { value: "delete", label: "删除", show: true },
          ],
        },
        toolbar: { columnSetting: {} },
      }}
      paginationProps={{ total: 100, showSizeChanger: true, showQuickJumper: true }}
      pageState={pageState}
      onSearch={(values) => console.log("搜索:", values)}
      v-slots={{
        start: () => <div>列表顶部内容</div>,
        // 自定义搜索区域
        search: ({ executeSearchWithResetPage }: any) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <ElInput placeholder="请输入名称" style={{ width: "200px" }} />
            <ElButton type="primary" onClick={() => executeSearchWithResetPage({})}>搜索</ElButton>
          </div>
        ),
        // 自定义分页区域
        pagination: ({ executePageChange }: any) => (
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <ElButton size="small" onClick={() => executePageChange(pageState.page - 1, pageState.pageSize)}>
              上一页
            </ElButton>
            <span style={{ margin: "0 10px" }}>第 {pageState.page} / {Math.ceil(100 / pageState.pageSize)} 页</span>
            <ElButton size="small" onClick={() => executePageChange(pageState.page + 1, pageState.pageSize)}>
              下一页
            </ElButton>
          </div>
        ),
      }}
    />
  );
});
```

---