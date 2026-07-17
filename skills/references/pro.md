# @vue-start/pro 使用指南

`@vue-start/pro` 是基于 Vue3 的企业级中后台业务组件库，封装了常用的表单、表格、列表、详情、布局等业务场景组件。

## 安装

```bash
pnpm add @vue-start/pro @vue-start/element-pro
# 或
pnpm add @vue-start/pro @vue-start/antd-pro
```

## 依赖说明

pro 是"包装组件"，实际组件渲染依赖底层 UI 库增强包：

| 底层包 | UI 库 | 说明 |
|--------|-------|------|
| `@vue-start/element-pro` | Element Plus | 默认推荐 |
| `@vue-start/antd-pro` | Ant Design Vue | 可选 |

## 全局配置

ProConfig 是所有 pro 组件的运行前提，详见 [项目接入与配置](./setup.md#proconfig-全局配置)。

```tsx
import { ProConfig } from "@vue-start/pro";
import { elementProMap } from "@vue-start/element-pro";

<pro-config
  elementMap={elementProMap.elementMap}
  formElementMap={elementProMap.formElementMap}
  showMsg={(opts) => ElMessage[opts.type || "info"](opts.content)}
  showModal={(opts) => ElMessageBox.confirm(opts.content, opts.title)}
>
  <App />
</pro-config>
```

## 组件列表

| 组件 | 说明 | 文档 |
|------|------|------|
| [pro-layout](./pro/pro-layout.md) | 页面布局组件 | 支持多种布局模式、菜单、标签页 |
| [pro-table](./pro/pro-table.md) | 表格组件 | 增强表格，支持操作栏、列合并、虚拟滚动 |
| [pro-form](./pro/pro-form.md) | 表单组件 | 支持多种值类型、表单联动、动态表单项 |
| [pro-list](./pro/pro-list.md) | 列表组件 | 搜索 + 表格 + 分页组合 |
| [pro-page](./pro/pro-page.md) | 页面容器 | 标题、返回、加载等功能 |
| [pro-desc](./pro/pro-desc.md) | 详情组件 | 结构化数据展示 |
| [pro-operate](./pro/pro-operate.md) | 操作栏 | 操作按钮组、权限控制 |
| [pro-curd-module](./pro/pro-curd.md) | CRUD 组件 | 组合/拆分模式，列表+表单+弹窗 |

---

## 表单字段类型 (valueType)

pro-form 通过 `valueType` 指定字段类型，实际渲染组件由 `ProConfig` 的 `formElementMap` 提供。

### 常用类型

| 值类型 | 说明 | 渲染组件 |
|--------|------|---------|
| `text` | 文本输入 | ElInput / AInput |
| `digit` | 数字输入 | ElInputNumber / AInputNumber |
| `digitRange` | 数字范围 | 两个 InputNumber 组合 |
| `date` | 日期选择 | ElDatePicker / ADatePicker |
| `dateRange` | 日期范围 | ElDatePicker(range) / ARangePicker |
| `time` | 时间选择 | ElTimePicker / ATimePicker |
| `select` | 下拉选择 | ProSelect / ASelect |
| `treeSelect` | 树形选择 | ProTreeSelect / ATreeSelect |
| `checkbox` | 多选框 | ProCheckbox / ACheckboxGroup |
| `radio` | 单选框 | ProRadio / ARadioGroup |
| `switch` | 开关 | ElSwitch / ASwitch |
| `cascader` | 级联选择 | ProCascader / ACascader |
| `textarea` | 多行文本 | ElInput(type=textarea) / ATextarea |
| `password` | 密码输入 | ElInput(showPassword) |
| `image` | 图片上传 | ProUploader |
| `file` | 文件上传 | ProUploader |

### Element Plus 扩展类型

| 值类型 | 说明 |
|--------|------|
| `selectv2` | 虚拟化下拉（仅 Element Plus） |
| `color` | 颜色选择（仅 Element Plus） |
| `table-select` | 表格选择 |

### 配置示例

```tsx
const columns = [
  { dataIndex: "name", title: "姓名", valueType: "text" },
  { dataIndex: "age", title: "年龄", valueType: "digit" },
  {
    dataIndex: "status",
    title: "状态",
    valueType: "select",
    formFieldProps: {
      options: [
        { value: 1, label: "启用" },
        { value: 0, label: "禁用" },
      ],
    },
  },
  { dataIndex: "date", title: "日期", valueType: "date" },
  { dataIndex: "dateRange", title: "日期范围", valueType: "dateRange" },
];
```

---

## 相关文档

- [项目接入与配置](./setup.md) — 安装、ProConfig、自定义扩展
