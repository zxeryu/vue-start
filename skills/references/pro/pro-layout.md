# Pro 布局组件

页面布局组件，支持多种布局模式、菜单、标签页、面包屑等功能。

## 快速开始

```tsx
import { defineComponent } from "vue";

export default defineComponent(() => {
  const menuList = [
    { value: "home", label: "首页", path: "/" },
    {
      value: "user",
      label: "用户管理",
      children: [
        { value: "user-list", label: "用户列表", path: "/user/list" },
        { value: "user-add", label: "新增用户", path: "/user/add" },
      ],
    },
  ];

  return () => {
    return <pro-layout layout="compose" menus={menuList} />;
  };
});
```

## Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `layout` | 布局模式 | `'compose'` \| `'vertical'` \| `'horizontal'` \| `'horizontal-v'` \| `'simple'` |
| `menus` | 菜单数据 | `TLayoutMenu[]` |
| `fieldNames` | 菜单字段映射 | `object` |
| `collapse` | 菜单收起状态 | `boolean` |
| `tabs` | Tabs 配置 | `object` |
| `breadcrumb` | 面包屑配置 | `object` |
| `watermark` | 水印配置 | `object` |
| `drawerMenuVisible` | Drawer 显示状态（simple 模式） | `boolean` |
| `drawerProps` | Drawer 配置 | `object` |
| `menuProps` | 菜单配置 | `object` |
| `topMenuProps` | 顶部菜单配置（compose 模式） | `object` |
| `routeOpts` | 路由配置 | `object` |

---

## 综合示例

展示 5 种布局模式（compose/vertical/horizontal/horizontal-v/simple）、菜单配置、Tabs、面包屑、水印、插槽等核心功能。

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  // 菜单数据
  const menuList = [
    { value: "home", label: "首页", path: "/" },
    {
      value: "user",
      label: "用户管理",
      children: [
        { value: "user-list", label: "用户列表", path: "/user/list" },
        { value: "user-add", label: "新增用户", path: "/user/add" },
      ],
    },
  ];

  // 简单模式 Drawer 状态
  const drawerVisible = ref(false);

  return () => {
    return (
      <pro-layout
        // 布局模式：compose | vertical | horizontal | horizontal-v | simple
        layout="compose"
        menus={menuList}
        // 自定义字段名
        fieldNames={{ label: "title", value: "key", children: "nodes" }}
        // Tabs 配置
        tabs={{
          sessionKey: "my-tabs",
          clearWhileUnmount: true,
        }}
        // 面包屑
        breadcrumb={{}}
        // 水印
        watermark={{
          content: "vue-start",
          fontColor: "rgba(0,0,0,0.05)",
        }}
        // 简单模式 Drawer
        drawerMenuVisible={drawerVisible.value}
        v-slots={{
          // 头部插槽
          "header.start": () => <div>头部左侧</div>,
          "header.end": () => <div>头部右侧</div>,
          // 菜单插槽
          "menu.start": () => <div>菜单上方</div>,
          "menu.end": () => <div>菜单下方</div>,
          // 内容插槽
          default: () => <router-view />,
          // 简单模式触发器
          drawerMenuTrigger: () => (
            <el-button icon="menu" onClick={() => (drawerVisible.value = true)}>
              菜单
            </el-button>
          ),
        }}
      />
    );
  };
});
```

---