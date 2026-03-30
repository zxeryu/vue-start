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

## 组件映射

element-pro 提供 `elementMap` 和 `formElementMap`，供 `@vue-start/pro` 组件渲染时获取实际组件。

### elementMap

基础组件映射。

| Key | 组件 | 说明 |
|-----|------|------|
| `LoadingKey` | `pro-loading` | 加载组件 |
| `ModalKey` | `pro-modal` | 弹窗（基于 ElDialog） |
| `DrawerKey` | `pro-drawer` | 抽屉（基于 ElDrawer） |
| `PaginationKey` | `pro-pagination` | 分页（基于 ElPagination） |
| `MenusKey` | `pro-menus` | 菜单（基于 ElMenu） |
| `FormKey` | `pro-form` | 表单 |
| `FormItemKey` | `pro-form-item` | 表单项 |
| `TableKey` | `pro-table` | 表格 |
| `TableV2Key` | `pro-table-v2` | 虚拟表格 |
| `PopoverKey` | `pro-popover` | 气泡卡片 |
| `UploaderKey` | `pro-uploader` | 上传组件 |
| `DropdownKey` | `pro-dropdown` | 下拉菜单 |

### formElementMap

表单字段组件映射。

| 类型 | 组件 | 说明 |
|------|------|------|
| `text` | `pro-form-text` | 文本输入（基于 ElInput） |
| `digit` | `pro-form-text-number` | 数字输入（基于 ElInputNumber） |
| `digitRange` | `pro-form-input-number-range` | 数字范围 |
| `date` | `pro-form-date-picker` | 日期选择（基于 ElDatePicker） |
| `time` | `pro-form-time-picker` | 时间选择（基于 ElTimePicker） |
| `select` | `pro-form-select` | 下拉选择（基于 ProSelect） |
| `selectv2` | `pro-form-select-v2` | 虚拟化下拉（Element Plus 独有） |
| `treeSelect` | `pro-form-tree-select` | 树形选择（基于 ProTreeSelect） |
| `checkbox` | `pro-form-checkbox` | 多选组（基于 ProCheckbox） |
| `radio` | `pro-form-radio` | 单选组（基于 ProRadio） |
| `switch` | `pro-form-switch` | 开关（基于 ElSwitch） |
| `cascader` | `pro-form-cascader` | 级联选择（基于 ProCascader） |
| `color` | `pro-form-color` | 颜色选择（基于 ElColorPicker，Element Plus 独有） |

---

## 增强组件

### pro-modal

基于 ElDialog 实现，增强的弹窗组件。

**使用场景**：数据编辑、详情查看、确认操作等需要用户交互的场景。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `visible` (v-model) | 是否展示 | `boolean` | false |
| `confirmLoading` | 确认按钮 loading | `boolean` | - |
| `footer` | 是否展示 footer | `boolean` | true |
| `cancelText` | 取消按钮文字 | `string` | 取消 |
| `okText` | 确认按钮文字 | `string` | 确认 |

**事件**

| 事件 | 说明 | 参数 |
|------|------|------|
| `onCancel` | 取消事件 | `() => void` |
| `onOk` | 确认事件 | `() => void` |

**示例**

```tsx
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({ visible: false, loading: false });

  return () => (
    <>
      <el-button onClick={() => (state.visible = true)}>打开弹窗</el-button>
      <pro-modal
        v-model:visible={state.visible}
        title="编辑用户"
        confirmLoading={state.loading}
        onOk={async () => {
          state.loading = true;
          await saveData();
          state.loading = false;
          state.visible = false;
        }}
      >
        <div>弹窗内容</div>
      </pro-modal>
    </>
  );
});
```

---

### pro-drawer

基于 ElDrawer 实现，增强的抽屉组件。

**使用场景**：表单编辑、详情查看等需要较大编辑空间的操作。

**示例**

```tsx
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({ visible: false });

  return () => (
    <>
      <el-button onClick={() => (state.visible = true)}>打开抽屉</el-button>
      <pro-drawer v-model:visible={state.visible} title="用户详情" onClose={() => (state.visible = false)}>
        <div>抽屉内容</div>
      </pro-drawer>
    </>
  );
});
```

---

### pro-pagination

基于 ElPagination 实现，增强的分页组件。

**使用场景**：列表数据的分页展示。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `page` (v-model) | 当前页数 | `number` | 1 |
| `pageSize` (v-model) | 每页条数 | `number` | 10 |
| `total` | 总条数 | `number` | 0 |

**事件**

| 事件 | 说明 | 参数 |
|------|------|------|
| `composeChange` | page 或 pageSize 改变触发 | `(page, pageSize) => void` |

**示例**

```tsx
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({ page: 1, pageSize: 10, total: 100 });

  return () => (
    <pro-pagination
      v-model:page={state.page}
      v-model:pageSize={state.pageSize}
      total={state.total}
      onComposeChange={(page, pageSize) => loadData(page, pageSize)}
    />
  );
});
```

