# @vue-start/persist 使用指南

`@vue-start/persist` 提供数据持久化功能，基于 LocalForage 实现，支持多种存储驱动。

## 安装

```bash
pnpm add @vue-start/persist localforage
```

## 核心 API

配合@vue-start/store 使用

```ts
import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = async () => {
  //读取存储
  const persist = new Persist({ name: "pro" });
  const values = await persist.loadPersistData();
  const store$ = createStoreOrigin(values!);
  //同步存储
  persist.persistRx(store$);
  return store$;
};
```
