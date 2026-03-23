# @vue-start/map 使用指南

`@vue-start/map` 是基于高德地图 JS API 的 Vue3 组件封装，提供地图容器、覆盖物、图层、控件等组件化支持。

## 安装

```bash
pnpm add @vue-start/map @amap/amap-jsapi-loader @amap/amap-jsapi-types
```

## 核心组件

### Map

地图容器组件。

```tsx
import { Map } from '@vue-start/map';

<Map
  securityJsCode="安全密钥"
  :loadOpts="{
    key: '你的Key',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Scale']
  }"
  :opts="{ zoom: 13, center: [116.39, 39.9] }"
  :events="[
    { type: 'click', handler: (e) => console.log(e.lnglat) }
  ]"
/>
```

**属性**

| 属性 | 说明 | 类型 |
|------|------|------|
| `securityJsCode` | 安全密钥 | `string` |
| `loadOpts` | 地图加载配置 | `TLoadOpts` |
| `opts` | 地图实例配置 | `AMap.MapOptions` |
| `events` | 地图事件 | `TEvents[]` |

**TLoadOpts 配置**

```ts
{
  key: string;           // Web端开发者Key
  version?: string;       // JSAPI 版本，默认 1.4.15
  plugins?: string[];     // 插件列表
  AMapUI?: {             // AMapUI 配置
    version?: string;
    plugins?: string[];
  };
  Loca?: {               // Loca 配置
    version?: string;
  };
}
```

**TEvents 事件类型**

```ts
{ type: string; handler: (...args) => void; once?: boolean }
```

**方法（通过 expose）**

```ts
mapRef.value.setCenter([lng, lat]);  // 设置中心点
mapRef.value.setZoom(13);             // 设置缩放级别
mapRef.value.getAllOverlays();        // 获取所有覆盖物
// ... 其他 AMap.Map 方法
```

### useMap

获取地图实例。

```tsx
import { useMap } from '@vue-start/map';

const { mapRef, overlayGroup, layerGroup } = useMap();
```

### MapEvents

地图事件绑定组件（内部使用）。

### MapPlugin

地图插件加载组件。

```tsx
<MapPlugin :plugins="['AMap.ToolBar']">
  <ToolBar />
</MapPlugin>
```

### useMapPlugin

插件加载 Hook。

```ts
useMapPlugin(['AMap.Geolocation'], () => {
  console.log('插件加载完成');
});
```

## 覆盖物组件 (overlay)

### Marker

点标记。

```tsx
<Marker
  :opts="{
    position: [116.39, 39.9],
    title: '标注',
    icon: '...'
  }"
  :show="true"
  :events="[{ type: 'click', handler: () => {} }]"
/>
```

| 属性 | 说明 | 类型 |
|------|------|------|
| `opts` | 标记配置 | `AMap.MarkerOptions` |
| `opts$` | 响应式配置 | `AMap.MarkerOptions` |
| `show` | 是否显示 | `boolean` |
| `events` | 事件列表 | `TEvents[]` |

### 基础覆盖物

| 组件 | 说明 |
|------|------|
| `CircleMarker` | 圆点标记 |
| `Text` | 文本标注 |

### 覆盖物组

| 组件 | 说明 |
|------|------|
| `Polygon` | 多边形 |
| `Polyline` | 折线 |
| `Circle` | 圆形 |
| `Rectangle` | 矩形 |
| `Ellipse` | 椭圆 |
| `BezierCurve` | 贝塞尔曲线 |

### OverlayGroup

覆盖物组容器。

```tsx
<OverlayGroup
  :bind="true"
  :opts$="{ options: { strokeOpacity: 0.8 } }"
>
  <Marker :opts="{ position: [116.39, 39.9] }" />
  <Circle :opts="{ center: [116.4, 40], radius: 1000 }" />
</OverlayGroup>
```

| 属性 | 说明 | 类型 |
|------|------|------|
| `bind` | 是否绑定到地图 | `boolean` |
| `bindTime` | 延时绑定时间 | `number` |
| `show` | 是否显示 | `boolean` |
| `opts$` | 响应式配置 | `object` |
| `events` | 事件列表 | `TEvents[]` |

### InfoWindow

信息窗体。

```tsx
<InfoWindow
  :opts="{
    isCustom: false,
    content: '<div>信息内容</div>',
    position: [116.39, 39.9]
  }"
  :visible="infoVisible"
  @close="infoVisible = false"
/>
```

## 控件组件

| 组件 | 插件 | 说明 |
|------|------|------|
| `ToolBar` | AMap.ToolBar | 工具条 |
| `Scale` | AMap.Scale | 比例尺 |
| `HawkEye` | AMap.HawkEye | 鹰眼 |
| `MapType` | AMap.MapType | 图层切换 |
| `ControlBar` | AMap.ControlBar | 控件栏 |
| `ElasticMarker` | AMap.ElasticMarker | 灵活点标记 |

## 图层组件 (layer)

### 基础图层

| 组件 | 说明 |
|------|------|
| `TileLayer` | 切片图层 |
| `TileLayerSatellite` | 卫星图层 |
| `TileLayerRoadNet` | 路网图层 |
| `TileLayerTraffic` | 交通图层 |
| `Buildings` | 建筑物图层 |

