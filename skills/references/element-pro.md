# @vue-start/element-pro 使用指南

`@vue-start/element-pro` 是 Element Plus 组件库的增强封装，需要配合 `@vue-start/pro` 使用，提供更便捷的表单、表格、弹窗等功能。

## 安装

```bash
pnpm add @vue-start/element-pro @vue-start/pro element-plus
```

## 核心依赖

此库依赖 `@vue-start/pro` 提供的基础组件，需要先安装：

```bash
pnpm add @vue-start/pro
```

## 组件导出

### comp 目录（核心增强组件）

#### ProModal

基于 ElDialog 实现，增强的弹窗组件。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `clsName` | class 名称 | `string` | pro-modal |
| `visible` | 是否展示 | `boolean` | false |
| `maskClosable` | 点击遮罩关闭 | `boolean` | false |
| `footer` | 是否展示 footer | `boolean` | true |
| `cancelText` | 取消按钮文字 | `string` | 取消 |
| `okText` | 确认按钮文字 | `string` | 确认 |
| `confirmLoading` | 确认按钮 loading | `boolean` | - |
| `useScroll` | 内容使用 scroll 组件 | `boolean` | false |
| `scrollProps` | scroll 组件配置 | `object` | - |

**继承 ElDialog 所有属性**

```tsx
import { ProModal } from '@vue-start/element-pro';

<ProModal
  visible={visible}
  title="标题"
  onCancel={() => setVisible(false)}
  onOk={() => handleConfirm()}
>
  <div>弹窗内容</div>
</ProModal>
```

#### ProDrawer

基于 ElDrawer 实现，增强的抽屉组件。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `clsName` | class 名称 | `string` | pro-drawer |
| `visible` | 是否展示 | `boolean` | false |
| `footer` | 是否展示 footer | `boolean` | true |
| `confirmLoading` | 确认按钮 loading | `boolean` | - |
| `useScroll` | 内容使用 scroll 组件 | `boolean` | false |

#### ProLoading

基于 ElLoading 指令实现，支持包裹内容和局部加载。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `loading` | 是否显示动画 | `boolean` | false |
| `target` | 加载指向元素 | `string \| HTMLElement` | - |
| `fullscreen` | 全屏加载 | `boolean` | - |
| `lock` | 锁定背景滚动 | `boolean` | - |
| `text` | 加载文案 | `string` | - |

```tsx
<ProLoading loading={isLoading}>
  <div>内容区域</div>
</ProLoading>
```

#### ProPagination

基于 ElPagination 实现，增强的分页组件。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `page` (v-model) | 当前页数 | `number` | 1 |
| `pageSize` (v-model) | 每页条数 | `number` | - |

**继承 ElPagination 所有属性**

| 事件 | 说明 | 类型 |
|------|------|------|
| `composeChange` | page 或 pageSize 改变触发 | `(page, pageSize) => void` |

```tsx
<ProPagination
  page={currentPage}
  pageSize={pageSize}
  total={total}
  onComposeChange={(page, size) => handleChange(page, size)}
/>
```

#### ProPopover

基于 ElPopover 的简单封装。

```tsx
<ProPopover trigger="click" content="提示内容">
  <el-button>点击</el-button>
</ProPopover>
```

#### ProDropdown

基于 ElDropdown 实现，支持 options 配置。

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 下拉选项 | `(TOption & DropdownItemProps)[]` |

```tsx
import { ProDropdown } from '@vue-start/element-pro';

<ProDropdown
  options={[
    { value: '1', label: '编辑' },
    { value: '2', label: '删除', danger: true },
  ]}
  onCommand={(val) => handleCommand(val)}
>
  <el-button>操作</el-button>
</ProDropdown>
```

#### ProMenus

基于 ElMenu 实现，支持 tree 数据配置。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `activeKey` (v-model) | 当前选中值 | `string` | - |
| `options` | tree 菜单数据 | `TreeOption[]` | - |
| `fieldNames` | 数据映射 | `{ children, value, label }` | 默认值 |
| `convertSubMenuProps` | SubMenu props 转换 | `Function` | - |
| `convertMenuItemProps` | MenuItem props 转换 | `Function` | - |
| `onMenuItemClick` | 点击事件 | `(menu) => void` | - |

**插槽**

| 名称 | 说明 | 类型 |
|------|------|------|
| `title` | 自定义 title | `(menu) => VNode` |
| `default` | MenuItem 内容 | `(menu) => VNode` |

```tsx
<ProMenus
  activeKey={activeKey}
  options={menuTreeData}
  onMenuItemClick={({ key }) => router.push(key)}
/>
```

#### ProTabs

基于 ElTabs 实现，支持 options 配置。

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | Tab 配置 | `TOption & TabPaneProps[]` |

