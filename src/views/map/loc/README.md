## Loc

## API

### 属性

基础属性

| 名称         | 说明                   | 类型        | 默认值 |
| ------------ | ---------------------- | ----------- | ------ |
| `enableAuto` | 展示 MapAutoComplete   | `boolean`   | --     |
| `autoProps`  | MapAutoComplete props  | `object`    | --     |
| `geoOpts`    | AMap.Geocoder 构造参数 | `object`    | --     |
| `modelValue` | 值                     | `[lng,lat]` | --     |

### 事件

| 名称      | 说明                     | 类型            | 默认值 |
| --------- | ------------------------ | --------------- | ------ |
| `select`  | MapAutoComplete 选择事件 | `(v:any)=>void` | --     |
| `click`   | 地图点击事件             | `(v:any)=>void` | --     |
| `address` | 逆地理编码查询成功事件   | `(v:any)=>void` | --     |

### 插槽

--

### 方法

| 名称            | 说明               | 类型                     | 默认值 |
| --------------- | ------------------ | ------------------------ | ------ |
| `geoReqCurrent` | 发起逆地理编码请求 | `()=>void`               | --     |
| `geoReq`        | 发起逆地理编码请求 | `(opts,[lng,lat])=>void` | --     |
