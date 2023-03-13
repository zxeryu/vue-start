## ProPage

作为独立页面使用

## API

### 属性

| 名称                 | 说明                                                | 类型      | 默认值 |
| -------------------- | --------------------------------------------------- | --------- | ------ |
| `title`              | 标题                                                | `string`  | --     |
| `subTitle`           | 副标题                                              | `string`  | --     |
| `showBack`           | 是否展示返回按钮                                    | `boolean` | --     |
| `hideWhileNoHistory` | 没有历史记录情况下是否隐藏，showBack 为 true 时生效 | `boolean` | true   |
| `loading`            | 是否展示加载动画                                    | `boolean` | --     |
| `loadingOpts`        | 加载动画组件属性                                    | `object`  | --     |

### 事件

| 名称   | 说明         | 类型     |
| ------ | ------------ | -------- |
| `back` | 返回按钮触发 | ()=>void |

### 插槽

| 名称       | 说明            | 类型      |
| ---------- | --------------- | --------- |
| `title`    | 自定义 title    | ()=>VNode |
| `subTitle` | 自定义 subTitle | ()=>VNode |
| `space`    | --              | VNode     |
| `extra`    | --              | VNode     |
| `default`  | --              | VNode     |
| `footer`   | --              | VNode     |
