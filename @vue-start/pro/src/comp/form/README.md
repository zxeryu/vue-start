# ProForm

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

| 名称                 | 类型       | 说明                    | 默认值 |
| -------------------- | ---------- | ----------------------- | ------ |
| `columns`            | `TColumns` | 通用项配置              | --     |
| `columnState`        | `object`   | 通用项拓展              | --     |
| `elementMap`         | `object`   | 展示组件集              | --     |
| `formElementMap`     | `object`   | 录入组件集              | --     |
| `readonly`           | `boolean`  | 是否展示只读模式        | --     |
| `showState`          | `object`   | item 项是否展示控制     | --     |
| `showStateRules`     | `object`   | item 项是否展示规则配置 | --     |
| `readonlyState`      | `object`   | item 项是否只读控制     | --     |
| `readonlyStateRules` | `object`   | item 项是否只读规则配置 | --     |
| `disableState`       | `object`   | item 项是否禁用控制     | --     |
| `disableStateRules`  | `object`   | item 项是否禁用规则配置 | --     |
| `row`                | `object`   | 启用 Grid 布局 row 配置 | --     |
| `col`                | `object`   | col 配置                | --     |

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

# SearchForm

继承 ProForm 所有配置

| 名称            | 类型          | 说明                                                                             | 默认值 |
| --------------- | ------------- | -------------------------------------------------------------------------------- | ------ |
| `initEmit`      | `boolean`     | 初始化执行 submit，会触发 finish 事件                                            | --     |
| `searchMode`    | `ISearchMode` | 搜索模式：自动触发 或 手动触发                                                   | --     |
| `debounceKeys`  | `array`       | SearchMode.AUTO 模式下，需要 debounce 处理的字段                                 | --     |
| `debounceTypes` | `array`       | SearchMode.AUTO 模式下，debounceKeys 为空时，需要 debounce 处理的 valueType 类型 | --     |
| `debounceTime`  | `number`      | SearchMode.AUTO 模式下，debounce 时间                                            | --     |

```ts
export enum SearchMode {
  //自动触发搜索
  AUTO = "AUTO",
  //手动触发搜索
  MANUAL = "MANUAL",
}

export type ISearchMode = keyof typeof SearchMode;
```

## 属性

| 名称      | 类型       | 说明       | 默认值 |
| --------- | ---------- | ---------- | ------ |
| `columns` | `TColumns` | 通用项配置 | --     |

# FormItem

- 借鉴 ant-design-vue Form.Item 的字段。

```
{
  "name": "",       //item 项 prop
  "label": ""       //item 项 名称
}
```

- 继承对应组件库的所有配置

# FormList

FormList 是 FormItem 包装的组件。

- 继承成 FormItem 的所有属性
- 暂未支持通用配置

```tsx
const formState = reactive({
  list: [],
});

<ProForm model={formState}>
  <ProFormList name={"list"}>
    <ProFormText name={"text"} label={"text"} />
    <ProFormText name={"text2"} label={"text2"} />
  </ProFormList>
</ProForm>;
```

## API

### 插槽

| 名称        | 说明             |
| ----------- | ---------------- |
| `itemAdd`   | item 项添加 列表 |
| `itemMinus` | item 项删除      |
| `add`       | item 项添加 整体 |
