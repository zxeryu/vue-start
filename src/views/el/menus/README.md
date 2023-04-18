## ProMenus

基于 [Menu(el)](https://element-plus.org/zh-CN/component/menu.html) / [Menu(ant)](https://www.antdv.com/components/menu-cn) 实现

作为 tree 数据使用

## API

### 属性

| 名称                   | 说明                        | 类型                                                 | 默认值                                                   |
| ---------------------- | --------------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| `activeKey`            | 当前选中对象                | `string`                                             | --                                                       |
| `options`              | tree 数据对象               | `TreeOptions`                                        | --                                                       |
| `fieldNames`           | tree 数据映射关系           | `{ children: string; value: string; label: string }` | { children: "children", value: "value", label: "label" } |
| `convertSubMenuProps`  | 根据数据生成 SubMenu props  | `Function`                                           | --                                                       |
| `convertMenuItemProps` | 根据数据生成 MenuItem props | `Function`                                           | --                                                       |
| `onMenuItemClick`      | MenuItem 点击事件           | `Function`                                           | --                                                       |

### 事件

--

### 插槽

公共插槽

| 名称    | 说明         | 类型  |
| ------- | ------------ | ----- |
| `title` | 自定义 title | VNode |

antv 独有插槽

| 名称         | 说明                                               | 类型  |
| ------------ | -------------------------------------------------- | ----- |
| `icon`       | 图标                                               | VNode |
| `expandIcon` | 自定义 SubMenu 展开收起图标                        | VNode |
| `hoverTitle` | 设置收缩时展示的悬浮标题（原 MenuItem title 属性） | VNode |
