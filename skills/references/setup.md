# 项目接入与配置

本文档涵盖从零开始接入 vue-start 的所有必要步骤：安装、入口配置、ProConfig 全局配置、自定义扩展。

## 包依赖关系

```
                    ┌──────────────┐
                    │ @vue-start/  │
                    │   hooks      │  ← 基础工具（无依赖）
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ @vue-start/  │ │ @vue-start/  │ │ @vue-start/  │
    │   request    │ │   store      │ │   config     │
    │  (axios+rxjs)│ │  (rxjs)      │ │ (js-base64)  │
    └──────┬───────┘ └──────┬───────┘ └──────────────┘
           │                │
           ▼                ▼
    ┌────────────────────────────────┐
    │         @vue-start/persist     │
    │         (localforage)          │
    └────────────────────────────────┘

展示组件（独立，无相互依赖）:
  @vue-start/chart  (echarts)
  @vue-start/map    (高德地图)
  @vue-start/media

Pro 业务组件（依赖 element-pro 或 antd-pro）:
                    ┌──────────────┐
                    │ @vue-start/  │
                    │     pro      │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼                               ▼
    ┌──────────────┐                ┌──────────────┐
    │ @vue-start/  │                │ @vue-start/  │
    │ element-pro  │                │  antd-pro    │
    │ (element-plus)│               │(ant-design-vue)│
    └──────────────┘                └──────────────┘
```

## 最小工程接入

### 1. 安装

以 Element Plus 为例：

```bash
# 基础工具
pnpm add @vue-start/hooks @vue-start/request @vue-start/store @vue-start/config

# UI 增强 + Pro 业务组件
pnpm add @vue-start/pro @vue-start/element-pro element-plus

# 可选：图表、地图、媒体
pnpm add @vue-start/chart echarts
pnpm add @vue-start/map @amap/amap-jsapi-loader
pnpm add @vue-start/media
```

### 2. 入口配置

```tsx
// main.ts
import { createApp } from "vue";
import { createConfig } from "@vue-start/config";
import { createStore } from "@/store";
import { createRequest } from "@/request";
import App from "./App";

const app = createApp(App);

// 配置注入
app.use(createConfig());

// 状态管理
const store$ = await createStore();
app.use(store$);

// 请求客户端
const request = createRequest({ timeout: 10000 });
app.use(request);

app.mount("#app");
```

### 3. store 初始化

```ts
// src/store/index.ts
import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = async () => {
  const persist = new Persist({ name: "pro" });
  const values = await persist.loadPersistData();
  const store$ = createStoreOrigin(values!);
  persist.persistRx(store$);
  return store$;
};
```

### 4. ProConfig 配置

```tsx
// App.tsx
import { defineComponent } from "vue";
import { ProConfig } from "@vue-start/pro";
import { elementProMap } from "@vue-start/element-pro";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
  setup() {
    return () => (
      <pro-config
        elementMap={elementProMap.elementMap}
        formElementMap={elementProMap.formElementMap}
        registerStores={[]}
        registerActors={[]}
        showMsg={(opts) => ElMessage[opts.type || "info"](opts.content)}
        showModal={(opts) => ElMessageBox.confirm(opts.content, opts.title)}
      >
        <pro-layout menus={menus}>
          <router-view />
        </pro-layout>
      </pro-config>
    );
  },
});
```

### 5. 第一个页面

```tsx
// views/UserList.tsx
import { defineComponent } from "vue";
import { useFetch } from "@vue-start/request";
import { getUserList } from "@/api";

export default defineComponent({
  setup() {
    const { data, requesting } = useFetch(getUserList, { initEmit: true });

    const columns = [
      { dataIndex: "name", title: "姓名", valueType: "text" },
      { dataIndex: "age", title: "年龄", valueType: "digit" },
      { dataIndex: "status", title: "状态", valueType: "select" },
    ];

    return () => (
      <pro-page title="用户列表">
        <pro-table columns={columns} dataSource={data.value?.list} loading={requesting.value} />
      </pro-page>
    );
  },
});
```

## 导入路径速查

| 包名 | 导入路径 |
|------|---------|
| hooks | `@vue-start/hooks` |
| request | `@vue-start/request` |
| store | `@vue-start/store` |
| config | `@vue-start/config` |
| css | `@vue-start/css` |
| pro | `@vue-start/pro` |
| element-pro | `@vue-start/element-pro` |
| antd-pro | `@vue-start/antd-pro` |
| chart | `@vue-start/chart` |
| map | `@vue-start/map` |
| media | `@vue-start/media` |
| persist | `@vue-start/persist` |