**插槽**

| 名称 | 说明 | 类型 |
|------|------|------|
| `label` | 自定义 label | `(item) => VNode` |
| `start` | 标签页头部起始位置 | `VNode` |
| `default` | 标签页内容 | `VNode` |

```tsx
<ProTabs
  options={[
    { key: 'tab1', tab: '标签一' },
    { key: 'tab2', tab: '标签二' },
  ]}
/>
```

#### ProSelect

基于 ElSelect 实现，支持 options 配置。

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `TOption[]` |
| `fieldNames` | 数据映射 | `props` |
| `separator$` | 多选 value 分隔符 | `string` |
| `parseValue$` | 自定义 value 解析 | `function` |
| `formatValue$` | 自定义 value 转换 | `function` |

**继承 ElSelect 所有属性、事件、插槽**

#### ProSelectV2

基于 ElSelectV2 实现，虚拟化下拉选择（Element Plus 独有）。

#### ProTreeSelect

基于 ElTreeSelect 实现，树形选择。

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `TOption[]` |
| `fieldNames` | 数据映射 | `props` |
| `useAllLevelValue` | value 使用所有层级 | `boolean` |
| `separator$` | 多选 value 分隔符 | `string` |
| `parseValue$` | 自定义 value 解析 | `function` |
| `formatValue$` | 自定义 value 转换 | `function` |

**继承 ElTreeSelect 所有属性、事件、插槽**

#### ProCheckbox

基于 ElCheckboxGroup 实现，支持 options 配置。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `optionType` | 展示类型 | `default` \| `button` | default |
| `options` | 选项配置 | `TOption[]` | - |

**插槽**

| 名称 | 说明 | 类型 |
|------|------|------|
| `label` | 自定义 label | `(item) => VNode` |

**继承 ElCheckboxGroup 所有属性、事件**

#### ProRadio

基于 ElRadioGroup 实现，支持 options 配置。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `optionType` | 展示类型 | `default` \| `button` | default |
| `options` | 选项配置 | `TOption[]` | - |

**继承 ElRadioGroup 所有属性、事件**

#### ProCascader

基于 ElCascader 实现，级联选择。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `options` | 选项配置 | `TOption[]` | - |
| `separator$` | value 分隔符 | `string` | - |
| `itemSeparator$` | 多选子级分隔符 | `string` | - |
| `parseValue$` | 自定义 value 解析 | `function` | - |
| `formatValue$` | 自定义 value 转换 | `function` | - |

**继承 ElCascader 所有属性、事件、插槽**

#### ProUploader

基于 ElUpload 实现，文件上传增强。

| 属性 | 说明 | 类型 |
|------|------|------|
| `modelValue` (v-model) | 已上传文件列表 | `TFile[]` |
| `maxSize` | 最大文件大小 | `number` |
| `convertResponseData` | 上传成功数据转换 | `(res) => Record` |
| `convertItemData` | 列表项数据转换 | `(item) => UploadFile` |
| `onErrorMsg` | 错误提示方法 | `(type, msg) => void` |
| `globalLoading` | 上传时全局 loading | `boolean \| object` |

**插槽**

| 名称 | 说明 |
|------|------|
| `start` | 上传触发前 |
| `end` | 上传触发后 |
| `default` | 自定义上传触发 |

```tsx
<ProUploader
  action="/api/upload"
  maxSize={10 * 1024 * 1024}
  v-model:modelValue={fileList}
  onSuccess={(res) => handleSuccess(res)}
/>
```

### table 目录

#### ProTable

基于 ElTable 实现，增强表格组件。

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TColumns` |
| `dataSource` | 数据源 | `array` |
| `loading` | 加载状态 | `boolean` |
| `selectedRowKeys` (v-model) | 选中行 keys | `string[] \| string` |
| `rowSelection` | 行选择配置 | `object` |
| `mergeOpts` | 行/列合并配置 | `TTableMergeOpts` |

**rowSelection 配置**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 选择类型 | `single` \| `multi` | multi |
| `column` | 选择列配置 | `ProTableColumnProps` | - |
| `onChange` | 选中变化回调 | `(keys, rows) => void` | - |
| `pagination` | 分页选择模式（多选） | `boolean` | - |

**方法（通过 expose）**

```ts
TableMethods = [
  'clearSelection',      // 清空选中
  'getSelectionRows',    // 获取选中行
  'toggleRowSelection',  // 切换选中
  'clearSort',           // 清空排序
  'clearFilter',         // 清空筛选
  'doLayout',           // 重新布局
  'sort',               // 排序
  'scrollTo',           // 滚动到
];
```

```tsx
<ProTable
  ref={tableRef}
  columns={columns}
  dataSource={data}
  rowSelection={{ type: 'multi', onChange: (keys, rows) => {} }}
