## ProSelect

基于 ElSelect 实现，支持 options 配置

## API

### 属性

继承 ElSelect 所有属性

| 名称      | 说明                        | 类型                      | 默认值 |
| --------- | --------------------------- | ------------------------- | ------ |
| `options` | Option 属性 & ElOption 属性 | `TOption & ElOptionProps` | --     |

### 事件

继承 ElSelect 所有事件

### 插槽

继承 ElSelect 所有插槽

| 名称      | 说明         | 类型                                   |
| --------- | ------------ | -------------------------------------- |
| `label`   | 自定义 label | (item:TOption & ElOptionProps )=>VNode |
| `start`   | --           | VNode                                  |
| `default` | --           | VNode                                  |
