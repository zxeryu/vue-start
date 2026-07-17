# @vue-start/request 使用指南

`@vue-start/request` 是基于 Axios 和 RxJS 的 HTTP 请求库，支持请求拦截、响应处理、消息订阅等功能。

## 安装

```bash
pnpm add @vue-start/request axios rxjs
```

## 配置

```ts
import { createRequest } from "@vue-start/request";
import { ContentTypeInterceptor } from "@vue-start/request";

// 拦截器
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((config) => {
    config.url = `http://localhost:7070${config.url}`;
    return config;
  });
};

// 创建 request
const request = createRequest(
  options,
  [ContentTypeInterceptor, urlInterceptor]
);

app.use(request);
```

## useFetch

数据获取 Hook，推荐使用。内部通过 `IRequestActor` 管理请求生命周期。

```ts
import { useFetch } from "@vue-start/request";
import { getData } from "@/clients";

const { data, request, requesting } = useFetch(getData, options);
```

### 参数

- `actor`: `IRequestActor` — 请求对象（定义了请求的 URL、方法、参数转换等）
- `options`: `UseFetchOptions` — 行为配置

### Options

| 属性 | 说明 | 类型 |
|------|------|------|
| `initEmit` | 初始化时发起请求 | `boolean` |
| `params` | 请求参数 | `object \| () => object` |
| `deps` | 监听对象，变化时重新请求 | `WatchSource[]` |
| `convertData` | 转换响应数据 | `(response) => any` |
| `onSuccess` | 请求成功回调 | `(actor: IRequestActor, data) => void` |
| `onFail` | 请求失败回调 | `(actor: IRequestActor) => void` |
| `onFinish` | 请求完成回调 | `() => void` |
| `cancelWhileUnmount` | 组件卸载时取消请求 | `boolean` |
| `activeEmit` | keep-alive 下 onActivated 时重新请求 | `boolean` |

### Result

| 属性 | 说明 | 类型 |
|------|------|------|
| `data` | 响应数据（reactive） | `any` |
| `requesting` | 请求状态 | `Ref<boolean>` |
| `request` | 手动发起请求 | `(params?) => void` |

### 示例

```ts
// 初始化请求
const { data, request, requesting } = useFetch(getUser, {
  initEmit: true,
  params: { id: 1 },
});

// 监听依赖变化
const { data, request, requesting } = useFetch(searchList, {
  params: () => ({ keyword }),
  deps: [keyword],
});

// 自定义处理
const { data, request } = useFetch(getData, {
  convertData: (res) => res.data,
  onSuccess: (actor, data) => {
    console.log("success", data);
  },
  onFail: (actor) => {
    console.log("fail", actor.err);
  },
});
```

## 订阅请求消息

### useRequestProvide

获取请求消息流。

```ts
import { useRequestProvide } from "@vue-start/request";

const { requestSubject$ } = useRequestProvide();
```

### 订阅失败消息

```ts
import { isFailedRequestActor } from "@vue-start/request";
import { filter as rxFilter, tap as rxTap } from "rxjs";

const { requestSubject$ } = useRequestProvide();

requestSubject$
  .pipe(
    rxFilter(isFailedRequestActor),
    rxTap((actor) => {
      console.log("error", actor.err);
      // 统一处理错误，如显示消息提示
    })
  )
  .subscribe();
```

### 订阅成功消息

```ts
import { isDoneRequestActor } from "@vue-start/request";

requestSubject$
  .pipe(
    rxFilter(isDoneRequestActor),
    rxTap((actor) => {
      console.log("success", actor.name);
    })
  )
  .subscribe();
```

### 订阅所有消息

```ts
requestSubject$.pipe(
  rxTap((actor) => {
    console.log("all", actor.stage, actor.name);
  })
).subscribe();
```

## 请求 Actor

`useFetch` 的第一个参数 `actor` 是 `IRequestActor` 类型，它定义了请求的 URL、方法、参数转换等核心信息。

### 创建 Actor

```ts
import { IRequestActor } from "@vue-start/request";

// 方式1：使用 requestConfig 定义静态请求
const getUser: IRequestActor = {
  name: "getUser",
  requestConfig: {
    url: "/api/user",
    method: "GET",
  },
};

// 方式2：使用 requestFromReq 动态生成请求配置
const updateUser: IRequestActor = {
  name: "updateUser",
  requestFromReq: (req) => ({
    url: `/api/user/${req.id}`,
    method: "PUT",
    data: req.body,
  }),
};
```

### IRequestActor

```ts
interface IRequestActor<TReq = any, TRes = any, TErr = any> {
  name: string;                                        // 请求名称（唯一标识）
  requestFromReq?: (req: TReq) => AxiosRequestConfig;  // 动态请求配置
  requestConfig?: AxiosRequestConfig;                   // 静态请求配置
  req?: TReq;                                          // 请求参数（运行时填充）
  res?: AxiosResponse<TRes>;                           // 请求响应（运行时填充）
  err?: TErr;                                          // 请求错误（运行时填充）
  stage?: "DONE" | "FAILED" | "CANCEL";               // 请求阶段（运行时填充）
  id?: string;                                         // 请求 ID（运行时填充）
}
```

### 与 useFetch 的关系

`useFetch` 内部将 `IRequestActor` 作为请求单元，管理其生命周期：
- 调用 `request()` 时，根据 `actor.requestFromReq` 或 `actor.requestConfig` 生成 Axios 配置
- 请求成功/失败后更新 `actor.res` / `actor.err` 和 `actor.stage`
- `onSuccess` / `onFail` 回调接收完整的 `actor` 对象

### 状态判断

```ts
import { isPreRequestActor, isDoneRequestActor, isFailedRequestActor, isCancelRequestActor } from "@vue-start/request";
```

## 与 @vue-start/pro 集成

使用 pro 中的高阶方法：

```ts
import { useDoneRequestActor } from "@vue-start/pro";

useDoneRequestActor([getData], (actor) => {
  if (actor.name === getData.name) {
    // getData 请求成功
  }
});
```

## V1 API（不推荐）

### useRequest

```ts
import { useRequest, useObservableRef } from "@vue-start/request";

const [request, requesting$] = useRequest(getData, {
  onSuccess: (actor) => {
    console.log(actor.res?.data);
  },
  onFail: (actor) => {
    console.log(actor.err);
  },
});

const requesting = useObservableRef(requesting$);

// 发起请求
request({ id: 1 });
```

### useDirectRequest

自动请求，返回数据状态。

```ts
import { useDirectRequest } from "@vue-start/request";

const [data, request, requesting$] = useDirectRequest(
  getData,
  { id: 1 },           // 请求参数
  [dep1, dep2]          // 依赖变化时重新请求
);

// 重新请求
request();
request({ id: 2 });
```
