# @vue-start/css 使用指南

`@vue-start/css` 提供原子化 CSS 类名生成和全局样式管理。

## 安装

```bash
pnpm add @vue-start/css @emotion/css
```

## 核心 API

### createAtom

生成原子化 CSS 类名集合。

```ts
import { createAtom } from '@vue-start/css';

const { clsList, clsObj } = createAtom();
// clsList: CSS 类名字符串列表（注入到页面 style 标签）
// clsObj: { '.flex': { display: 'flex' }, '.flex-col': { flexDirection: 'column' }, ... }
```

### 在组件中使用

```tsx
import { defineComponent } from "vue";
import { createAtom } from "@vue-start/css";

const { clsList } = createAtom();

export default defineComponent({
  setup() {
    return () => (
      <div>
        {/* 注入原子样式 */}
        <style>{clsList}</style>
        {/* 使用原子类 */}
        <div class="flex items-center justify-between">
          <span class="text-left">左侧</span>
          <span class="cursor-pointer">点击</span>
        </div>
      </div>
    );
  },
});
```

### Global

全局样式组件。

```tsx
import { Global } from '@vue-start/css';

<Global styles={`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
`} />
```

## 支持的 CSS 原子类

### Display

```
flex, inline-flex, grid, inline-block, hidden, block, inline, table, table-cell, contents, list-item
```

### Flex

```
flex-row, flex-col, flex-wrap, flex-nowrap, flex-1, flex-auto, flex-none
items-start, items-center, items-end, items-stretch, items-baseline
justify-start, justify-center, justify-end, justify-between, justify-around, justify-evenly
flex-grow, flex-shrink
```

### Grid

```
grid-flow-row, grid-flow-col, grid-flow-row-dense
auto-cols-fr, auto-rows-fr
```

### Typography

```
text-left, text-center, text-right, text-justify
underline, line-through, no-underline
uppercase, lowercase, capitalize
whitespace-nowrap, whitespace-pre, whitespace-pre-wrap
truncate
```

### Background

```
bg-fixed, bg-scroll
bg-repeat, bg-no-repeat
bg-cover, bg-contain
```

### Shadow

```
shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl
shadow-inner
```

### Cursor

```
cursor-pointer, cursor-wait, cursor-text, cursor-move
cursor-not-allowed, cursor-grab, cursor-zoom-in
```

### 布局

```
box-border, box-content
overflow-auto, overflow-hidden, overflow-scroll
relative, absolute, fixed, sticky
invisible, visible
resize, resize-y, resize-x
```