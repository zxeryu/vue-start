# Pro 表单组件

基于 Element Plus Form 的增强表单组件。

## 快速开始

```tsx
import { defineComponent } from "vue";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return (
      <pro-form
        columns={columns}
        operate={{}}
        onFinish={(values: Record<string, any>) => {
          console.log("values", values);
        }}
      />
    );
  };
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TColumns` |
| `columnState` | 列状态 | `Record<string, any>` |
| `columnState2` | 列状态2 | `Record<string, any>` |
| `convertColumnPre` | 列转换预处理 | `(column: TColumn) => TColumn` |
| `convertColumn` | 列转换处理 | `(column: TColumn) => TColumn` |
| `model` | 表单数据（响应式对象） | `Record<string, any>` |
| `elementMap` | 展示组件集 | `TElementMap` |
| `formElementMap` | 录入组件集 | `TElementMap` |
| `readonly` | 只读模式 | `boolean` |
| `showState` | 显示状态控制 | `Record<string, boolean>` |
| `showStateRules` | 显示状态规则（根据表单值动态计算） | `Record<string, (values: Record<string, any>) => boolean>` |
| `readonlyState` | 只读状态控制 | `Record<string, boolean>` |
| `readonlyStateRules` | 只读状态规则（根据表单值动态计算） | `Record<string, (values: Record<string, any>) => boolean>` |
| `disableState` | 禁用状态控制 | `Record<string, boolean>` |
| `disableStateRules` | 禁用状态规则（根据表单值动态计算） | `Record<string, (values: Record<string, any>) => boolean>` |
| `row` | Grid Row 配置 | `object` |
| `col` | Grid Col 配置 | `object` |
| `operate` | 操作按钮配置 | `object` |
| `debounceSubmit` | 防抖提交延迟（ms） | `number` |
| `submitLoading` | 提交按钮loading状态 | `boolean` |
| `formMethods` | ref 默认中转方法 | `string[]` |

## Events

| 事件 | 说明 | 参数 |
|------|------|------|
| `onFinish` | 表单提交成功 | `(showValues: Record<string, any>, values: Record<string, any>, opts: { userOpe: Ref, asyncNum: Ref }) => void` |
| `onFinishFailed` | 表单提交失败 | `(errs: any) => void` |
| `onReset` | 表单重置 | `() => void` |

---

## 综合示例

展示布局配置、表单联动、值类型、动态表单项、插槽、防抖提交、只读模式等核心功能。

```tsx
import { defineComponent, reactive, ref } from "vue";
import { useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  // 表单联动 - 监听 gender 变化，重置 age
  const formState = reactive<{ age?: number; gender?: string }>({});
  useWatch(
    () => {
      formState.age = undefined;
    },
    () => formState.gender,
  );

  // 列配置
  const columns = [
    { dataIndex: "name", title: "姓名", valueType: "text" },
    { dataIndex: "age", title: "年龄", valueType: "digit" },
    {
      dataIndex: "gender",
      title: "性别",
      valueType: "select",
      formFieldProps: {
        options: [
          { value: "male", label: "男" },
          { value: "female", label: "女" },
        ],
      },
    },
    { dataIndex: "status", title: "状态", valueType: "select" },
    { dataIndex: "date", title: "日期", valueType: "date" },
    { dataIndex: "dateRange", title: "日期范围", valueType: "dateRange" },
    { dataIndex: "image", title: "图片", valueType: "image" },
    { dataIndex: "file", title: "文件", valueType: "file" },
    { dataIndex: "switch", title: "开关", valueType: "switch" },
    { dataIndex: "textarea", title: "多行文本", valueType: "textarea",
      extra: {
        //当前组件在grid布局中占位1行
        col: { span: 24 }
      }
     },
  ];

  const handleFinish = (values: Record<string, any>) => {
    console.log("提交数据:", values);
  };

  // 字段状态控制 - 使用 Rules 动态控制
  const showStateRules = {
    // 当 gender 为 "female" 时显示 age 字段
    age: (values: Record<string, any>) => values.gender === "female",
  };

  const readonlyStateRules = {
    // 当 type 为 "view" 时，name 字段只读
    name: (values: Record<string, any>) => formType.value === "view",
  };

  const disableStateRules = {
    // 当 type 为 "add" 时，status 字段禁用
    status: (values: Record<string, any>) => formType.value === "add",
  };

  const formType = ref("add");

  return () => {
    return (
      <pro-form
        model={formState}
        columns={columns}
        // 栅格布局：col={{ span: 8 }}
        row={{}}
        col={{ span: 8 }}
        // 状态规则控制（根据表单值动态计算）
        showStateRules={showStateRules}
        readonlyStateRules={readonlyStateRules}
        disableStateRules={disableStateRules}
        // 防抖提交
        debounceSubmit={1000}
        operate={{}}
        onFinish={handleFinish}
        v-slots={{
          // 自定义插槽
          age: (column: any, state: any) => {
            return (
              <pro-form-item name={column.dataIndex} label={column.title}>
                <pro-input-number v-model={state[column.dataIndex!]} />
              </pro-form-item>
            );
          },
        }}
      />
    );
  };
});
```

### 动态表单项（FormList）

```tsx
import { defineComponent } from "vue";
import { take } from "lodash";

export default defineComponent(() => {
  const handleFinish = (values: Record<string, any>) => {
    console.log("values", values);
  };

  const baseColumns = take(columns, 3);

  return () => {
    return (
      <pro-form columns={baseColumns} operate={{}} onFinish={handleFinish}>
        <pro-form-list
          name={"list"}
          label={"列表"}
          columns={baseColumns}
          v-slots={{
            itemMinus: () => <div>remove</div>,
            add: () => <div>添加一项</div>,
          }}
        />
      </pro-form>
    );
  };
});
```

### SearchForm（搜索表单）

继承 ProForm，用于列表页搜索。

```tsx
export default defineComponent(() => {
  const handleSearch = (values: Record<string, any>) => {
    console.log("搜索参数:", values);
  };

  return () => {
    return (
      <pro-search-form
        columns={searchColumns}
        searchMode="MANUAL"
        onFinish={handleSearch}
      />
    );
  };
});
```

### SearchForm Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `initEmit` | 初始化触发搜索 | `boolean` | - |
| `searchMode` | 搜索模式 | `AUTO` / `MANUAL` | - |
| `debounceKeys` | 防抖字段 | `string[]` | - |
| `debounceTime` | 防抖时间 | `number` | 300 |

---

## 核心类型

### TColumn

```ts
interface TColumn {
  title?: string;
  dataIndex?: string;
  valueType?: string;
  width?: number | string;
  //
  extra?: {
    desc?: object;
    search?: object;
    form?: object;
    table?: object;
    col?: object;
    //...其他
  };
  // 表单专用
  formItemProps?: object;      // ProFormItem props
  formFieldProps?: object;      // 表单元素 props
}
```

---

