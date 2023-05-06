## overlay 组件

当前支持组件

| 名称            | 对应 AMap 对象       |
| --------------- | -------------------- |
| `Marker`        | `AMap.Marker`        |
| `Polygon`       | `AMap.Polygon`       |
| `Polyline`      | `AMap.Polyline`      |
| `Circle`        | `AMap.Circle`        |
| `Rectangle`     | `AMap.Rectangle`     |
| `Ellipse`       | `AMap.Ellipse`       |
| `BezierCurve`   | `AMap.BezierCurve`   |
| `Text`          | `AMap.Text`          |
| `CircleMarker`  | `AMap.CircleMarker`  |
| `ElasticMarker` | `AMap.ElasticMarker` |
| `ToolBar`       | `AMap.ToolBar`       |
| `Scale`         | `AMap.Scale`         |
| `HawkEye`       | `AMap.HawkEye`       |
| `MapType`       | `AMap.MapType`       |
| `ControlBar`    | `AMap.ControlBar`    |

## API

### 属性

| 名称     | 说明                           | 类型      | 默认值 |
| -------- | ------------------------------ | --------- | ------ |
| `opts`   | 当前组件的构造方法参数（静态） | `object`  | --     |
| `opts$`  | 当前组件的构造方法参数（动态） | `object`  | --     |
| `show`   | 是否展示                       | `boolean` | true   |
| `events` | 事件集                         | `TEvents` | --     |

### 事件

--

### 插槽

目前组件中，只有 Marker 支持

| 名称      | 说明    | 类型      |
| --------- | ------- | --------- |
| `default` | default | ()=>VNode |
