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

// clsList: CSS 类名列表
// clsObj: { '.flex': { display: 'flex' }, ... }
```

### Global

全局样式组件。

```ts
import { Global } from '@vue-start/css';

<Global styles={`
  body {
    margin: 0;
    padding: 0;
  }
`} />
```

## 支持的 CSS 属性

### Display

```css
.flex, .inline-flex, .grid, .inline-block, .hidden, ...
```

### Flex

```css
.flex-row, .flex-col, .flex-wrap, .flex-1, .flex-auto, .flex-none
.items-start, .items-center, .items-end
.justify-start, .justify-center, .justify-between
.flex-grow, .flex-shrink
```

### Grid

```css
.grid-flow-row, .grid-flow-col, .grid-flow-row-dense
.auto-cols-fr, .auto-rows-fr
```

### Typography

```css
.text-left, .text-center, .text-right
.underline, .line-through, .no-underline
.uppercase, .lowercase, .capitalize
.whitespace-nowrap, .whitespace-pre
```

### Background

```css
.bg-fixed, .bg-scroll
.bg-repeat, .bg-no-repeat
.bg-cover, .bg-contain
```

### Shadow

```css
.shadow-sm, .shadow, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl
.shadow-inner
```

### Cursor

```css
.cursor-pointer, .cursor-wait, .cursor-text, .cursor-move
.cursor-not-allowed, .cursor-grab, .cursor-zoom-in
```

### 其他

```css
.box-border, .box-content
.overflow-auto, .overflow-hidden
.relative, .absolute, .fixed, .sticky
.invisible, .visible
.resize, .resize-y, .resize-x
```
