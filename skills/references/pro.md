# @vue-start/pro 使用指南

`@vue-start/pro` 是基于 Vue3 的企业级中后台业务组件库，封装了常用的表单、表格、列表、详情等业务场景组件。

## 安装

```bash
pnpm add @vue-start/pro @vue-start/element-pro
```

## 全局配置

### ProConfig

全局配置组件，提供状态管理、接口调用、权限控制等功能。

```tsx
import { ProConfig } from "@vue-start/pro";
import { elementProMap } from "@vue-start/element-pro";

<ProConfig
  elementMap={elementProMap.elementMap}
  formElementMap={elementProMap.formElementMap}
  registerStores={[]}
  registerActors={[]}
  showMsg={(opts) => message.success(opts.content)}
  showModal={(opts) => Modal.confirm(opts)}
>
  <App />
</ProConfig>
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

```ts
import { useProConfig, useProMsg, useProModal, useProNotify } from "@vue-start/pro";

// 全局配置
const pro = useProConfig();

// 消息提示
const msg = useProMsg();
msg({ content: "操作成功" });

// 模态框
const modal = useProModal();
modal({ title: "确认", content: "是否删除？" });

// 通知
const notify = useProNotify();
notify({ type: "success", message: "完成" });
```

## 核心类型

### TColumn

通用列配置。

```ts
interface TColumn {
  title?: string;           // 列标题
  dataIndex?: string;       // 数据字段
  valueType?: string;        // 值类型：text、select、date、image 等
  width?: number | string;  // 列宽度
  fixed?: boolean | string; // 固定列
  hidden?: boolean;         // 隐藏
  editable?: boolean;        // 可编辑
  render?: string;          // 渲染方式
  //
  extra?: {                 // 额外配置
    desc?: object;           // Desc 组件配置
    search?: object;        // 搜索配置
    form?: object;           // 表单配置
    table?: object;          // 表格配置
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

## 目录结构

| 目录 | 说明 |
|------|------|
| `comp` | 基础组件（Form、Table、List、Page、Desc 等） |
| `comp/layout` | 布局组件（ProLayout、RouterView、Breadcrumb、Tabs） |
| `curd` | CRUD 业务组件 |
| `core` | 核心功能（ProConfig、Module、useProCurd） |
| `access` | 权限控制 |
| `theme` | 主题配置 |
| `locale` | 国际化 |

---

## 布局组件 (layout)

### ProLayout

页面布局组件，支持多种布局模式。

```tsx
<ProLayout
  :layout="compose"
  :menus="menuList"
  :tabs="{}"
  :breadcrumb="{}"
/>
```

**布局模式**

| 模式 | 说明 |
|------|------|
| `compose` | 顶部菜单 + 左侧子菜单（默认） |
| `vertical` | 左侧菜单 |
| `horizontal` | 顶部菜单 + 左侧菜单 |
| `horizontal-v` | 顶部菜单 + 左侧菜单（左右布局） |
| `simple` | 简单模式（Drawer 菜单） |

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `layout` | 布局模式 | `TLayoutType` |
| `menus` | 菜单数据 | `TLayoutMenu[]` |
| `tabs` | Tabs 配置 | `object` |
| `breadcrumb` | 面包屑配置 | `object` |
| `collapse` | 菜单收起状态 | `boolean` |
| `fieldNames` | 菜单字段映射 | `object` |

**插槽**

| 名称 | 说明 |
|------|------|
| `header.start` | 头部左侧 |
| `header.end` | 头部右侧 |
| `menu.start` | 菜单上方 |
| `menu.end` | 菜单下方 |

---

## 权限控制 (access)

### Permission

权限控制组件。

```tsx
<Permission value="user:add">
  <el-button>添加用户</el-button>
</Permission>

<Permission :suffix="['edit', 'delete']">
  <el-button>操作</el-button>
</Permission>
```

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `value` | 完整权限字符串 | `string \| string[]` |
| `suffix` | 权限后缀（自动拼接路由名） | `string \| string[]` |
| `splitStr` | 路由名与后缀分隔符 | `string` |

### Hooks

```ts
import { useHasPer, useHasPer2 } from "@vue-start/pro";

// 权限判断
const hasPer = useHasPer();
if (hasPer('user:add')) { }
if (hasPer('user_edit', { suffix: true, splitStr: '_' })) { }

// 简化版
const hasPer = useHasPer2();
hasPer(undefined, 'edit');  // 自动拼接当前路由名 + _edit
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

## 相关文档

- [pro-form.md](./pro-form.md) - 表单组件
- [pro-table.md](./pro-table.md) - 表格组件
- [pro-curd.md](./pro-curd.md) - CRUD 业务组件
