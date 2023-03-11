## ProPagination

基于 ElPagination 实现

## API

### 属性

继承 ElPagination 所有属性

| 名称            | 说明                      | 类型     | 默认值 |
| --------------- | ------------------------- | -------- | ------ |
| `page(v-model)` | 当前页数，同 current-page | `number` | 1      |

### 事件

继承 ElPagination 所有事件

| 名称             | 说明                        | 类型                                |
| ---------------- | --------------------------- | ----------------------------------- |
| `compose-change` | page 或者 pageSize 改变触发 | (page:number,pageSize:number)=>void |

### 插槽

继承 ElPagination 所有插槽
