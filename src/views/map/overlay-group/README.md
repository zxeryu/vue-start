## OverlayGroup

官方说明：

OverlayGroup 类用来包装其它覆盖物类的实例，对实例集合做整体操作，避免开发者对多个需要设置同样属性的覆盖物实例做循环处理。 此外从 group 中移除该覆盖物时，也会将该覆盖物从 group 对应的 map 中移除。 目前 OverlayGroup 支持 Marker, Polygon, Polyline, Circle,CircleMarker, Rectangle, Ellipse 和 BezierCurve。

## API

### 属性

| 名称       | 说明                                       | 类型      | 默认值 |
| ---------- | ------------------------------------------ | --------- | ------ |
| `bind`     | 是否将 OverlayGroup 对象绑定到地图上       | `boolean` | false  |
| `bindTime` | 将 OverlayGroup 对象绑定到地图上的延迟时间 | `number`  | --     |
| `opts$`    | AMap.OverlayGroup 的构造方法参数           | `object`  | --     |
| `show`     | 是否展示                                   | `boolean` | true   |
| `events`   | 事件集                                     | `TEvents` | --     |

```tsx
const bind = ref(false);

<OverlayGroup
  bind={bind.value} //如果数据是动态的，建议使用bind，当数据请求成功后再将bind赋为true
  bindTime={1000} //如果数据是静态的，建议使用bindTime
/>;
```

### 方法

| 名称         | 说明                                  | 类型                     |
| ------------ | ------------------------------------- | ------------------------ |
| `getFeature` | 获取当前组件对应的 AMap[${type}] 对象 | `()=> new AMap[${type}]` |

### 事件

--

### 插槽

--
