# @vue-start/config 使用指南

`@vue-start/config` 提供运行时配置管理，支持从 meta 标签和 Base64 编码中读取配置，并支持全局配置初始化。

## 安装

```bash
pnpm add @vue-start/config js-base64
```

## 核心 API

### 获取配置

```ts
import { getConfig } from '@vue-start/config';

const config = getConfig();
// { key: value, ... }
```

### 创建配置 Provider

```ts
import { createConfig } from '@vue-start/config';
import { createApp } from 'vue';

const app = createApp(App);
app.use(createConfig());
```

### 使用配置

```ts
import { useConfig } from '@vue-start/config';
import { inject } from 'vue';

const config = useConfig();
console.log(config.apiUrl);
```

### 全局配置初始化

支持预先设置全局配置，`getConfig` 和 `createConfig` 会优先使用该配置：

```ts
import { init, createConfig, useConfig, getConfig } from '@vue-start/config';

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

### init

初始化全局配置，通常在项目入口处调用，传入解密后的配置：

```ts
init(config: TConfig): void
```

## 配置来源

配置从 HTML 的 meta 标签中读取，支持 Base64 编码：

```html
<!-- index.html -->
<head>
  <meta name="devkit:app" content="eyJhcGlVcmwiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSJ9" />
  <meta name="devkit:config" content="eyJlbnYiOiJwcm9kdWN0aW9uIn0=" />
</head>
```

以上内容解码后为：
```json
// devkit:app → { "apiUrl": "https://api.example.com" }
// devkit:config → { "env": "production" }
```

## 配置格式

```ts
type TConfig = {
  [key: string]: string;
};

// 实际使用
const config = getConfig();
// { apiUrl: "https://api.example.com", env: "production", ... }
```

## API 关系说明

### `init()` vs `createConfig()`

| 方法 | 用途 | 调用时机 |
|------|------|---------|
| `init(config)` | 预先设置全局配置（如解密后的配置），优先级最高 | 项目入口，`createApp` 之前 |
| `createConfig()` | 创建 Vue 插件，从 meta 标签或 `init` 中读取配置 | `app.use()` 时 |
| `getConfig()` | 直接获取配置对象 | 任意时机 |
| `useConfig()` | 在组件中注入配置 | 组件 setup 内 |

**优先级**: `init()` 设置的配置 > meta 标签中的配置

### 典型使用流程

```ts
// 1. 入口文件：解密并初始化配置
import { init } from "@vue-start/config";
import { Base64 } from "js-base64";

const metaConfig = document.querySelector('meta[name="devkit:config"]')?.getAttribute("content");
const decrypted = metaConfig ? JSON.parse(Base64.decode(metaConfig)) : {};
init(decrypted);

// 2. 创建应用并使用配置插件
const app = createApp(App);
app.use(createConfig());
app.mount("#app");

// 3. 组件中使用
import { useConfig } from "@vue-start/config";
const config = useConfig();
console.log(config.apiUrl); // "https://api.example.com"
```
