## ProOperate

操作按钮集合

## API

### 属性

继承 ElTabs 所有属性

| 名称         | 类型                      | 说明          | 默认值                |
| ------------ | ------------------------- | ------------- | --------------------- |
| `clsName`    | `string`                  | class name    | pro-operate           |
| `items`      | `IOpeItem[]`              | item 数据集合 | --                    |
| `itemState`  | `Record<string,IOpeItem>` | item 补充     | --                    |
| `elementKey` | `string`                  | item 补充     | ElementKeys.ButtonKey |

```ts
export interface IOpeItem {
  value: string | number;
  label?: string | VNode | (() => string | VNode);
  show?: boolean | (() => boolean);
  disabled?: boolean | (() => boolean);
  loading?: boolean | (() => boolean);
  //
  extraProps?: object | (() => Record<string, any>);
  onClick?: (value: string | number | boolean) => void;
  element?: (
    item?: Omit<IOpeItem, "show" | "disabled" | "opeProps" | "element"> & { disabled?: boolean },
  ) => VNode | null;
}
```

### 事件

--

### 插槽

--
