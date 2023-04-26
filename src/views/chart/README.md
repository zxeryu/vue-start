# @vue-start/chart

> 基于 echarts 二次封装的图表库

## Chart

- 绑定 dom
- 随布局变化执行 resize 方法
- loading prop

## API

### 属性

| 名称              | 说明                                                                              | 类型                | 默认值          |
| ----------------- | --------------------------------------------------------------------------------- | ------------------- | --------------- |
| `theme`           | echarts init 方法参数                                                             | ` string``object `  | --              |
| `opts`            | echarts init 方法参数                                                             | `object`            | --              |
| `basicOption`     | 默认的 option， 在执行 setOption 的时候会与 option 合并，在类型图表封装中推荐使用 | `object`            | mergeOptionData |
| `option`          | 动态 option 数据，chart.setOption 方法参数                                        | `object`            | --              |
| `optionOpts`      | chart.setOption 方法参数                                                          | `object`            | --              |
| `mergeOptionData` | basicOption 与 option 合并方法                                                    | `object`            | --              |
| `resize`          | 开启 resize 监听，为 object 类型时， 作为 chart.resize()参数                      | ` boolean``object ` | true            |
| `loading`         | 展示 loading 动画，为 object 类型时， 作为 chart.showLoading()参数                | ` boolean``object ` | false           |
| `events`          | 事件对象                                                                          | `TEvent[]`          | false           |

```ts
/**
 *  默认merge规则
 *  1、basicOption 中的series为不同type的公共属性，会merge到 option 中对应的 series 中
 *  2、其他属性
 *    1）basicOption[prop] 为 object，option[prop] 为 array。覆盖；
 *    2）basicOption[prop] 为 array。                        覆盖；
 *    3）其他情况，lodash merge 规则；
 */
```

```ts
export type TEvent = { eventName: string; handler: (...params: any[]) => void; query?: string | object }[];
```

### 事件

--

### 插槽

| 名称      | 说明 | 类型  |
| --------- | ---- | ----- |
| `default` | --   | VNode |
