## layer 组件

当前支持组件

| 名称                    | 对应 AMap 对象                |
| ----------------------- | ----------------------------- |
| `TileLayer`             | `AMap.TileLayer`              |
| `TileLayerSatellite`    | `AMap.TileLayer.Satellite`    |
| `TileLayerRoadNet`      | `AMap.TileLayer.RoadNet`      |
| `TileLayerTraffic`      | `AMap.TileLayer.Traffic`      |
| `TileLayerFlexible`     | `AMap.TileLayer.Flexible`     |
| `Buildings`             | `AMap.Buildings`              |
| `MassMarks`             | `AMap.MassMarks`              |
| `ImageLayer`            | `AMap.ImageLayer`             |
| `VideoLayer`            | `AMap.VideoLayer`             |
| `CanvasLayer`           | `AMap.CanvasLayer`            |
| `CustomLayer`           | `AMap.CustomLayer`            |
| `DistrictLayerWorld`    | `AMap.DistrictLayer.World`    |
| `DistrictLayerCountry`  | `AMap.DistrictLayer.Country`  |
| `DistrictLayerProvince` | `AMap.DistrictLayer.Province` |
| `HeatMap`               | `AMap.HeatMap`                |

## API

### 属性

| 名称     | 说明                           | 类型      | 默认值 |
| -------- | ------------------------------ | --------- | ------ |
| `opts`   | 当前组件的构造方法参数（静态） | `object`  | --     |
| `opts$`  | 当前组件的构造方法参数（动态） | `object`  | --     |
| `show`   | 是否展示                       | `boolean` | true   |
| `events` | 事件集                         | `TEvents` | --     |

```tsx
class MassMarks {
  constructor(data: MassData[], opts: MassMarkersOptions);
}

// 类似于 MassMarks 构造参数的情况，默认会把 data 属性集成到 opts 中，如：

<MassMarks opts={{ data: [], ...extra }} />;
```

### 方法

| 名称         | 说明                                  | 类型                     |
| ------------ | ------------------------------------- | ------------------------ |
| `getFeature` | 获取当前组件对应的 AMap[${type}] 对象 | `()=> new AMap[${type}]` |

### 事件

--

### 插槽

--
