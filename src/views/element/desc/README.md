## ProDesc

基于 Descriptions 和 DescriptionsItem 实现，支持 options 配置

## API

### 属性

继承 Descriptions 所有属性

| 名称          | 说明       | 类型       | 默认值   |
| ------------- | ---------- | ---------- | -------- |
| `clsName`     | class name | `string`   | pro-desc |
| `columns`     | 通用项配置 | `TColumns` | --       |
| `columnState` | 通用项拓展 | `object`   | --       |
| `elementMap`  | 展示组件集 | `object`   | --       |
| `model`       | 数据对象   | `object`   | --       |

### 事件

--

### 插槽

继承 Descriptions 所有插槽

| 名称      | 说明         | 类型                |
| --------- | ------------ | ------------------- |
| `label`   | 自定义 label | (item)=>VNode       |
| `value`   | 自定义 value | (value,item)=>VNode |
| `start`   | --           | VNode               |
| `default` | --           | VNode               |
