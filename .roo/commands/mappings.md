# 目录映射规则

该文件定义了包路径与视图目录之间的映射关系，供 `/demo`、`/docs` 等斜杠命令使用。

## 包路径 → 视图目录映射

| 包路径 | 视图目录 |
| ------ | --------- |
| `@vue-start/pro` | `src/views/element/`、`src/views/curd`、`src/views/curd-demo` |
| `@vue-start/element-pro` | `src/views/el/` |
| `@vue-start/antd-pro` | `src/views/el/` |
| `@vue-start/chart` | `src/views/chart/` |
| `@vue-start/config` | `src/views/config/` |
| `@vue-start/css` | `src/views/css/` |
| `@vue-start/hooks` | `src/views/hooks/` |
| `@vue-start/map` | `src/views/map/` |
| `@vue-start/media` | `src/views/preview/` |
| `@vue-start/request` | `src/views/request/` |
| `@vue-start/store` | `src/views/store/` |

## 组件类型识别规则

根据变更文件的路径，识别对应的组件类型：

| 组件路径 | 组件类型 |
| -------- | --------- |
| `src/comp/form/*` | `form` |
| `src/comp/table/*` | `table` |
| `src/comp/layout/*` | `layout` |
| `src/curd/*` | `curd` |

## Demo 目录结构

每个组件类型对应的 demo 目录结构：

```
src/views/{ui}/{component}/
├── README.md        # 组件文档
├── index.tsx       # 入口文件
└── demo/
    ├── basic.tsx        # 基础示例
    ├── field-change.tsx # 字段联动
    ├── readonly.tsx   # 只读模式
    └── ...