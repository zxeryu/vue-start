## SearchForm

继承 ProForm 所有配置

## API

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
