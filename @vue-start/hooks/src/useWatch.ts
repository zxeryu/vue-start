import { onBeforeUnmount, watch } from "vue";

type cbType = (...args: any) => void;

export const useWatch = (cb: cbType, deps: any | any[]) => {
  const stopHandler = watch(deps, cb);

  onBeforeUnmount(() => {
    stopHandler && stopHandler();
  });
};
