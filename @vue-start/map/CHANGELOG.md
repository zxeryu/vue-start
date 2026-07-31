# 0.0.10

- feat: 拆分 IMapProvide/IGroupProvide 上下文，LayerGroup/OverlayGroup 使用独立 provide
- feat: Loc 新增 enableGeo prop，选择/点击后自动逆地理编码
- feat: 新增 MapFitView 组件，根据 adcode 拟合地图视野
- feat: 新增 DistrictLayer 组件，支持省-市-区逐级下钻、悬停高亮、空白回退
- feat: 新增 getGeoJson 数据源机制，支持 geoJsonPath 和自定义 getGeoJson
- feat: 新增 normalizeAdcode，统一 adcode 为 string 类型
- feat: 新增 disabled prop，锁定模式下禁用空白回退
- fix: 修复 toTop 条件判断，点击空白区域可回退

# 0.0.9

- feat: MapAutoComplete、MapLoc组件；

# 0.0.7

- perf: useMapApi 返回插件对象 targetRef;

```ts
const { targetRef } = useMapApi("", {});
```
