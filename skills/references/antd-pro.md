# @vue-start/antd-pro 使用指南

`@vue-start/antd-pro` 是 Ant Design Vue 组件库的增强封装，提供更便捷的表单、表格、弹窗等功能。

## 安装

```bash
pnpm add @vue-start/antd-pro @vue-start/pro
```

## 表单组件

### ProForm

增强表单。

```tsx
import { ProForm, ProFormText, ProFormSelect } from '@vue-start/antd-pro';

<ProForm
  layout="horizontal"
  formState={formState}
  onFinish={(values) => console.log(values)}
>
  <ProFormText label="名称" name="name" rules={[{ required: true }]} />
  <ProFormSelect label="类型" name="type" options={typeOptions} />
</ProForm>
```

### ProSearchForm

搜索表单。

```tsx
import { ProSearchForm } from '@vue-start/antd-pro';

<ProSearchForm
  items={searchItems}
  onSearch={(values) => handleSearch(values)}
/>
```

### 表单字段类型

| 组件 | 类型 | 说明 |
|------|------|------|
| ProFormText | text | 文本输入 |
| ProFormTextNumber | digit | 数字输入 |
| ProFormInputNumberRange | digitRange | 数字范围 |
| ProFormDatePicker | date | 日期选择 |
| ProFormTimePicker | time | 时间选择 |
| ProFormSelect | select | 下拉选择 |
| ProFormTreeSelect | treeSelect | 树形选择 |
| ProFormCheckbox | checkbox | 多选框 |
| ProFormRadio | radio | 单选框 |
| ProFormSwitch | switch | 开关 |
| ProFormCascader | cascader | 级联选择 |

## 表格组件

### ProTable

增强表格。

```tsx
import { ProTable } from '@vue-start/antd-pro';

<ProTable
  columns={columns}
  dataSource={data}
  loading={loading}
  onReload={() => loadData()}
/>
```

### ProTableOperateItem

表格操作按钮。

```tsx
import { ProTableOperateItem } from '@vue-start/antd-pro';

const operate = [
  { label: '编辑', onClick: () => handleEdit(record) },
  { label: '删除', onClick: () => handleDelete(record), danger: true },
];
```

## 数据展示

### ProDesc

描述列表。

```tsx
import { ProDesc } from '@vue-start/antd-pro';

<ProDesc items={descItems} dataSource={record} />
```

### ProShowText / ProShowDigit / ProShowDate / ProShowOptions / ProShowTree

值展示组件。

```tsx
import {
  ProShowText,
  ProShowDigit,
  ProShowDate,
  ProShowOptions,
  ProShowTree,
} from '@vue-start/antd-pro';

<ProShowText value={textValue} />
<ProShowDigit value={numberValue} />
<ProShowDate value={dateValue} format="YYYY-MM-DD" />
<ProShowOptions value={selectedValue} options={options} />
<ProShowTree value={selectedValue} treeData={treeData} />
```

## 通用组件

```tsx
import {
  ProLoading,
  ProMenus,
  ProPagination,
  ProUploader,
} from '@vue-start/antd-pro';
```

## 组件映射

### elementMap

```ts
import { elementMap } from '@vue-start/antd-pro';

// 基础组件映射
elementMap[ElementKeys.LoadingKey]; // ProLoading
elementMap[ElementKeys.RowKey];      // Row
elementMap[ElementKeys.ModalKey];    // Modal
// ...
```

### formElementMap

```ts
import { formElementMap } from '@vue-start/antd-pro';

// 表单组件映射
formElementMap.text;      // ProFormText
formElementMap.select;    // ProFormSelect
formElementMap.date;      // ProFormDatePicker
// ...
```

## 与 Element Plus 版本差异

| 功能 | Element Plus | Ant Design Vue |
|------|-------------|-----------------|
| SelectV2 | 支持 | 不支持 |
| Color | 支持 | 不支持 |
| Drawer | ProDrawer | 原生 |
