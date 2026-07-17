# @vue-start/store 使用指南

`@vue-start/store` 是基于 RxJS 和 Vue3 Hooks 实现的状态管理库，支持 localStorage 持久化。

## 安装

```bash
pnpm add @vue-start/store rxjs
```

## 创建 Store

```ts
import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = async () => {
  const persist = new Persist({ name: "pro" });
  const values = await persist.loadPersistData();
  const store$ = createStoreOrigin(values!);
  persist.persistRx(store$);
  return store$;
};

const store$ = await createStore();
app.use(store$);
```

## 创建状态

### createStateUse

创建全局状态，支持 localStorage 持久化。

```ts
import { createStateUse } from "@vue-start/store";

// 声明全局状态
const useLocalConfig = createStateUse<T>(
  key: string,        // 存储 key
  initialValue: T,    // 初始值
  persist?: boolean,  // 是否持久化
): () => [Ref<T>, (value: T) => void];

// 组件中使用
export const useLocalConfig = createStateUse("local-config", { light: true }, true);
const [config, setConfig] = useLocalConfig();
```

**返回值**: `createStateUse` 返回一个 hook 函数，调用该 hook 返回 `[state, setState]` 元组。

### useStoreState$

手动创建状态。

```ts
import { useStoreState$ } from "@vue-start/store";

const [state, update] = useStoreState$<T>(
  key: string,
  initialValue: T,
  persist?: boolean
): [Ref<T>, (value: T) => void];
```

### useDispatchStore

手动派发更新。

```ts
import { useDispatchStore } from "@vue-start/store";

const dispatch = useDispatchStore(): (key: string, value: any, persist?: boolean) => void;
```

### useObservable

将 Observable 转为响应式状态。

```ts
import { useObservable } from "@vue-start/store";

const state = useObservable<T>(ob$: Observable<T>, defaultValue?: T): Ref<T>;
```

### useSelector

选择器，获取派生状态。

```ts
import { useSelector } from "@vue-start/store";

const count = useSelector<T, R>(store$: Observable<T>, selector: (state: T) => R): Ref<R>;
```

### useStoreSelector

从 store 中选择状态。

```ts
import { useStoreSelector } from "@vue-start/store";

const count = useStoreSelector<T>((state: T) => state.count): Ref<T[keyof T]>;
```

## 与 @vue-start/pro 集成

建议将全局状态声明放在 `src/store/StoreCurrent` 文件中。

```ts
import { createStateUse } from "@vue-start/store";

export const useUserInfo = createStateUse("user-info", {}, true);
export const useTheme = createStateUse("theme", { dark: false }, true);
```
