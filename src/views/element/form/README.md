## ProForm

ProForm 在原来的 Form 的基础上增加一些语法糖和更多的布局设置，帮助我们快速的开发一个表单。同时添加一些默认行为，让我们的表单默认好用。

- ProForm 没有海克斯科技，只是对 Form 的封装
- 支持通用配置
- 录入项支持混用 如果要使用自定义的组件可以用 FormItem 包裹后使用；也可以 createFormItemComponent 生成 FormItem 项；

```tsx
//直接使用columns
<ProForm columns={[]} columnState={{}} />;

//相互依赖的组件联动
const formState = reactive({});

useWatch(
  () => {
    //select切换时，清空text的值
    formState.text = undefined;
  },
  () => formState.select,
);

<ProForm
  model={formState}
  columns={[
    {
      title: "select",
      dataIndex: "select",
      valueType: "select",
      formFieldProps: {
        options: [],
      },
    },
    { title: "text", dataIndex: "text" },
  ]}
/>;

//直接使用标签
<ProForm model={formState}>
  <ProFormSelect
    name={"select"}
    label={"select"}
    fieldProps={{
      options: [],
    }}
  />
  <ProFormText name={"text"} label={"text"} />
</ProForm>;
```

## API

### 属性

| 名称                 | 说明                                  | 类型              | 默认值 |
| -------------------- | ------------------------------------- | ----------------- | ------ |
| `columns`            | 通用项配置                            | `TColumns`        | --     |
| `columnState`        | 通用项拓展                            | `object`          | --     |
| `elementMap`         | 展示组件集                            | `object`          | --     |
| `formElementMap`     | 录入组件集                            | `object`          | --     |
| `readonly`           | 是否展示只读模式                      | `boolean`         | --     |
| `showState`          | item 项是否展示控制                   | `object`          | --     |
| `showStateRules`     | item 项是否展示规则配置               | `object`          | --     |
| `readonlyState`      | item 项是否只读控制                   | `object`          | --     |
| `readonlyStateRules` | item 项是否只读规则配置               | `object`          | --     |
| `disableState`       | item 项是否禁用控制                   | `object`          | --     |
| `disableStateRules`  | item 项是否禁用规则配置               | `object`          | --     |
| `row`                | 启用 Grid 布局 row 配置               | `object`          | --     |
| `col`                | col 配置                              | `object`          | --     |
| `operate`            | 操作按钮配置，见 ProOperate           | `TProFormOperate` | --     |
| `opeItems`           | 预设 operate 中的 items               | `function`        | --     |
| `submitLoading`      | operate 中提交按钮 loading            | `boolean`         | --     |
| `debounceSubmit`     | 防抖                                  | `number`          | --     |
| `onPreFinish`        | 提交前 hook，返回 true：不执行 finish | `function`        | --     |
| `onGetExtraValues`   | finish 回调中加入参数                 | `function`        | --     |

- readonly 为 true 时，会从 elementMap 查找对应的组件进行渲染
- showState readonlyState disableState 及各自对应的 ${prefix}Rules 都是用来配置 column 项的状态；在使用 columns 渲染组件的情况下推荐使用。

### 事件

| 名称     | 类型                           | 说明 |
| -------- | ------------------------------ | ---- |
| `finish` | `(showValues, values) => void` | 提交 |

### 插槽

| 名称    | 说明                |
| ------- | ------------------- |
| `start` | 在 columns 之前渲染 |