---

### pro-dropdown

基于 ElDropdown 实现，支持 options 配置的下拉菜单。

**使用场景**：表格操作列下拉菜单、批量操作按钮等。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 下拉选项 | `(TOption & DropdownItemProps)[]` |

**示例**

```tsx
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const options = reactive([
    { value: "edit", label: "编辑" },
    { value: "delete", label: "删除", danger: true },
  ]);

  return () => (
    <pro-dropdown options={options} onCommand={(cmd) => console.log(cmd)}>
      <el-button>操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
    </pro-dropdown>
  );
});
```

---

### pro-menus

基于 ElMenu 实现，支持 tree 数据配置的菜单组件。

**使用场景**：后台管理系统侧边栏导航。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `activeKey` (v-model) | 当前选中值 | `string` | - |
| `options` | tree 菜单数据 | `TreeOption[]` | - |
| `uniqueOpened` | 是否只展开一个子菜单 | `boolean` | - |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const activeKey = ref("1");

  const menuOptions = reactive([
    { value: "1", label: "首页" },
    {
      value: "2",
      label: "系统管理",
      children: [
        { value: "2-1", label: "用户管理" },
        { value: "2-2", label: "角色管理" },
      ],
    },
  ]);

  return () => (
    <pro-menus activeKey={activeKey.value} options={menuOptions} onMenuItemClick={(item) => console.log(item)} />
  );
});
```

---

### pro-tabs

基于 ElTabs 实现，支持 options 配置的标签页组件。

**使用场景**：表单步骤切换、数据分类展示。

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const activeKey = ref("1");

  const tabOptions = reactive([
    { value: "1", label: "基本信息" },
    { value: "2", label: "详细信息" },
  ]);

  return () => (
    <pro-tabs v-model={activeKey.value} options={tabOptions}>
      <div style={{ padding: 20 }}>Tab 内容区域</div>
    </pro-tabs>
  );
});
```

---

### pro-select

基于 ElSelect 实现，支持 options 配置的下拉选择组件。

**使用场景**：表单中的下拉选择，支持单选、多选、搜索。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `TOption[]` |
| `multiple` | 是否多选 | `boolean` |
| `filterable` | 是否可搜索 | `boolean` |
| `separator$` | 多选 value 分隔符 | `string` |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const value = ref<string[]>([]);

  const options = reactive([
    { value: "1", label: "待处理" },
    { value: "2", label: "处理中" },
    { value: "3", label: "已完成" },
  ]);

  return () => <pro-select v-model={value.value} options={options} multiple filterable placeholder="请选择" />;
});
```

---

### pro-tree-select

基于 ElTreeSelect 实现，树形选择组件。

**使用场景**：组织架构选择、分类目录选择。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `TOption[]` |
| `multiple` | 是否多选 | `boolean` |
| `emitPath` | 多选时是否返回完整路径 | `boolean` |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const value = ref<string[]>([]);

  const treeData = reactive([
    { value: "1", label: "技术部", children: [{ value: "1-1", label: "前端组" }, { value: "1-2", label: "后端组" }] },
    { value: "2", label: "运营部" },
  ]);

  return () => <pro-tree-select v-model={value.value} options={treeData} multiple emitPath placeholder="请选择" />;
});
```

---

### pro-checkbox

基于 ElCheckboxGroup 实现，支持 options 配置的多选组件。

**使用场景**：多条件筛选、权限配置。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `optionType` | 展示类型 | `default` \| `button` | default |
| `options` | 选项配置 | `TOption[]` | - |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const value = ref<string[]>([]);

  const options = reactive([
    { value: "1", label: "新增" },
    { value: "2", label: "编辑" },
    { value: "3", label: "删除" },
  ]);

  return () => (
    <>
      <pro-checkbox v-model={value.value} options={options} />
      <pro-checkbox v-model={value.value} options={options} optionType="button" style={{ marginTop: 16 }} />
    </>
  );
});
```

---

### pro-radio

基于 ElRadioGroup 实现，支持 options 配置的单选组件。

**使用场景**：单条件筛选、状态切换。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `optionType` | 展示类型 | `default` \| `button` | default |
| `options` | 选项配置 | `TOption[]` | - |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const value = ref("1");

  const options = reactive([
    { value: "1", label: "Vue" },
    { value: "2", label: "React" },
    { value: "3", label: "Angular" },
  ]);

  return () => <pro-radio v-model={value.value} options={options} optionType="button" />;
});
```

---

### pro-cascader

基于 ElCascader 实现，级联选择组件。

**使用场景**：地区选择、分类层级选择。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `TOption[]` |
| `emitPath` | 是否返回完整路径 | `boolean` |

**示例**

