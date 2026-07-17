# 常见问题排查

## ProConfig 未配置导致组件不渲染

**现象**：pro-table、pro-form 等组件不显示或报错 `Cannot read property of undefined`。

**原因**：所有 pro 组件都依赖 `ProConfig` 提供的 `elementMap` 和 `formElementMap`。

**解决**：确保在根组件中使用 `ProConfig` 包裹，并正确传入映射表。

```tsx
// 必须包裹在 App 最外层
<pro-config
  elementMap={elementProMap.elementMap}
  formElementMap={elementProMap.formElementMap}
  // ...
>
  <App />
</pro-config>
```

## 表单字段不显示

**现象**：column 配置了 `valueType` 但对应字段不渲染或显示空白。

**排查**：
1. 检查 `pro-config` 的 `formElementMap` 是否包含该 `valueType`
2. 检查 `column.dataIndex` 与 `model` 中的字段名是否一致
3. 检查是否设置了 `hidden: true` 或 `showState` 为 false

## ProTable 数据不更新

**现象**：修改 `dataSource` 后表格不刷新。

**解决**：`dataSource` 必须是响应式数据（reactive 或 ref 的 `.value`）。

```tsx
// 正确：使用 reactive 或 ref
const state = reactive({ dataSource: [] });
const { data } = useFetch(getList, { initEmit: true });
watchEffect(() => { state.dataSource = data.value?.list || []; });

// 错误：直接赋值非响应式数组
const dataSource = []; // 不会触发更新
```

## 表单提交后状态未重置

**现象**：使用 `pro-search-form` 搜索后，表单值保留。

**解决**：`pro-search-form` 的 `onReset` 事件可用于重置额外状态，但 reset 按钮本身会重置表单值。

## CRUD 操作后列表未刷新

**现象**：新增/编辑/删除成功后列表不刷新。

**解决**：CRUD 组件内部会自动调用 `refreshList()`。如果未刷新，检查：
1. 对应的 `actor` 是否正确配置
2. `convertData` 是否返回了正确的 `{ total, dataSource }` 格式
3. 接口是否正常返回

## 权限控制不生效

**现象**：`pro-permission` 组件始终显示/隐藏。

**排查**：
1. 确认 `ProConfig` 是否正确配置了权限数据源
2. `useHasPer` 依赖 `pro` 实例中的权限信息，确保权限数据已注入

## 地图组件加载失败

**现象**：地图组件不显示或报 JSAPI 加载错误。

**解决**：
1. 确认 `loadOpts.key` 是有效的高德 Web 端 Key
2. 确认 `securityJsCode` 与服务端配置一致
3. 检查插件列表是否拼写正确

## ECharts 图表不响应尺寸变化

**现象**：窗口 resize 时图表不自动调整。

**解决**：确保 `ProChart` 的 `resize` 属性为 `true`（默认值），且容器有明确的宽高。

## 文件上传大小限制

**现象**：上传文件时报错但未提示。

**解决**：`pro-uploader` 的 `maxSize` 属性单位为字节，需配合 `onErrorMsg` 显示错误提示。

```tsx
<pro-uploader
  maxSize={5 * 1024 * 1024} // 5MB
  onErrorMsg={(type, msg) => ElMessage.error(msg)}
/>
```

## 样式不生效

**现象**：组件样式异常。

**排查**：
1. 确认已安装底层 UI 库（element-plus 或 ant-design-vue）并引入其样式
2. 确认 `@emotion/css` 已安装（pro 组件依赖）
3. 如果使用 `@vue-start/css` 的原子样式，确认 `createAtom` 的配置正确