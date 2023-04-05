## ProPagination

基于 [Pagination(el)](https://element-plus.org/zh-CN/component/pagination.html) / [Pagination(ant)](https://www.antdv.com/components/pagination-cn) 实现

## API

### 属性

| 名称            | 说明                      | 类型     | 默认值 |
| --------------- | ------------------------- | -------- | ------ |
| `page(v-model)` | 当前页数，同 current-page | `number` | 1      |

### 事件

| 名称             | 说明                        | 类型                                |
| ---------------- | --------------------------- | ----------------------------------- |
| `compose-change` | page 或者 pageSize 改变触发 | (page:number,pageSize:number)=>void |

### 插槽

--
