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

展示搜索表单、表格、分页、搜索位置、插槽等核心功能。

```tsx
import { defineComponent, ref } from "vue";
import { take } from "lodash";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);

  // 搜索位置控制
  const searchInTableRef = ref(false);

  const handleChange = () => {
    searchInTableRef.value = !searchInTableRef.value;
  };

  const handleSearch = (values: Record<string, any>) => {
    console.log("搜索:", values);
  };

  return () => {
    return (
      <>
        <button onClick={handleChange}>search in table</button>
        <pro-list
          // 搜索位置：true 在表格内，false 在表格外
          searchInTable={searchInTableRef.value}
          searchProps={{ columns: searchColumns }}
          tableProps={{
            columns,
            dataSource,
            toolbar: { columnSetting: {} },
          }}
          paginationProps={{ total: 100 }}
          onSearch={handleSearch}
          v-slots={{
            // 插槽
            start: () => <div>列表顶部内容</div>,
            divide: () => <div>搜索和表格之间的分隔内容</div>,
            end: () => <div>列表底部内容</div>,
          }}
        />
      </>
    );
  };
});
```

---