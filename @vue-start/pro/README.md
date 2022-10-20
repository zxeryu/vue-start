# pro 系列组件

> 基于 ant-design-vue 和 element-plus 组件库，提供更高程度的抽象，提供更上层的设计规范，并且对应提供相应的组件使得开发者可以快速搭建出高质量的页面。

> @vue-start/pro 是一个实现了 pro 模式的抽象库，具体 UI 组件需要从对应的实现库引用：@vue-start/element-pro @vue-start/antd-pro

## 通用配置

### column

基础 column 配置基于 ant-design-vue 中 table 的 column，扩展了部分字段。让其可以满足更多需求。

| 字段名称         | 类型                 | 说明                                                          |
| ---------------- | -------------------- | ------------------------------------------------------------- |
| `valueType`      | `string`             | 对应组件，缺省值为 text，自带了一部分，也可以自定义 valueType |
| `formValueType`  | `string`             | 同 valueType，在 form 组件中使用该类型，默认为 valueType 的值 |
| `title`          | `string` `VNode`     | 标题的内容，在 form 中是 label                                |
| `dataIndex`      | `string`             | 与实体映射的 key，在 form 中是 name                           |
| `formItemProps`  | `formItemProps`      | 传递给 FormItem 的配置                                        |
| `formFieldProps` | `fieldProps`         | 传给渲染的组件的 props，自定义的时候也会传递                  |
| `search`         | `boolean` `signName` | 为 true 时，在 SearchForm 中显示                              |
| `form`           | `boolean` `signName` | 为 false 时，在 Form 中隐藏                                   |
| `table`          | `boolean` `signName` | 为 false 时，在 Table 中隐藏                                  |
| `detail`         | `boolean` `signName` | 为 false 时，在 Desc 中隐藏                                   |

注：`signName` 可以在组件中设置，上述 search、form、table、detail 都为默认值。

```typescript
export type TColumn = {
  title?: string | VNode;
  dataIndex?: string | number;
  valueType?: TValueType; //展示组件类型
  formValueType?: TValueType; //录入组件类型 如不存在，默认取valueType的值
  showProps?: Record<string, any>; //文字展示组件的props
  formItemProps?: { name?: string; label?: string }; //FormItem props
  formFieldProps?: Record<string, any>; //录入组件 props
  search?: boolean; //同extra中的search
  //拓展属性
  extra?: {
    //DescriptionsItem props
    desc?: Record<string, any>;
    //Col props
    col?: Record<string, any>;
    /**
     * 自定义标记，对columns进行筛选 和 排序
     * 默认支持：search、form、table、detail
     * 比如： search：标记搜索条件；searchSort：搜索项的顺序
     * 在Curd组件中可使用getSignColumns方法获取标记的Columns
     * [sign]：              boolean 标记
     * [`${sign}Sort`]：     标记的columns排序
     */
  } & Record<string, any>;
};
```

### columnState

- 对 column 进行补充。在实际使用过程中，column 通常作为静态数据配置，当需要为 column 加入动态数据时候可配置.
- 若 column 为 hook 或者计算(computed 生成)值，则不需要使用 columnState

```typescript
//组件会将[id]的值 merge 到对应的column中
type TColumnState = {
  //优先使用formItemProps中的name属性
  //id: column.formItemProps.name || column.dataIndex
  [id]: object;
};

const columns = [
  {
    title: "select",
    dataIndex: "select",
  },
];

const columnState = {
  select: {
    formFieldProps: {
      options: [{ value: "value-1", label: "label-1" }],
    },
  },
};

//比如：分别定义上述columns columnState，最终会合并成如下对象

const mergeColumns = [
  {
    title: "select",
    dataIndex: "select",
    formFieldProps: {
      options: [{ value: "value-1", label: "label-1" }],
    },
  },
];
```

### formElementMap

- 录入原子组件集合。
- 在 Form 中使用。
- 根据 column 中的 valueType 从 formElementMap 查找对应的组件。

```ts
type TFormElementMap = {
  [valueType]: FormItemComponent;
};
```

### elementMap

- 展示原子组件集合。
- 在展示的地方使用，如：Table、Desc 等
- 根据 column 中的 valueType 从 elementMap 查找对应的组件。

```ts
type TElementMap = {
  [valueType]: Component;
};
```

注：formElementMap 与 elementMap 中的 valueType 应该是像对应的，即：每一类 valueType 都有相对应的录入组件与展示组件。

## 原子组件

原子信息组件，统一 ProForm、ProTable 等组件里面的字段定义。valueType 是 pro 的灵魂，会根据 valueType 来映射成不同的组件。

以下是支持的常见表单项（具体已实际注册值为准）：

```typescript
export type TDefaultValueType =
  | "text"
  | "textarea"
  | "password"
  | "digit" // 数字输入
  | "date"
  | "dateRange"
  | "time"
  | "timeRange"
  | "select"
  | "treeSelect"
  | "checkbox"
  | "radio"
  | "slider"
  | "switch"
  | "rate"
  | "cascader";

export type TValueType = TDefaultValueType | string;
```
