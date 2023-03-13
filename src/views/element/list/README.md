## ProList

ProSearchForm+ProTable+Pagination 组合而成的组件

## API

### 属性

继承 ElTabs 所有属性

| 名称              | 类型                      | 说明                               | 默认值   |
| ----------------- | ------------------------- | ---------------------------------- | -------- |
| `clsName`         | `string`                  | class name                         | pro-list |
| `searchProps`     | `SearchProps`             | ProSearchForm 属性                 | --       |
| `tableProps`      | `TableProps`              | ProTable 属性                      | --       |
| `paginationProps` | `PaginationProps` `false` | Pagination 属性，值为 false 不展示 | --       |
| `pageState`       | `TPageState`              | 分页状态                           | --       |

```ts
export type TPageState = {
  page: number;
  pageSize: number;
};
```

### 事件

| 名称     | 说明                          | 类型                                            |
| -------- | ----------------------------- | ----------------------------------------------- |
| `search` | search 或 pagination 改变触发 | (values: Record<string,any> & TPageState)=>void |

### 插槽

| 名称         | 说明                             | 类型                                             |
| ------------ | -------------------------------- | ------------------------------------------------ |
| `start`      | start                            | ()=>VNode                                        |
| `divide`     | divide                           | ()=>VNode                                        |
| `divide2`    | divide2                          | ()=>VNode                                        |
| `end`        | end                              | ()=>VNode                                        |
| `search`     | 重写 search，代替 ProSearchForm  | ({executeSearchWithResetPage, pageState})=>VNode |
| `table`      | 重写 table，代替 ProTable        | ({pageState})=>VNode                             |
| `pagination` | 重写 pagination，代替 Pagination | ({ executePageChange, pageState })=>VNode        |
