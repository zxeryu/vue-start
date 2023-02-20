# hooks 相关

## useWatch

- watch 与 onBeforeUnmount 两个方法组合而成
- onBeforeUnmount 方法中会停止侦听器

```ts
/**
 *
 * @param cb        回调函数，同：watch 的第二个参数
 * @param deps      侦听对象，同：watch 的第一个参数
 * @param options   opts，同：watch的第三个参数
 */
const useWatch: (cb: cbType, deps: any | any[], options?: WatchOptions) => void;
```

## setReactiveValue

```ts
/**
 *快速为reactive对象赋值
 * 在obj对象为参数传递 或 接口请求回的数据， 推荐使用！
 * @param r     reactive对象
 * @param obj   赋值内容对象
 */
```

demo：

```ts
const state = reactive({});
//原始方法
state.prop1 = "prop1";
state.prop2 = "prop2";
...

//使用setReactiveValue
setReactiveValue({
  prop1: "prop1",
  prop2: "prop2",
  ...extra,
});
```

## useUpdateKey

生成唯一 key，同时提供刷新 key 方法。推荐刷新图表、组件时使用。

```ts
const useUpdateKey: () => [key: Ref, updateKey: () => void];
```

## useResizeObserver

对 ResizeObserver 的封装；domRef 指定的 dom 对象修改的时候触发 callback

```ts
const useResizeObserver: (
  domRef: Ref<Element | undefined>,
  callback: ResizeObserverCallback,
  opts?: ResizeObserverOptions,
) => void;
```
