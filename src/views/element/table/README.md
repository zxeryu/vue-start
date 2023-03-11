# ProTable

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

| 名称              | 类型                     | 说明                                           | 默认值    |
| ----------------- | ------------------------ | ---------------------------------------------- | --------- |
| `clsName`         | `string`                 | class name                                     | pro-table |
| `columns`         | `TColumns`               | 通用项配置                                     | --        |
| `columnState`     | `object`                 | 通用项拓展                                     | --        |
| `elementMap`      | `object`                 | 展示组件集                                     | --        |
| `formElementMap`  | `object`                 | 录入组件集                                     | --        |
| `column`          | `TTableColumn`           | 公共 table column 配置                         | --        |
| `columnEmptyText` | `string`                 | 默认空字符串                                   | --        |
| `serialNumber`    | `boolean` `TTableColumn` | 是否展示序号，为对象的时候为 table column 配置 | --        |
| `paginationState` | `TPageState`             | 计算分页，用于序号展示                         | --        |
| `operate`         | `ITableOperate`          | 操作栏配置                                     | --        |

```ts
export type TPageState = { page?: number; pageSize?: number };

/**
 * 单个操作描述
 */
export interface IOperateItem {
  value: string | number;
  label?: string | VNode;
  show?: boolean | ((record: Record<string, any>) => boolean);
  disabled?: boolean | ((record: Record<string, any>) => boolean);
  loading?: boolean | ((record: Record<string, any>) => boolean);
  //
  extraProps?: object | ((record: Record<string, any>) => Record<string, any>);
  onClick?: (record: Record<string, any>) => void;
  sort?: number;
  element?: (record: Record<string, any>, item: IOperateItem) => VNode;
}

/**
 * 整个操作栏描述
 */
export interface ITableOperate {
  column?: TColumn; //table 的column属性
  items?: IOperateItem[];
  //对item的补充 key为item的value
  itemState?: { [key: string]: Omit<IOperateItem, "value"> };
  //ProOperate 组件的属性
  clsName?: ProOperateProps["clsName"];
  elementKey?: ProOperateProps["elementKey"];
}
```

### 事件

--

### 插槽

继承 ant-design-vue/element-plus 的插槽

| 名称                               | 说明                            | 类型                                  |
| ---------------------------------- | ------------------------------- | ------------------------------------- |
| `toolbar`                          | 工具栏                          | ()=>VNode                             |
| `columnSetting-${slotName}`        | 列设置 ColumnSetting 组件的插槽 | ()=>VNode                             |
| `operate-${IOperateItem['value']}` | ProOperate 组件的插槽           | (record:any,item:IOperateItem)=>VNode |
