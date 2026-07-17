# @vue-start/persist 使用指南

`@vue-start/persist` 提供数据持久化功能，基于 LocalForage 实现，支持多种存储驱动（IndexedDB、WebSQL、localStorage）。

## 安装

```bash
pnpm add @vue-start/persist localforage
```

## 配合 @vue-start/store 使用

### 完整示例

```ts
// src/store/index.ts
import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = async () => {
  // 1. 创建 Persist 实例
  const persist = new Persist({ name: "pro" });

  // 2. 从 LocalForage 加载已持久化的数据
  const values = await persist.loadPersistData();

  // 3. 用持久化数据初始化 store
  const store$ = createStoreOrigin(values!);

  // 4. 订阅 store 变化，自动同步到 LocalForage
  persist.persistRx(store$);

  return store$;
};
```

### 在应用入口使用

```ts
// main.ts
import { createApp } from "vue";
import { createStore } from "@/store";

const app = createApp(App);

// 异步创建 store
const store$ = await createStore();
app.use(store$);

app.mount("#app");
```

## 核心 API

### Persist

```ts
import { Persist } from "@vue-start/persist";

const persist = new Persist(options: {
  name: string;           // 存储名称（LocalForage 实例名）
  driver?: string | string[]; // 存储驱动，默认按优先级尝试 IndexedDB > WebSQL > localStorage
});

// 加载已持久化的数据
const values = await persist.loadPersistData(): Promise<Record<string, any> | undefined>;

// 订阅 store 变化，自动同步到 LocalForage
persist.persistRx(store$: Observable): void;
```

### 配置选项

```ts
const persist = new Persist({
  name: "my-app",
  // 可选：指定存储驱动
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});
```

## 工作原理

1. `loadPersistData()` — 从 LocalForage 读取所有已存储的 key-value 对
2. `createStoreOrigin(values)` — 用读取到的数据初始化 RxJS store
3. `persistRx(store$)` — 订阅 store 的变化流，每当 store 更新时自动写入 LocalForage

## 注意事项

- `createStore` 是异步的，需要 `await` 完成后再挂载应用
- 持久化的数据存储在浏览器本地，清除浏览器数据会丢失
- 不同 `name` 的 Persist 实例对应不同的 LocalForage 存储空间
