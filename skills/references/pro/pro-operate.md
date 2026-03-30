# Pro 操作栏组件

用于展示一组操作按钮的组件，支持权限控制、状态控制。

## 快速开始

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  return () => {
    return (
      <pro-operate
        items={[
          { value: "add", label: "新增", onClick: () => handleAdd() },
          { value: "edit", label: "编辑", onClick: (record) => handleEdit(record) },
          { value: "delete", label: "删除", onClick: (record) => handleDelete(record) },
        ]}
      />
    );
  };
});
```

## IOperateItem

| 属性 | 说明 | 类型 |
|------|------|------|
| `value` | 唯一标识 | `string \| number` |
| `label` | 显示文本 | `string` |
| `show` | 显示条件 | `boolean \| (record) => boolean` |
| `disabled` | 禁用条件 | `boolean \| (record) => boolean` |
| `loading` | 加载状态 | `boolean \| (record) => boolean` |
| `onClick` | 点击事件 | `(record) => void` |
| `per` | 权限标识 | `string` |
| `tip` | 提示文本 | `string` |
| `routeOpts` | 路由跳转 | `{ name: string; query: string[] }` |

---

## 综合示例

展示所有功能：条件显示、条件禁用、加载状态、操作成功提示。

```tsx
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({
    isSubmitting: false,
  });

  const handleAdd = () => {
    console.log("新增");
  };

  const handleEdit = (record: any) => {
    console.log("编辑", record);
  };

  const handleDelete = (record: any) => {
    console.log("删除", record);
  };

  return () => {
    return (
      <pro-operate
        items={[
          {
            value: "add",
            label: "新增",
            onClick: () => handleAdd(),
            // 条件显示
            show: (record: any) => record.status === 1,
            // 操作成功提示
            tip: "新增成功",
          },
          {
            value: "edit",
            label: "编辑",
            onClick: (record) => handleEdit(record),
            // 条件禁用
            disabled: (record: any) => record.isLocked,
          },
          {
            value: "delete",
            label: "删除",
            onClick: async (record) => {
              state.isSubmitting = true;
              await handleDelete(record);
              state.isSubmitting = false;
            },
            // 加载状态
            loading: state.isSubmitting,
            // 条件显示
            show: (record: any) => record.status === 0,
          },
        ]}
      />
    );
  };
});
```

---