# useEffect

- watch onMounted onBeforeUnmount 三个方法组合而成的 api
- onBeforeUnmount 方法中会停止侦听器

```ts
/**
 *
 * @param cb        回调函数，同：watch 的第二个参数
 * @param deps      侦听对象，同：watch 的第一个参数
 * @param options   opts，同：watch的第三个参数
 */
const useEffect: (cb: cbType, deps: any | any[], options?: WatchOptions) => void;
```

- 当 deps 为空([] 或 undefined) 时，相当于 onMounted 与 onBeforeUnmount 的组合

```ts
useEffect(() => {
  //组件初始化，相当于onMounted
  return () => {
    //组件卸载，相当于onBeforeUnmount
  };
}, []);
```

demo：常见订阅为例

```ts
//使用useEffect实现
useEffect(
  () => {
    const handleStatusChange = (status) => {};

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  },
  () => props.friend.id,
);
```

```ts
//使用watch onMounted onBeforeUnmount组合实现
const handleStatusChange = (status) => {};

onMounted(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
});

onBeforeUnmount(() => {
  ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
});

watch(
  () => props.friend.id,
  () => {
    //id变动时候，先unsubscribe，
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    // 再次subscribe
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  },
);
```
