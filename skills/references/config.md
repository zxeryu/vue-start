# @vue-start/config 使用指南

`@vue-start/config` 提供运行时配置管理，支持从 meta 标签和 Base64 编码中读取配置。

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

## 配置来源

配置从 HTML 的 meta 标签中读取：

```html
<head>
  <meta name="devkit:app" content="base64编码的配置数据" />
  <meta name="devkit:config" content="base64编码的配置数据" />
</head>
```

## 配置格式

```ts
type TConfig = {
  [key: string]: string;
};

// 实际使用
{
  "apiUrl": "https://api.example.com",
  "env": "production",
  // ...
}
```
