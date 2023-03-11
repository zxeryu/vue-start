## ProRadioGroup

基于 ElRadioGroup 实现，支持 options 配置

## API

### 属性

继承 ElRadioGroup 所有属性

| 名称          | 说明                                        | 类型                                      | 默认值  |
| ------------- | ------------------------------------------- | ----------------------------------------- | ------- |
| `buttonStyle` | 展示按钮类型                                | `default` `button`                        | default |
| `options`     | Option 属性 & Radio 属性 & RadioButton 属性 | `TOption & RadioProps & RadioButtonProps` | --      |

### 事件

继承 ElRadioGroup 所有事件

### 插槽

继承 ElRadioGroup 所有插槽

| 名称      | 说明         | 类型                                                  |
| --------- | ------------ | ----------------------------------------------------- |
| `label`   | 自定义 label | (item:TOption & RadioProps & RadioButtonProps)=>VNode |
| `start`   | --           | VNode                                                 |
| `default` | --           | VNode                                                 |
