## LayerGroup

官方说明：

LayerGroup 类用来包装其它图层类的实例， 对实例集合做批量操作， 避免开发者对多个需要设置同样属性的图层实例做循环处理。
同时只要对 LayerGroup 执行过 setMap 方法后， 新添加到该 LayerGroup 中的图层会自动将其 map 属性修改到该 group 对应的 map，
此外从 group 中移除该图层时，也会将该图层从 group 对应的 map 中移除。
如果对图层集合添加对某个事件的监听或解除监听， 图层集合会对集合中所有图层实例做集合处理，
只要该图层支持此事件， 该事件绑定/解除即对图层生效

## API

### 属性

| 名称       | 说明                                     | 类型      | 默认值 |
| ---------- | ---------------------------------------- | --------- | ------ |
| `bind`     | 是否将 LayerGroup 对象绑定到地图上       | `boolean` | false  |
| `bindTime` | 将 LayerGroup 对象绑定到地图上的延迟时间 | `number`  | --     |
| `opts$`    | AMap.LayerGroup 的构造方法参数           | `object`  | --     |
| `show`     | 是否展示                                 | `boolean` | true   |
| `events`   | 事件集                                   | `TEvents` | --     |

```tsx
const bind = ref(false);

<LayerGroup
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
