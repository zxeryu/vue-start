## LabelsLayer

AMap.LabelsLayer 与 AMap.LabelMarker 两个类组成而成的组件。

## API

### 属性

| 名称       | 说明                                    | 类型      | 默认值 |
| ---------- | --------------------------------------- | --------- | ------ |
| `opts`     | AMap.LabelsLayer 的构造方法参数（静态） | `object`  | --     |
| `itemOpts` | AMap.LabelMarker 的构造方法参数（静态） | `object`  | --     |
| `data`     | AMap.LabelMarker 的构造方法参数集合     | `array`   | --     |
| `show`     | 是否展示                                | `boolean` | true   |
| `events`   | 事件集                                  | `TEvents` | --     |

### 方法

| 名称         | 说明                                  | 类型                     |
| ------------ | ------------------------------------- | ------------------------ |
| `getFeature` | 获取当前组件对应的 AMap[${type}] 对象 | `()=> new AMap[${type}]` |

### 事件

--

### 插槽

--
