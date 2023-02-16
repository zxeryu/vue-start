## ProCurdModal

- 根据 Curd 中的 mode 状态展示弹窗
- ModalCurd 中使用默认会在 ADD DETAIL EDIT 三种模式下打开弹窗

## API

继承 ProForm 中的所有属性

| 名称        | 说明                               | 类型     | 默认值                                               |
| ----------- | ---------------------------------- | -------- | ---------------------------------------------------- |
| `clsName`   | class 名称                         | `string` | pro-curd-modal                                       |
| `validMode` | 指定弹窗显示的 curdState 中的 mode | `string` | [CurdAction.ADD, CurdAction.DETAIL, CurdAction.EDIT] |