### 高级图层

| 组件 | 说明 |
|------|------|
| `MassMarks` | 海量点 |
| `ImageLayer` | 图片图层 |
| `VideoLayer` | 视频图层 |
| `CanvasLayer` | Canvas 图层 |
| `CustomLayer` | 自定义图层 |
| `TileLayerFlexible` | 灵活切片图层 |

### 行政区图层

| 组件 | 说明 |
|------|------|
| `DistrictLayerWorld` | 世界行政区 |
| `DistrictLayerCountry` | 国家行政区 |
| `DistrictLayerProvince` | 省级行政区 |

### HeatMap

热力图（需加载插件）。

```tsx
<HeatMap
  :opts="{
    radius: 30,
    opacity: [0.4, 0.8]
  }"
  :data="heatData"
/>
```

### LayerGroup

图层组容器。

```tsx
<LayerGroup :bind="true">
  <TileLayerSatellite />
  <TileLayerTraffic />
</LayerGroup>
```

## 功能组件 (comp)

### MapLoc

位置选择组件，集成搜索和逆地理编码。

```tsx
<MapLoc
  v-model="position"
  :enableAuto="true"
  :geoOpts="{ radius: 500 }"
  :autoProps="{ city: '北京' }"
  @address="handleAddress"
  @click="handleClick"
  @select="handleSelect"
/>
```

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 位置坐标 | `[number, number]` | - |
| `enableAuto` | 启用搜索 | `boolean` | true |
| `autoProps` | 搜索配置 | `object` | - |
| `geoOpts` | 逆地理编码配置 | `object` | - |

**事件**

| 事件 | 说明 | 类型 |
|------|------|------|
| `update:modelValue` | 位置变化 | `[lng, lat]` |
| `address` | 地理编码结果 | `RegeocodeResult` |
| `click` | 地图点击 | `MapsEvent` |
| `select` | 搜索选择 | `Tip` |

**方法（通过 expose）**

```ts
geoReqCurrent();  // 重新请求当前坐标的地址
geoReq(opts, position);  // 请求指定坐标的地址
```

### MapAutoComplete

自动完成搜索组件。

```tsx
<MapAutoComplete
  :opts="{ city: '全国' }"
  :debounceTime="500"
  :convertResult="(tip) => ({ value: tip.name, ...tip })"
>
  {({ query, onSelect }) => (
    <Input
      onChange={(e) => query(e.target.value)}
    />
  )}
</MapAutoComplete>
```

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `opts` | 搜索配置 | `object` | `{ city: '全国' }` |
| `debounceTime` | 防抖时间 | `number` | 500 |
| `convertResult` | 结果转换 | `function` | - |
| `renderComp` | 自定义渲染 | `function` | - |

**插槽参数**

```ts
{
  query: (keyword: string) => void;   // 搜索方法
  onSelect: (item) => void;           // 选择回调
  valueRef: Ref<string>;              // 输入值引用
}
```

## API 服务 (api)

### useMapApi

调用地图 API 的 Hook。

```ts
import { useMapApi, ApiNames } from '@vue-start/map';

const { request, loading$ } = useMapApi(ApiNames.Geocoder_getLocation, {
  onSuccess: (result) => console.log(result),
  onError: (error) => console.error(error),
});

request({ address: '北京市朝阳区' }, []);
```

### ApiNames

API 名称常量。

```ts
ApiNames = {
  // 地理编码
  Geocoder_getLocation,   // 地址转坐标
  Geocoder_getAddress,     // 坐标转地址

  // 自动完成
  AutoComplete_search,      // 关键字搜索

  // 地点搜索
  PlaceSearch_search,
  PlaceSearch_searchNearBy,
  PlaceSearch_searchInBounds,
  PlaceSearch_getDetails,

  // 行政区
  DistrictSearch_search,

  // 公交路线
  LineSearch_search,
  LineSearch_searchById,
  StationSearch_search,
  StationSearch_searchById,

  // ...更多
}
```

## 地图插件常量 (Plugin)

### MapPluginType

常用插件名称常量。

```ts
MapPluginType = {
  // 控件类
  ToolBar: 'AMap.ToolBar',
  Scale: 'AMap.Scale',
  HawkEye: 'AMap.HawkEye',
  MapType: 'AMap.MapType',
  ControlBar: 'AMap.ControlBar',
  ElasticMarker: 'AMap.ElasticMarker',

  // 编辑类
  CircleEditor: 'AMap.CircleEditor',
  PolygonEditor: 'AMap.PolygonEditor',
  PolylineEditor: 'AMap.PolylineEditor',
  MouseTool: 'AMap.MouseTool',

  // 服务类
  Geolocation: 'AMap.Geolocation',
  Geocoder: 'AMap.Geocoder',
  AutoComplete: 'AMap.AutoComplete',
  PlaceSearch: 'AMap.PlaceSearch',

  // 路线规划
  Driving: 'AMap.Driving',
  Walking: 'AMap.Walking',
  Riding: 'AMap.Riding',
  Transfer: 'AMap.Transfer',

  // 其他
  HeatMap: 'AMap.HeatMap',
  Weather: 'AMap.Weather',
  MarkerCluster: 'AMap.MarkerCluster',
}
```