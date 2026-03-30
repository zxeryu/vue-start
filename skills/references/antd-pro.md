# @vue-start/antd-pro 使用指南

`@vue-start/antd-pro` 是 Ant Design Vue 组件库的增强封装，提供更便捷的表单、表格、弹窗等功能。

## 安装

```bash
pnpm add @vue-start/antd-pro @vue-start/pro
```

## 组件映射

antd-pro 提供 `elementMap` 和 `formElementMap`，供 `@vue-start/pro` 组件渲染时获取实际组件。

### elementMap

基础组件映射。

| Key | 组件 | 说明 |
|-----|------|------|
| `LoadingKey` | `pro-loading` | 加载组件 |
| `RowKey` | `a-row` | 栅格行 |
| `ColKey` | `a-col` | 栅格列 |
| `ModalKey` | `a-modal` | 弹窗 |
| `DrawerKey` | `a-drawer` | 抽屉 |
| `PaginationKey` | `a-pagination` | 分页 |
| `FormKey` | `pro-form` | 表单 |
| `FormItemKey` | `a-form-item` | 表单项 |
| `TableKey` | `pro-table` | 表格 |
| `DescKey` | `pro-desc` | 详情 |

### formElementMap

表单字段组件映射。

| 类型 | 组件 | 说明 |
|------|------|------|
| `text` | `pro-form-text` | 文本输入 |
| `digit` | `pro-form-input-number` | 数字输入 |
| `digitRange` | `pro-form-input-number-range` | 数字范围 |
| `date` | `pro-form-date-picker` | 日期选择 |
| `time` | `pro-form-time-picker` | 时间选择 |
| `select` | `pro-form-select` | 下拉选择 |
| `treeSelect` | `pro-form-tree-select` | 树形选择 |
| `checkbox` | `pro-form-checkbox` | 多选框 |
| `radio` | `pro-form-radio` | 单选框 |
| `switch` | `pro-form-switch` | 开关 |
| `cascader` | `pro-form-cascader` | 级联选择 |

### 值展示组件

| 组件 | 说明 |
|------|------|
| `pro-show-text` | 文本展示 |
| `pro-show-digit` | 数字展示 |
| `pro-show-date` | 日期展示 |
| `pro-show-options` | 选项展示 |
| `pro-show-tree` | 树形展示 |

---

## 增强组件

### a-modal

Ant Design Vue 原生弹窗组件。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `open` | 是否显示 | `boolean` | - |
| `title` | 标题 | `string \| slot` | - |
| `width` | 宽度 | `string \| number` | 520 |
| `maskClosable` | 点击遮罩关闭 | `boolean` | true |
| `confirmLoading` | 确认按钮 loading | `boolean` | - |
| `okText` | 确认按钮文字 | `string` | 确定 |
| `cancelText` | 取消按钮文字 | `string` | 取消 |

**事件**

| 事件 | 说明 | 参数 |
|------|------|------|
| `onCancel` | 取消事件 | `() => void` |
| `onOk` | 确认事件 | `() => void` |

**插槽**

| 插槽 | 说明 |
|------|------|
| `default` | 弹窗内容 |
| `title` | 标题 |
| `footer` | 底部 |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const visible = ref(false);

  return () => {
    return (
      <>
        <a-button onClick={() => (visible.value = true)}>打开弹窗</a-button>
        <a-modal
          v-model:open={visible.value}
          title="标题"
          onCancel={() => (visible.value = false)}
          onOk={() => handleConfirm()}
        >
          <div>弹窗内容</div>
        </a-modal>
      </>
    );
  };
});
```

---

### a-drawer

Ant Design Vue 原生抽屉组件。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `open` | 是否显示 | `boolean` | - |
| `title` | 标题 | `string \| slot` | - |
| `width` | 宽度 | `string \| number` | 256 |
| `placement` | 位置 | `left \| right \| top \| bottom` | right |
| `maskClosable` | 点击遮罩关闭 | `boolean` | true |

**事件**

| 事件 | 说明 | 参数 |
|------|------|------|
| `onClose` | 关闭事件 | `() => void` |

**插槽**

| 插槽 | 说明 |
|------|------|
| `default` | 抽屉内容 |
| `title` | 标题 |
| `footer` | 底部 |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const visible = ref(false);

  return () => {
    return (
      <>
        <a-button onClick={() => (visible.value = true)}>打开抽屉</a-button>
        <a-drawer
          v-model:open={visible.value}
          title="抽屉标题"
          onClose={() => (visible.value = false)}
        >
          <div>抽屉内容</div>
        </a-drawer>
      </>
    );
  };
});
```

