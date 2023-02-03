# @vue-start/request

> 基于 axios rxjs 的网络请求库

## 配置

```ts
//拦截器-url补全
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((requestConfig) => {
    requestConfig.url = `http://localhost:7070${requestConfig.url}`;
    return requestConfig;
  });
};

//创建request对象
const request = createRequest(
  // axios 配置
  options,
  // 拦截器
  [ContentTypeInterceptor, urlInterceptor],
);

//全局注册
app.use(request);
```

## useRequest$

```ts
import { useRequest$ } from "@vue-start/request";
import { getData } from "@/clients";
import { reactive } from "vue";

const state = reactive({
  data: null,
});

/**
 *  request：请求方法
 *  requestingRef：请求状态 Ref<Boolean>
 **/
const [request, requestingRef] = useRequest$(getData, {
  //请求成功回调
  onSuccess: (actor) => {
    //axios请求回来的数据
    state.data = actor.res?.data;
  },
  //请求失败回调
  onFail: (actor) => {},
  //请求完成回调
  onFinish: () => {},
});

//发起请求
request({ ...params });

//loading状态
const loading = requestingRef.value;
```

## useDirectRequest$

```ts
import { useDirectRequest$ } from "@vue-start/request";
import { getData } from "@/clients";

/**
 *  data：   请求回来的数据对象 reactive
 *  request：请求方法
 *  requestingRef：请求状态 Ref<Boolean>
 **/
const [data, request, requestingRef] = useDirectRequest$(
  //接口
  getData,
  //请求参数 object || ()=>object
  { ...params } || (() => ({ ...params })),
  //收侦听的hook对象，hook改变->触发请求
  deps,
);

//重新发起请求
//方法一：调用request方法
request({ ...params });
//方法二：修改deps

//loading状态
const loading = requestingRef.value;
```

## 订阅请求消息

eg：订阅全局错误消息

```ts
import { isFailedRequestActor, useRequestProvide } from "@vue-start/request";
import { useEffect } from "@vue-start/hooks";
import { filter as rxFilter, tap as rxTap } from "rxjs";

const { requestSubject$ } = useRequestProvide();

useEffect(() => {
  //订阅
  const sub = requestSubject$
    .pipe(
      rxFilter(isFailedRequestActor),
      rxTap((actor) => {
        console.log("error=", actor);
      }),
    )
    .subscribe();
  return () => {
    //取消订阅
    sub.unsubscribe();
  };
}, []);
```

> 使用 @vue-start/pro 中的高阶方法

eg: 监听指定的接口请求成功状态

```ts
import { useDoneRequestActor } from "@vue-start/pro";
import { getData } from "@/clients";

useDoneRequestActor([getData, ...extra], (actor) => {
  if (actor.name === getData.name) {
    //getData请求成功回调
  }
});
```