---

# ProConfig 全局配置

`ProConfig` 是所有 `@vue-start/pro` 组件运行的前提，提供元素映射、消息提示、权限控制、路由等全局能力。

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `elementMap` | `TElementMap` | 是 | 展示组件映射（Modal、Loading、Pagination 等） |
| `formElementMap` | `TElementMap` | 是 | 表单字段组件映射（text、select、date 等） |
| `registerStores` | `TRegisterStore[]` | 否 | 全局状态注册 |
| `registerActors` | `{ actor: IRequestActor }[]` | 否 | 全局接口注册 |
| `registerMetas` | `TMeta[]` | 否 | 全局 Meta 注册 |
| `showMsg` | `(opts: TMsgOpts) => void` | 是 | 消息提示方法 |
| `showModal` | `(opts: TModalOpts) => void` | 是 | 模态框方法 |
| `showNotify` | `(opts: TNotifyOpts) => void` | 否 | 通知方法 |
| `convertRouter` | `(router: any) => TRouter` | 否 | 路由转换方法 |
| `appConfig` | `TAppConfig` | 否 | 应用配置（主题、布局等） |

### TMsgOpts

```ts
interface TMsgOpts {
  type?: "success" | "warning" | "error" | "info";
  content: string;
  duration?: number;
}
```

### TModalOpts

```ts
interface TModalOpts {
  title?: string;
  content: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}
```

### TNotifyOpts

```ts
interface TNotifyOpts {
  type?: "success" | "warning" | "error" | "info";
  title?: string;
  message: string;
  duration?: number;
}
```

## elementMap / formElementMap

这两个映射决定了 pro 组件最终渲染什么 UI。不同 UI 库提供不同的映射对象：

### Element Plus

```ts
import { elementProMap } from "@vue-start/element-pro";

// elementProMap.elementMap     → pro-modal, pro-drawer, pro-pagination, pro-table, ...
// elementProMap.formElementMap → text→pro-form-text, select→pro-form-select, ...
```

### Ant Design Vue

```ts
import { antdProMap } from "@vue-start/antd-pro";

// antdProMap.elementMap     → a-modal, a-drawer, a-pagination, pro-table, ...
// antdProMap.formElementMap → text→pro-form-text, select→pro-form-select, ...
```

## 全局 Hooks

```tsx
import { useProConfig, useProMsg, useProModal, useProNotify } from "@vue-start/pro";

export default defineComponent({
  setup() {
    // 获取全局配置实例
    const pro = useProConfig();

    // 消息提示
    const msg = useProMsg();
    msg({ content: "操作成功", type: "success" });

    // 确认框
    const modal = useProModal();
    modal({ title: "确认", content: "是否删除？" });

    // 通知
    const notify = useProNotify();
    notify({ type: "success", message: "提交完成" });

    return () => <div>...</div>;
  },
});
```

## 权限控制

ProConfig 内置权限控制能力，通过 `useHasPer` / `useHasPer2` 判断，通过 `pro-permission` 组件控制显示。

### 权限 Hooks

```tsx
import { useHasPer, useHasPer2 } from "@vue-start/pro";

// 精确匹配
const hasPer = useHasPer();
hasPer("user:add"); // true | false

// 后缀拼接（自动拼接当前路由名 + 后缀）
const hasPer2 = useHasPer2();
hasPer2(undefined, "edit"); // 等价于 hasPer("currentRoute_edit")
```

### 权限组件

```tsx
<pro-permission value="user:add">
  <el-button>添加用户</el-button>
</pro-permission>

<pro-permission suffix={["edit", "delete"]}>
  <el-button>操作</el-button>
</pro-permission>
```

## 主题配置

通过 `appConfig` 属性控制应用外观：

```tsx
<pro-config
  appConfig={{
    layout: "compose",      // 布局模式
    primary: "#409eff",     // 主题色
    isDark: false,          // 暗黑模式
    isTagsView: true,       // 标签页
    isBreadcrumb: false,    // 面包屑
    isCollapse: false,      // 折叠菜单
    isShowLogo: true,       // 显示 Logo
    isWatermark: true,      // 水印
    locale: "zh",           // 语言
    title: "管理系统",       // 标题
  }}
>
  <App />
</pro-config>
```

