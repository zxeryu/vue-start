## ProSelect

基于 ElSelect 实现，支持 options 配置

## API

### 属性

继承 ElSelect 所有属性

| 名称           | 说明                        | 类型                      | 默认值                 |
| -------------- | --------------------------- | ------------------------- | ---------------------- |
| `options`      | Option 属性 & ElOption 属性 | `TOption & ElOptionProps` | --                     |
| `fieldNames`   | 同 props                    | `props`                   | --                     |
| `expMethods`   | expose 方法拓展             | `string[]`                | 同 ElTreeSelect.expose |
| `separator$`   | value 转字符串配置（多选）  | `string`                  | --                     |
| `parseValue$`  | value 自定义-解析           | `function`                | --                     |
| `formatValue$` | value 自定义-转换           | `function`                | --                     |

### 事件

继承 ElSelect 所有事件

### 插槽

继承 ElSelect 所有插槽

| 名称      | 说明         | 类型                                   |
| --------- | ------------ | -------------------------------------- |
| `label`   | 自定义 label | (item:TOption & ElOptionProps )=>VNode |
| `start`   | --           | VNode                                  |
| `default` | --           | VNode                                  |
