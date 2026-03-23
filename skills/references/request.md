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

数据获取 Hook，推荐使用。

```ts
import { useFetch } from "@vue-start/request";
import { getData } from "@/clients";

const { data, request, requesting } = useFetch(getData, options);
```

### Options

| 属性 | 说明 | 类型 |
|------|------|------|
| `initEmit` | 初始化时发起请求 | `boolean` |
| `params` | 请求参数 | `object \| () => object` |
| `deps` | 监听对象，变化时重新请求 | `WatchSource[]` |
| `convertData` | 转换响应数据 | `(response) => any` |
| `onSuccess` | 请求成功回调 | `(actor, data) => void` |
| `onFail` | 请求失败回调 | `(actor) => void` |
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

### IRequestActor

```ts
interface IRequestActor<TReq, TRes, TErr> {
  name: string;
  requestFromReq?: (req: TReq) => AxiosRequestConfig;
  requestConfig?: AxiosRequestConfig;
  req?: TReq;
  res?: AxiosResponse<TRes>;
  err?: TErr;
  stage?: "DONE" | "FAILED" | "CANCEL";
  id?: string;
}
```

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
