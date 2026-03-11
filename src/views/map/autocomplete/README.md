## Autocomplete

## API

### 属性

基础属性

| 名称            | 说明                       | 类型                                     | 默认值 |
| --------------- | -------------------------- | ---------------------------------------- | ------ |
| `opts`          | AMap.AutoComplete 构造参数 | `object`                                 | --     |
| `debounceTime`  | input 输入 debounce 时间   | `number`                                 | 500    |
| `convertResult` | 值转换                     | `(v:any[])=>any[]`                       | --     |
| `renderComp`    | 渲染 autocomplete 组件     | `(v:{query, onSelect, valueRef})=>VNode` | --     |

### 事件

| 名称     | 说明     | 类型            | 默认值 |
| -------- | -------- | --------------- | ------ |
| `select` | 选中事件 | `(v:any)=>void` | --     |

### 插槽

| 名称      | 说明                   | 类型                                     | 默认值 |
| --------- | ---------------------- | ---------------------------------------- | ------ |
| `default` | 渲染 autocomplete 组件 | `(v:{query, onSelect, valueRef})=>VNode` | --     |
