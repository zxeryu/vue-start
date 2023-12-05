## InputNumberRange

基于 InputNumber 实现

- 支持 FormItem 使用

## API

### 属性

| 名称         | 说明                                              | 类型               | 默认值 |
| ------------ | ------------------------------------------------- | ------------------ | ------ |
| `start`      | 左侧输入框属性                                    | `InputNumberProps` | --     |
| `end`        | 右侧输入框属性                                    | `InputNumberProps` | --     |
| `singleEmit` | true：正常 emit；false：必须两个值都存在才 emit； | `function`         | false  |
| `divider`    | 间隔符号                                          | `function`/`slot`  | --     |

element-plus 属性

| 名称                  | 说明 | 类型    | 默认值 |
| --------------------- | ---- | ------- | ------ |
| `modelValue(v-model)` | 值   | `array` | --     |

ant-design-vue 属性

| 名称             | 说明 | 类型    | 默认值 |
| ---------------- | ---- | ------- | ------ |
| `value(v-model)` | 值   | `array` | --     |

### 事件

原始组件事件

### 插槽

原始组件插槽
