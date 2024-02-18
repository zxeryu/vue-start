# @vue-start/css

vue3 基于 emotion 的 css-in-js 方案

## API

### Global 组件

| 名称     | 说明                      | 类型      | 默认值 |
| -------- | ------------------------- | --------- | ------ |
| `styles` | @emotion/css css 方法参数 | `object ` | --     |

## normalize.css

```ts
import "@vue-start/css/dist/normalize.css";
```

### 原子css

### css-in-js

#### 直接使用 emotion api

```tsx
import { css } from "@emotion/css";

const Comp = () => {
  return (
    <div
      class={css({
        color: "pink",
      })}>
      内容
    </div>
  );
};
```

#### 使用 css 属性

1、开启 css 转换 plugin

vite.config.js

```ts
import { defineConfig } from "vite";
import { cssToCls } from "@vue-start-dev/devkit";

export default defineConfig({
  ...,
  plugins:[
    //放在jsx plugin之前
    cssToCls()
  ],
  ...,
})

```

2、在 jsx 中使用

```tsx
import { css } from "@emotion/css";

const Comp = () => {
  return (
    <div
      css={{
        color: "pink",
      }}>
      内容
    </div>
  );
};
```
