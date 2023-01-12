import { onBeforeUnmount, watch } from "vue";
import { WatchOptions } from "@vue/runtime-core";

type cbType = (...args: any) => void;

export const useWatch = (cb: cbType, deps: any | any[], options?: WatchOptions) => {
  const stopHandler = watch(deps, cb, options);

  onBeforeUnmount(() => {
    stopHandler && stopHandler();
  });
};