```tsx
import { defineComponent, ref, reactive } from "vue";

export default defineComponent(() => {
  const value = ref<string[]>([]);

  const options = reactive([
    { value: "beijing", label: "北京", children: [{ value: "chaoyang", label: "朝阳区" }] },
    { value: "shanghai", label: "上海", children: [{ value: "pudong", label: "浦东新区" }] },
  ]);

  return () => <pro-cascader v-model={value.value} options={options} placeholder="请选择地区" />;
});
```

---

### pro-uploader

基于 ElUpload 实现，文件上传增强组件。

**使用场景**：用户头像上传、文档上传、图片上传等文件上传场景。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `modelValue` (v-model) | 已上传文件列表 | `TFile[]` |
| `maxSize` | 最大文件大小(字节) | `number` |
| `onErrorMsg` | 错误提示方法 | `(type, msg) => void` |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const fileList = ref<any[]>([]);

  return () => (
    <pro-uploader
      v-model={fileList.value}
      action="/api/upload"
      maxSize={5 * 1024 * 1024}
      accept="image/*"
      onSuccess={(res) => console.log("上传成功:", res)}
    >
      <el-button size="small" type="primary">
        点击上传
      </el-button>
    </pro-uploader>
  );
});
```

---

### pro-loading

基于 ElLoading 指令实现，支持包裹内容和局部加载。

**使用场景**：数据加载中显示、页面初始化加载。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `loading` | 是否显示动画 | `boolean` |
| `text` | 加载文案 | `string` |
| `fullscreen` | 全屏加载 | `boolean` |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const isLoading = ref(false);

  return () => (
    <pro-loading loading={isLoading.value} text="加载中...">
      <div style={{ padding: 40 }}>内容区域</div>
    </pro-loading>
  );
});
```

---

## 表格组件

element-pro 的 `pro-table` 继承原生 ElTable 所有属性。

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `TColumns` |
| `dataSource` | 数据源 | `array` |
| `loading` | 加载状态 | `boolean` |
| `selectedRowKeys` (v-model) | 选中行 keys | `string[] \| string` |
| `rowSelection` | 行选择配置 | `object` |

### rowSelection 配置

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 选择类型 | `single` \| `multi` | multi |
| `onChange` | 选中变化回调 | `(keys, rows) => void` | - |

### 方法（通过 expose）

| 方法 | 说明 |
|------|------|
| `clearSelection` | 清空选中 |
| `getSelectionRows` | 获取选中行 |
| `clearSort` | 清空排序 |

**示例**

```tsx
import { defineComponent, reactive, ref } from "vue";

export default defineComponent(() => {
  const tableRef = ref();
  const state = reactive({ selectedRowKeys: [] as string[], loading: false });

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "姓名", dataIndex: "name" },
    { title: "状态", dataIndex: "status" },
  ];

  return () => (
    <>
      <pro-table
        ref={tableRef}
        columns={columns}
        dataSource={[]}
        loading={state.loading}
        v-model:selectedRowKeys={state.selectedRowKeys}
        rowSelection={{ onChange: (keys) => (state.selectedRowKeys = keys) }}
      />
      {state.selectedRowKeys.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <span>已选择 {state.selectedRowKeys.length} 项</span>
          <el-button onClick={() => tableRef.value?.clearSelection()}>清空</el-button>
        </div>
      )}
    </>
  );
});
```

---

## 表单组件

element-pro 的 `pro-form` 继承原生 ElForm 所有属性。

### Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `model` | 表单数据对象 | `object` |
| `columns` | 表单字段配置 | `array` |
| `hideRequiredMark` | 隐藏必填标记 | `boolean` |

### 方法（通过 expose）

| 方法 | 说明 |
|------|------|
| `clearValidate` | 清除验证 |
| `resetFields` | 重置字段 |
| `validate` | 验证 |
| `submit` | 提交 |

### 事件

| 事件 | 说明 | 类型 |
|------|------|------|
| `finish` | 表单提交成功 | `(values) => void` |
| `finishFailed` | 表单提交失败 | `(invalidFields) => void` |

**示例**

```tsx
import { defineComponent, reactive, ref } from "vue";

export default defineComponent(() => {
  const formRef = ref();
  const formState = reactive({ name: "", status: "", age: undefined as number | undefined });

  const columns = [
    { title: "姓名", dataIndex: "name", valueType: "text", required: true },
    { title: "年龄", dataIndex: "age", valueType: "digit" },
    { title: "状态", dataIndex: "status", valueType: "select", options: [{ value: "1", label: "启用" }, { value: "0", label: "禁用" }] },
  ];

  return () => (
    <pro-form
      ref={formRef}
      model={formState}
      columns={columns}
      labelWidth={80}
      onFinish={(values) => console.log("提交成功:", values)}
    >
      <el-button type="primary" html-type="submit">
        提交
      </el-button>
      <el-button onClick={() => formRef.value?.resetFields()}>重置</el-button>
    </pro-form>
  );
});