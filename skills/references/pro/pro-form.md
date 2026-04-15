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
| `onPreFinish` | 提交前拦截 | `(showValues, reValues, opts) => boolean \| undefined` |
| `onGetExtraValues` | 额外值处理 | `(opts) => Record<string, any>` |

---

## 综合示例

展示栅格布局、表单联动、值类型、状态规则、提交拦截、额外值、列转换、列状态补充、防抖提交、插槽等核心功能。

```tsx
import { defineComponent, reactive, ref, computed } from "vue";
import { useWatch } from "@vue-start/hooks";
import { ElMessage } from "element-plus";

export default defineComponent(() => {
  const formType = ref("add");
  const formState = reactive<{ name: string; gender?: string; age?: number; status: string; genderLabel?: string }>({
    name: "",
    status: "1",
  });

  // 联动：监听 gender 变化，重置 age
  useWatch(() => { formState.age = undefined; }, () => formState.gender);

  const columns = [
    { dataIndex: "name", title: "姓名", valueType: "text", extra: { col: { span: 24 } } },
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
      formExtra: { label: { name: "genderLabel" } },
    },
    { dataIndex: "status", title: "状态", valueType: "select" },
    { dataIndex: "switch", title: "开关", valueType: "switch" },
    { dataIndex: "textarea", title: "多行文本", valueType: "textarea", extra: { col: { span: 24 } } },
  ];

  // 状态规则 - 根据表单值动态控制字段状态
  const showStateRules = { age: (values) => values.gender === "female" };
  const readonlyStateRules = { name: (values) => formType.value === "view" };
  const disableStateRules = { status: (values) => formType.value === "add" };

  // 提交前拦截
  const handlePreFinish = (showValues: any, reValues: any) => {
    if (reValues.age && reValues.age < 18) {
      ElMessage.warning("年龄必须大于18岁");
      return true; // 消费事件，阻止提交
    }
    return false;
  };

  // 额外值处理
  const handleExtraValues = () => ({
    extraField: "额外字段",
    submitTime: new Date().toISOString(),
  });

  // 列转换
  const convertColumn = (column: any) => {
    if (column.valueType === "select") {
      return { ...column, formFieldProps: { ...column.formFieldProps, filterable: true } };
    }
    return column;
  };

  // 列状态补充
  const columnState2 = computed(() => ({
    name: { readonly: true },
    age: { formFieldProps: { min: 0, max: 150 } },
  }));

  return () => (
    <pro-form
      model={formState}
      columns={columns}
      row={{}}
      col={{ span: 8 }}
      showStateRules={showStateRules}
      readonlyStateRules={readonlyStateRules}
      disableStateRules={disableStateRules}
      onPreFinish={handlePreFinish}
      onGetExtraValues={handleExtraValues}
      convertColumn={convertColumn}
      columnState2={columnState2.value}
      debounceSubmit={1000}
      operate={{}}
      onFinish={(values) => console.log("提交数据:", values)}
      v-slots={{
        age: (column: any, state: any) => (
          <pro-form-item name={column.dataIndex} label={column.title}>
            <pro-input-number v-model={state[column.dataIndex!]} />
          </pro-form-item>
        ),
      }}
    />
  );
});
```

---

## 动态表单项（FormList）

动态添加/删除表单项。

```tsx
import { defineComponent } from "vue";
import { take } from "lodash";

export default defineComponent(() => {
  const columns = take(baseColumns, 3);

  return () => (
    <pro-form columns={columns} operate={{}} onFinish={(values) => console.log("values", values)}>
      <pro-form-list
        name={"list"}
        label={"列表"}
        columns={columns}
        v-slots={{
          itemMinus: () => <div>remove</div>,
          add: () => <div>添加一项</div>,
        }}
      />
    </pro-form>
  );
});
```

---

## 搜索表单（SearchForm）

继承 ProForm，用于列表页搜索。

```tsx
export default defineComponent(() => {
  return () => (
    <pro-search-form
      columns={searchColumns}
      searchMode="MANUAL"
      onFinish={(values) => console.log("搜索参数:", values)}
    />
  );
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
  extra?: {
    desc?: object;
    search?: object;
    form?: object;
    table?: object;
    col?: object;
  };
  formItemProps?: object;
  formFieldProps?: object;
  formExtra?: {
    label?: { name?: string; opts?: TLabelOpts };
  };
}
```

