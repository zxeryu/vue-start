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

## 组件列表

| 组件 | 说明 | 文档 |
|------|------|------|
| [pro-layout](./pro/pro-layout.md) | 页面布局组件 | 支持多种布局模式、菜单、标签页 |
| [pro-table](./pro/pro-table.md) | 表格组件 | 基于 Element Plus Table 的增强 |
| [pro-form](./pro/pro-form.md) | 表单组件 | 支持多种值类型、表单联动 |
| [pro-list](./pro/pro-list.md) | 列表组件 | 搜索 + 表格 + 分页组合 |
| [pro-page](./pro/pro-page.md) | 页面容器 | 标题、返回、加载等功能 |
| [pro-desc](./pro/pro-desc.md) | 详情组件 | 结构化数据展示 |
| [pro-operate](./pro/pro-operate.md) | 操作栏 | 操作按钮组、权限控制 |
| [pro-curd-module](./pro/pro-curd.md) | CRUD 聚合组件 | 列表 + 表单 + 弹窗完整方案 |

---

## 表单字段类型 (valueType)

pro-form 通过 `valueType` 指定字段类型，实际组件由 `formElementMap` 提供。

### 常用类型

| 值类型 | 说明 |
|--------|------|
| `text` | 文本输入 |
| `digit` | 数字输入 |
| `digitRange` | 数字范围 |
| `date` | 日期选择 |
| `dateRange` | 日期范围 |
| `time` | 时间选择 |
| `select` | 下拉选择 |
| `treeSelect` | 树形选择 |
| `checkbox` | 多选框 |
| `radio` | 单选框 |
| `switch` | 开关 |
| `cascader` | 级联选择 |
| `textarea` | 多行文本 |
| `password` | 密码输入 |
| `image` | 图片上传 |
| `file` | 文件上传 |

### 扩展类型 (Element Plus)

| 值类型 | 说明 |
|--------|------|
| `selectv2` | 虚拟化下拉 |
| `color` | 颜色选择 |

### 配置示例

```tsx
const columns = [
  { dataIndex: "name", title: "姓名", valueType: "text" },
  { dataIndex: "age", title: "年龄", valueType: "digit" },
  { dataIndex: "status", title: "状态", valueType: "select" },
  { dataIndex: "date", title: "日期", valueType: "date" },
  { dataIndex: "dateRange", title: "日期范围", valueType: "dateRange" },
  { dataIndex: "image", title: "图片", valueType: "image" },
  { dataIndex: "file", title: "文件", valueType: "file" },
];

// Select 类型配置选项
const selectColumn = {
  dataIndex: "status",
  title: "状态",
  valueType: "select",
  formFieldProps: {
    options: [
      { value: 1, label: "启用" },
      { value: 0, label: "禁用" },
    ],
  },
};
```

---

## 全局配置

### ProConfig

全局配置组件，提供状态管理、接口调用、权限控制等功能。

```tsx
import { defineComponent } from "vue";
import { ProConfig } from "@vue-start/pro";
import { elementProMap } from "@vue-start/element-pro";

export default defineComponent({
  setup() {
    return () => {
      return (
        <pro-config
          elementMap={elementProMap.elementMap}
          formElementMap={elementProMap.formElementMap}
          registerStores={[]}
          registerActors={[]}
          showMsg={(opts) => message.success(opts.content)}
          showModal={(opts) => Modal.confirm(opts)}
        >
          <App />
        </pro-config>
      );
    };
  },
});
```

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `elementMap` | 展示组件集 | `TElementMap` |
| `formElementMap` | 录入组件集 | `TElementMap` |
| `registerStores` | 全局状态注册 | `TRegisterStore[]` |
| `registerActors` | 全局接口注册 | `{ actor: IRequestActor }[]` |
| `registerMetas` | 全局 Meta 注册 | `TMeta[]` |
| `showMsg` | 消息提示 | `(opts) => void` |
| `showModal` | 模态框 | `(opts) => void` |
| `showNotify` | 通知 | `(opts) => void` |
| `convertRouter` | 路由转换 | `(router) => TRouter` |
| `appConfig` | 应用配置 | `TAppConfig` |

### Hooks

```tsx
import { defineComponent } from "vue";
import { useProConfig, useProMsg, useProModal, useProNotify } from "@vue-start/pro";

export default defineComponent({
  setup() {
    // 全局配置
    const pro = useProConfig();

    // 消息提示
    const msg = useProMsg();
    const handleSuccess = () => msg({ content: "操作成功" });

    // 模态框
    const modal = useProModal()
    const handleConfirm = () => modal({ title: "确认", content: "是否删除？" });

    // 通知
    const notify = useProNotify()
    const handleNotify = () => notify({ type: "success", message: "完成" });

    return () => {
      return <div>...</div>;
    };
  },
});
```

---

## 核心类型

### TColumn

通用列配置。

```ts
interface TColumn {
  title?: string;           // 列标题
  dataIndex?: string;       // 数据字段
  valueType?: string;       // 值类型：text、select、date、image 等
  width?: number | string;  // 列宽度
  fixed?: boolean | string; // 固定列
  hidden?: boolean;         // 隐藏
  editable?: boolean;       // 可编辑
  render?: string;          // 渲染方式
  //
  extra?: {                 // 额外配置
    desc?: object;          // Desc 组件配置
    search?: object;        // 搜索配置
    form?: object;          // 表单配置
    table?: object;         // 表格配置
  };
  // 响应式
  columnState?: Record<string, any>;
  columnState2?: Record<string, any>;
}
```

### IRequestActor

请求对象。

```ts
interface IRequestActor {
  name: string;
  requestFromReq?: (req: any) => AxiosRequestConfig;
  requestConfig?: AxiosRequestConfig;
}
```

---

## 权限控制 (access)

### Permission

权限控制组件。

```tsx
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => {
      return (
        <>
          <pro-permission value="user:add">
            <el-button>添加用户</el-button>
          </pro-permission>

          <pro-permission suffix={["edit", "delete"]}>
            <el-button>操作</el-button>
          </pro-permission>
        </>
      );
    };
  },
});
```

### Hooks

```tsx
import { defineComponent } from "vue";
import { useHasPer, useHasPer2 } from "@vue-start/pro";

export default defineComponent({
  setup() {
    // 权限判断
    const hasPer = useHasPer();
    const canAdd = hasPer("user:add");
    const canEdit = hasPer("user_edit", { suffix: true, splitStr: "_" });

    // 简化版
    const hasPerSimple = useHasPer2();
    const canEditSimple = hasPerSimple(undefined, "edit"); // 自动拼接当前路由名 + _edit

    return () => {
      return <div>...</div>;
    };
  },
});
```

---

## 主题配置 (theme)

### AppConfig

应用配置。

```ts
const AppConfig = {
  layout: "compose",
  primary: "#409eff",
  isDark: false,
  isTagsView: true,
  isBreadcrumb: false,
  isCollapse: false,
  isShowLogo: true,
  isWatermark: true,
  locale: "zh",
};
```

### ThemeToken

主题色配置。

```ts
const ThemeToken = {
  color: {
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
  },
  radius: "4px",
  lineHeight: 1.57,
  spacing: 4,
};
```

---

## 国际化 (locale)

内置中英文文案。

```ts
const zhLocale = {
  reset: "重置",
  submit: "提交",
  refresh: "刷新",
  operate: "操作",
  serialNumber: "序号",
  columnSettings: "列设置",
  add: "添加",
  edit: "编辑",
  delete: "删除",
  confirm: "确认",
  cancel: "取消",
  back: "返回",
};
```

---