---

### a-pagination

Ant Design Vue 原生分页组件。

**Props**

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `current` (v-model) | 当前页数 | `number` | 1 |
| `pageSize` (v-model) | 每页条数 | `number` | 10 |
| `total` | 总数 | `number` | - |
| `showSizeChanger` | 显示每页条数切换 | `boolean` | false |
| `showQuickJumper` | 显示快速跳转 | `boolean` | false |

**事件**

| 事件 | 说明 | 参数 |
|------|------|------|
| `onChange` | 页码或每页条数改变 | `(page, pageSize) => void` |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(100);

  const handleChange = (page: number, size: number) => {
    console.log("page:", page, "pageSize:", size);
  };

  return () => {
    return (
      <a-pagination
        v-model:current={current.value}
        v-model:pageSize={pageSize.value}
        total={total.value}
        showSizeChanger
        onChange={handleChange}
      />
    );
  };
});
```

---

### pro-loading

Ant Design Vue 加载组件。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `loading` | 是否显示动画 | `boolean` |
| `tip` | 加载文案 | `string` |
| `fullscreen` | 全屏加载 | `boolean` |
| `spinnable` | 是否显示 spinner | `boolean` |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const isLoading = ref(false);

  const handleLoad = async () => {
    isLoading.value = true;
    await fetchData();
    isLoading.value = false;
  };

  return () => {
    return (
      <pro-loading loading={isLoading.value}>
        <div>内容区域</div>
      </pro-loading>
    );
  };
});
```

---

### pro-table

Ant Design Vue 增强表格。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `columns` | 列配置 | `ProColumns` |
| `dataSource` | 数据源 | `array` |
| `loading` | 加载状态 | `boolean` |
| `rowKey` | 行 key | `string` |
| `pagination` | 分页配置 | `boolean \| object` |
| `rowSelection` | 行选择配置 | `object` |

**方法（通过 expose）**

| 方法 | 说明 |
|------|------|
| `clearSelection` | 清空选中 |
| `getSelectionRows` | 获取选中行 |
| `reload` | 重新加载 |

**示例**

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const columns = [
    { title: "名称", dataIndex: "name" },
    { title: "状态", dataIndex: "status" },
  ];

  const dataSource = [
    { id: 1, name: "张三", status: "启用" },
    { id: 2, name: "李四", status: "禁用" },
  ];

  return () => {
    return (
      <pro-table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
      />
    );
  };
});
```

---

### pro-desc

Ant Design Vue 详情组件。

**Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `items` | 详情项配置 | `DescItem[]` |
| `dataSource` | 数据源 | `object` |
| `column` | 列数 | `number` |
| `bordered` | 显示边框 | `boolean` |
| `size` | 尺寸 | `default \| middle \| small` |

**示例**

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  const items = [
    { label: "姓名", value: "张三" },
    { label: "年龄", value: 25 },
    { label: "状态", value: "启用" },
  ];

  const data = { name: "张三", age: 25, status: "启用" };

  return () => {
    return <pro-desc items={items} dataSource={data} />;
  };
});
```

---

### pro-show-* 值展示组件

**公共 Props**

| 属性 | 说明 | 类型 |
|------|------|------|
| `value` | 值 | `any` |

**pro-show-options**

| 属性 | 说明 | 类型 |
|------|------|------|
| `options` | 选项配置 | `Option[]` |

**pro-show-date**

| 属性 | 说明 | 类型 |
|------|------|------|
| `format` | 格式化 | `string` |

**示例**

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  const options = [
    { value: "1", label: "选项一" },
    { value: "2", label: "选项二" },
  ];

  return () => {
    return (
      <>
        <pro-show-text value="文本内容" />
        <pro-show-digit value={12345} />
        <pro-show-date value="2024-01-01" format="YYYY-MM-DD" />
        <pro-show-options value="1" options={options} />
      </>
    );
  };
});
```

---

## 与 Element Plus 版本差异

| 功能 | Element Plus | Ant Design Vue |
|------|-------------|----------------|
| SelectV2 | 支持 | 不支持 |
| Color | 支持 | 不支持 |
| Drawer | ProDrawer | 原生 |
