## ProTabs

基于 [Tabs(el)](https://element-plus.org/zh-CN/component/tabs.html) / [Tabs(ant)](https://www.antdv.com/components/tabs-cn) 实现，支持 options 配置

## API

### 属性

| 名称      | 说明                       | 类型                      | 默认值 |
| --------- | -------------------------- | ------------------------- | ------ |
| `options` | Option 属性 & TabPane 属性 | `TOption & TabPaneProps ` | --     |

### 事件

--

### 插槽

| 名称      | 说明         | 类型                                 |
| --------- | ------------ | ------------------------------------ |
| `label`   | 自定义 label | (item:TOption & TabPaneProps)=>VNode |
| `start`   | --           | VNode                                |
| `default` | --           | VNode                                |