/>
```

#### ProTableColumn

表格列组件。

| 属性 | 说明 | 类型 |
|------|------|------|
| `title` | 列标题 | `string` |
| `dataIndex` | 数据字段 | `string` |
| `children` | 子列配置 | `TColumns` |
| `customRender` | 自定义渲染 | `(params) => VNode` |

```tsx
<ProTableColumn
  title="名称"
  dataIndex="name"
  customRender={({ value }) => <span>{value}</span>}
/>
```

#### ProTableOperateItem

表格操作按钮，基于 ElButton。

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 按钮类型 | `string` | primary |
| `link` | 文字链接样式 | `boolean` | true |

### form 目录

#### ProForm

增强表单。

| 属性 | 说明 | 类型 |
|------|------|------|
| `hideRequiredMark` | 隐藏必填标记 | `boolean` |

**方法（通过 expose）**

```ts
FormMethods = ['clearValidate', 'resetFields', 'scrollToField', 'validate', 'validateField', 'submit'];
```

**事件**

| 事件 | 说明 | 类型 |
|------|------|------|
| `finish` | 表单提交成功 | `(values) => void` |
| `finishFailed` | 表单提交失败 | `(invalidFields) => void` |

```tsx
<ProForm
  ref={formRef}
  :model="formState"
  @finish="handleFinish"
>
  <ProFormText label="名称" name="name" />
</ProForm>
```

#### ProFormItem

表单项包装。

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 字段名称 | `string \| string[]` |

#### 表单字段类型

通过 `createFormItemComponent` 创建，支持以下类型：

| 组件 | 类型 | 说明 |
|------|------|------|
| `ProFormText` | text | 文本输入（基于 ElInput） |
| `ProFormTextNumber` | digit | 数字输入（基于 ElInputNumber） |
| `ProFormInputNumberRange` | digitRange | 数字范围（基于 InputNumberRange） |
| `ProFormDatePicker` | date | 日期选择（基于 ElDatePicker） |
| `ProFormTimePicker` | time | 时间选择（基于 ElTimePicker） |
| `ProFormSelect` | select | 下拉选择（基于 ProSelect） |
| `ProFormSelectV2` | selectv2 | 虚拟化下拉（Element Plus 独有） |
| `ProFormTreeSelect` | treeSelect | 树形选择（基于 ProTreeSelect） |
| `ProFormCheckbox` | checkbox | 多选组（基于 ProCheckbox） |
| `ProFormRadio` | radio | 单选组（基于 ProRadio） |
| `ProFormSwitch` | switch | 开关（基于 ElSwitch） |
| `ProFormCascader` | cascader | 级联选择（基于 ProCascader） |
| `ProFormColor` | color | 颜色选择（基于 ElColorPicker，Element Plus 独有） |

## 组件映射

### elementMap

用于 `@vue-start/pro` 组件渲染时获取实际组件。

```ts
import { elementMap } from '@vue-start/element-pro';

elementMap[ElementKeys.LoadingKey];     // ProLoading
elementMap[ElementKeys.ModalKey];       // ProModal
elementMap[ElementKeys.DrawerKey];       // ProDrawer
elementMap[ElementKeys.PaginationKey];   // ProPagination
elementMap[ElementKeys.MenusKey];       // ProMenus
elementMap[ElementKeys.FormKey];        // ProForm
elementMap[ElementKeys.FormItemKey];     // ProFormItem
elementMap[ElementKeys.TableKey];        // ProTable
elementMap[ElementKeys.TableV2Key];      // ProTableV2
elementMap[ElementKeys.PopoverKey];     // ProPopover
elementMap[ElementKeys.UploaderKey];     // ProUploader
elementMap[ElementKeys.DropdownKey];    // ProDropdown
```

### formElementMap

用于动态表单渲染。

```ts
import { formElementMap } from '@vue-start/element-pro';

formElementMap.text;       // ProFormText
formElementMap.digit;      // ProFormTextNumber
formElementMap.digitRange; // ProFormInputNumberRange
formElementMap.date;       // ProFormDatePicker
formElementMap.time;       // ProFormTimePicker
formElementMap.select;     // ProFormSelect
formElementMap.selectv2;   // ProFormSelectV2
formElementMap.treeSelect; // ProFormTreeSelect
formElementMap.checkbox;   // ProFormCheckbox
formElementMap.radio;      // ProFormRadio
formElementMap.switch;     // ProFormSwitch
formElementMap.cascader;   // ProFormCascader
formElementMap.color;      // ProFormColor
```

## Demo

更多示例和用法请参考：`src/views/el`
