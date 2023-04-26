## 展示组件

- 通过 value 等属性展示对应的值。
- 通过 Typography 展示

## API

### 属性

基础属性

| 名称        | 说明                | 类型                     | 默认值 |
| ----------- | ------------------- | ------------------------ | ------ |
| `value`     | value               | ` string``number``array` | --     |
| `showProps` | Typography 组件属性 | `object`                 | --     |
| `convert`   | 值转换              | `(v:string)=>string`     | --     |

> ProShowText

--

> ProShowDigit

| 名称               | 说明       | 类型      | 默认值 |
| ------------------ | ---------- | --------- | ------ |
| `decimalFixed`     | 保留小数位 | `number`  | 0      |
| `thousandDivision` | 千分位处理 | `boolean` | --     |

> ProShowOptions

| 名称       | 说明                       | 类型       | 默认值 |
| ---------- | -------------------------- | ---------- | ------ |
| `options`  | 列表数据                   | `TOptions` | 0      |
| `splitStr` | value 为数组时的分割字符串 | `string`   | ,      |
| `colorMap` | 颜色值,单个值生效          | `object`   | --     |

> ProShowTree

| 名称         | 说明                             | 类型                                                | 默认值 |
| ------------ | -------------------------------- | --------------------------------------------------- | ------ |
| `options`    | 列表数据(同时支持 data,treeData) | `TOptions`                                          | 0      |
| `splitStr`   | value 为数组时的分割字符串       | `string`                                            | /      |
| `fieldNames` | 值 map                           | `{value:'value';label:'label',children:"children"}` | --     |

> ProShowDate

| 名称      | 说明                             | 类型       | 默认值     |
| --------- | -------------------------------- | ---------- | ---------- |
| `options` | 列表数据(同时支持 data,treeData) | `TOptions` | 0          |
| `format`  | dayjs format 参数                | `string`   | YYYY-MM-DD |
| `isUnix`  | 是否是 unix 时间                 | `boolean`  | --         |

### 事件

--

### 插槽

--
