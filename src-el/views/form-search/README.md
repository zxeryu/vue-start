## SearchForm

继承 ProForm 所有配置

## API

| 名称            | 说明                                                                             | 类型          | 默认值 |
| --------------- | -------------------------------------------------------------------------------- | ------------- | ------ |
| `initEmit`      | 初始化执行 submit，会触发 finish 事件                                            | `boolean`     | --     |
| `searchMode`    | 搜索模式：自动触发 或 手动触发                                                   | `ISearchMode` | --     |
| `debounceKeys`  | SearchMode.AUTO 模式下，需要 debounce 处理的字段                                 | `array`       | --     |
| `debounceTypes` | SearchMode.AUTO 模式下，debounceKeys 为空时，需要 debounce 处理的 valueType 类型 | `array`       | --     |
| `debounceTime`  | SearchMode.AUTO 模式下，debounce 时间                                            | `number`      | --     |

```ts
export enum SearchMode {
  //自动触发搜索
  AUTO = "AUTO",
  //手动触发搜索
  MANUAL = "MANUAL",
}

export type ISearchMode = keyof typeof SearchMode;
```
