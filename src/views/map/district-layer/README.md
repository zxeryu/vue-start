## DistrictLayer

## API

### 属性

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `provinceCode` | 省code | `string \| number` | -- |
| `cityCode` | 市code | `string \| number` | -- |
| `maxLevel` | 最大层级 | `"province" \| "city" \| "district"` | `"district"` |
| `fill` | 自定义填充颜色 | `(feature, state)=>string` | -- |
| `hoverColor` | 悬停颜色 | `string` | `"#ff7a45"` |
| `defaultColor` | 默认颜色 | `string` | `"#e6e6e6"` |
| `styles` | 全局 Polygon 样式 | `object` | -- |
| `disabled` | 禁用点击空白区域回退 | `boolean` | `false` |
| `fitView` | 是否自动定位 | `boolean` | `true` |
| `fitViewOpts` | 定位参数 | `{immediately?,avoid?,maxZoom?}` | -- |

### 事件

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `area` | 当前区域变化 | `(v:TAreaState)=>void` |
| `click` | 点击区域 | `(v:TArea)=>void` |
| `hover` | 悬停区域 | `(v:TArea\|undefined)=>void` |

### 插槽

--

### 方法

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `getState` | 获取当前状态 | `()=>TAreaState & {hover}` |