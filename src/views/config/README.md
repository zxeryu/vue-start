# @vue-start/config

> 环境变量

- 通过 html meta 标签配置
- 兼容 vite、webpack

## 配置

```ts
import { createConfig } from "@vue-start/config";
//创建config对象
const config = createConfig();

//全局注册
app.use(config);
```

## 使用

```ts
import { useConfig, getConfig } from "@vue-start/config";
//setup 中使用
const config = useConfig();

//其他
const config2 = getConfig();
```

## API

### vite 中使用

```shell
yarn add vite-plugin-html-config -D
```

```ts
import { defineConfig, loadEnv } from "vite";
import htmlPlugin from "vite-plugin-html-config";
import { stringify } from "@vue-start/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    //...
    plugins: [
      htmlPlugin({
        metas: [
          {
            name: "devkit:config",
            content: stringify(env),
          },
        ],
      }),
    ],
    //...
  };
});
```
