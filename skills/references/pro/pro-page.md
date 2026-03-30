# Pro 页面组件

页面容器组件，提供标题、返回、加载等页面级功能。

## 快速开始

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  return () => {
    return (
      <pro-page title="示例页面" subTitle="子标题" showBack>
        <div>页面内容</div>
      </pro-page>
    );
  };
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `title` | 页面标题 | `string` |
| `subTitle` | 副标题 | `string` |
| `showBack` | 是否显示返回按钮 | `boolean` |
| `loading` | 加载状态 | `boolean` |
| `loadingOpts` | loading 配置 | `object` |
| `fillMode` | 是否充满容器 | `boolean` |

---

## 综合示例

展示标题、副标题、返回按钮、加载状态、插槽等核心功能。

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  return () => {
    return (
      <pro-page
        title="示例页面"
        subTitle="子标题"
        showBack
        loading={true}
        loadingOpts={{ background: "#eee" }}
        v-slots={{
          extra: () => <el-button type="primary">操作按钮</el-button>,
        }}
      >
        <div>页面内容区域</div>
      </pro-page>
    );
  };
});
```

---