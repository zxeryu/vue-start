## ProTable

- ProForm 没有海克斯科技，只是对 Table 的封装
- 支持通用配置
- 借鉴 ant-design-vue Table column 属性
- operate 配置

```tsx
export type TColumn = {
  title: string; //标题
  dataIndex: ""; //prop
  customRender: () => VNode; //自定义组件
};

//操作栏配置

<ProTable
  columns={[]}
  dataSource={[]}
  operate={{
    items: [
      {
        value: "detail",
        label: "详情",
        show: true,
        onClick: (record) => {
          // handle event
        },
      },
    ],
  }}
/>;
```

## API

### 属性

| 名称              | 说明             | 类型            | 默认值 |
| ----------------- | ---------------- | --------------- | ------ |
| `columns`         | 通用项配置       | `TColumns`      | --     |
| `columnState`     | 通用项拓展       | `object`        | --     |
| `elementMap`      | 展示组件集       | `object`        | --     |
| `formElementMap`  | 录入组件集       | `object`        | --     |
| `column`          | 公共 column 配置 | `TTableColumn`  | --     |
| `columnEmptyText` | 默认空字符串     | `string`        | --     |
| `serialNumber`    | 是否展示序号     | `boolean`       | --     |
| `paginationState` | 计算分页         | `TPageState`    | --     |
| `operate`         | 操作栏配置       | `ITableOperate` | --     |

```ts
export type TPageState = { page?: number; pageSize?: number };

/**
 * 单个操作描述
 */
export interface IOperateItem {
  value: string | number;
  label?: string | VNode;
  element?: (record: Record<string, any>, item: IOperateItem) => VNode;
  show?: boolean | ((record: Record<string, any>) => boolean);
  disabled?: boolean | ((record: Record<string, any>) => boolean);
  onClick?: (record: Record<string, any>) => void;
  sort?: number;
}

/**
 * 整个操作栏描述
 */
export interface ITableOperate {
  column?: TColumn; //table 的column属性
  items?: IOperateItem[];
  //对item的补充 key为item的value
  itemState?: { [key: string]: Omit<IOperateItem, "value"> };
}
```
