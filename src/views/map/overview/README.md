# @vue-start/map

基于 vue3 的高德地图组件及 api

- 地图自动加载，直接使用 Map 组件即可；
- 插件自动加载处理，使用过程中会动态加载对应的插件；
- 统一的事件处理；
- 支持高阶组件 LayerGroup OverlayGroup；

## install

```shell

yarn add @vue-start/map

#其他依赖库
yarn add @vue-start/hooks
yarn add lodash

```

## use

```tsx
import { defineComponent } from "vue";
import { Map, Marker, useMap } from "@vue-start/map";

const Sub = defineComponent(() => {
  //子组件获取 map 对象
  const { mapRef } = useMap();

  return () => {
    return null;
  };
});

export default defineComponent(() => {
  return () => {
    return (
      <Map>
        <Marker />
        {/* 其他 */}
      </Map>
    );
  };
});
```

## API

### Map 属性

| 名称             | 说明                             | 类型               | 默认值 |
| ---------------- | -------------------------------- | ------------------ | ------ |
| `securityJsCode` | 密钥                             | `string`           | --     |
| `loadOpts`       | @amap/amap-jsapi-loader 方法参数 | `TLoadOpts `       | --     |
| `opts`           | AMap 对象构造方法参数            | `AMap.MapOptions ` | --     |
| `events`         | 事件列表对象                     | `TEvents`          | --     |

```ts
export type TEvents = { type: AMap.EventType; handler: (...args: any[]) => void; once?: boolean }[];
```

### 事件

--

### 插槽

| 名称      | 说明    | 类型      |
| --------- | ------- | --------- |
| `default` | default | ()=>VNode |
