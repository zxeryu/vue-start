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

## 全局配置初始化

可以通过 `init` 方法预先设置全局配置，之后 `getConfig` 和 `createConfig` 会优先使用该配置。

```ts
import { init, createConfig, useConfig, getConfig } from "@vue-start/config";

// 项目入口处初始化（传入解密后的配置）
init({
  API_KEY: "decrypted-api-key",
  SECRET: "decrypted-secret",
});

// 之后的使用方式保持不变
createApp().use(createConfig());
const config = useConfig();
const config2 = getConfig();
```

### API

- `init(config)` - 初始化全局配置

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