### TAppConfig

```ts
interface TAppConfig {
  layout?: "compose" | "vertical" | "horizontal" | "horizontal-v" | "simple";
  primary?: string;
  isDark?: boolean;
  isTagsView?: boolean;
  isBreadcrumb?: boolean;
  isCollapse?: boolean;
  isShowLogo?: boolean;
  isWatermark?: boolean;
  locale?: "zh" | "en";
  title?: string;
  logo?: string;
}
```

## 国际化

内置中英文文案，通过 `locale` 切换：

```ts
// 中文（默认）
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
  search: "搜索",
  expand: "展开",
  collapse: "收起",
};
```

---

# 自定义扩展

## 自定义 valueType（表单字段类型）

pro-form 的字段类型由 `formElementMap` 控制，可以扩展自定义类型。

### 步骤 1：编写自定义表单组件

```tsx
// components/ProFormSlider.tsx
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () => (
      <el-slider
        modelValue={props.modelValue}
        min={props.min}
        max={props.max}
        onUpdate:modelValue={(val) => emit("update:modelValue", val)}
      />
    );
  },
});
```

### 步骤 2：注册到 formElementMap

```tsx
import { elementProMap } from "@vue-start/element-pro";
import ProFormSlider from "@/components/ProFormSlider";

const customFormElementMap = {
  ...elementProMap.formElementMap,
  slider: ProFormSlider,
};
```

### 步骤 3：在 ProConfig 中使用

```tsx
<pro-config
  elementMap={elementProMap.elementMap}
  formElementMap={customFormElementMap}
>
  <App />
</pro-config>
```

### 步骤 4：在 column 中使用

```tsx
const columns = [
  {
    dataIndex: "volume",
    title: "音量",
    valueType: "slider",
    formFieldProps: { min: 0, max: 100 },
  },
];
```

## 自定义 elementMap 组件

替换 `elementMap` 中的组件来自定义 Modal、Loading 等行为。

```tsx
const CustomLoading = defineComponent({
  props: { loading: Boolean, text: String },
  setup(props, { slots }) {
    return () => (
      <div class={props.loading ? "custom-loading-overlay" : ""}>
        {props.loading && <div class="custom-spinner">{props.text}</div>}
        {slots.default?.()}
      </div>
    );
  },
});

const customElementMap = {
  ...elementProMap.elementMap,
  LoadingKey: CustomLoading,
};
```

## 自定义 ProTable 操作栏

### 自定义渲染元素

```tsx
const operate = {
  items: [
    { value: "edit", label: "编辑" },
    {
      value: "custom",
      label: "自定义",
      element: (record) => <el-tag type={record.status === 1 ? "success" : "danger"}>自定义</el-tag>,
    },
  ],
};
```

### 操作栏点击拦截

```tsx
const operate = {
  items: [{ value: "delete", label: "删除" }],
  operateItemClickMap: {
    delete: async (item, record) => {
      const confirmed = await ElMessageBox.confirm("确认删除？");
      return false;
    },
  },
};
```

## 自定义 ProCurd 操作

### 添加表格操作栏按钮（不触发弹窗）

```tsx
operates={[
  { action: CurdAction.LIST, actor: getList },
  { action: CurdAction.ADD, actor: addItem },
  {
    value: "export",
    label: "导出",
    tableOperate: true,
    onClick: (record) => downloadExcel(record),
  },
  {
    value: "approve",
    label: "审批",
    tableOperate: true,
    show: (record) => record.status === "pending",
    disabled: (record) => record.submitted === false,
    onClick: (record) => approveItem(record.id),
  },
]}
```

## 自定义 ProForm 列转换

使用 `convertColumn` 统一处理列配置：

```tsx
const convertColumn = (column: TColumn) => {
  if (column.valueType === "select") {
    return { ...column, formFieldProps: { ...column.formFieldProps, filterable: true } };
  }
  if (column.valueType === "switch") {
    return { ...column, formFieldProps: { ...column.formFieldProps, activeColor: "#13ce66" } };
  }
  return column;
};
```

## 更多扩展方式

- [Form 字段插槽](./pro/pro-form.md#formfieldprops-slots) — 通过插槽自定义表单字段渲染
- [ProTable 自定义列](./pro/pro-table.md) — 通过 `customRender` 自定义单元格渲染
- [ProLayout 自定义插槽](./pro/pro-layout.md) — 自定义头部、菜单等插槽