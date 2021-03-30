import { watch, onBeforeUnmount } from "vue";

const useWatch = (source: any, cb: any, options: any) => {
  const stop = watch(source, cb, options);

  onBeforeUnmount(() => {
    stop();
  });
};
export default useWatch;
