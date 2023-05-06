# @vue-start/store

> 基于 rxjs vue3-hooks 实现的状态管理库

## 配置

```ts
import { Persist } from "@bridge-start/persist";
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

## 使用

> 与全局使用 reactive 相比，支持 localStorage 同步

> 建议：全局状态的声明都放在 src/store/StoreCurrent 文件中

```ts
import { createStateUse } from "@vue-start/store";

// api
createStateUse(
  //存储key
  key,
  //存储对象 object
  value,
  //类型Boolean，是否同步到localStorage中
  persist,
);

// eg：声明一个本地配置的全局状态
export const useLocalConfig = createStateUse(
  "local-config",
  {
    light: true,
    delay: 1000,
    ...extra,
  },
  true,
);
```

## API

