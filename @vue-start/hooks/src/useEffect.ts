import { watch, onMounted, onBeforeUnmount, isRef, isReactive, toRaw } from "vue";
import { isArray, map, isFunction, isUndefined, filter } from "lodash";
import { WatchOptions } from "@vue/runtime-core";

type cbType = ((...args: any) => void) | ((...args: any) => () => void);
/**
 *
 * @param cb        回调函数，同：watch 的第二个参数
 * @param deps      侦听对象，同：watch 的第一个参数
 * @param options   opts，同：watch的第三个参数
 */
export default function useEffect(cb: cbType, deps: any | any[], options?: WatchOptions): void {
  let stopFn: (() => void) | undefined = undefined;
  const stop = () => {
    stopFn && stopFn();
    stopFn = undefined;
  };

  let stopHandler: () => void | undefined;
  if (!isUndefined(deps)) {
    let validDeps = deps;
    if (isArray(deps)) {
      validDeps = filter(deps, (item) => {
        if (isFunction(item)) {
          return true;
        }
        if (isReactive(item) || isRef(item)) {
          return true;
        }
        return false;
      });
    }
    stopHandler = watch(
      validDeps,
      (...v) => {
        stop();
        stopFn = cb(...v) as any;
      },
      options,
    );
  }

  onMounted(() => {
    const depList = isArray(deps) ? deps : [deps];
    const initValues = map(depList, (dep) => {
      if (isFunction(dep)) {
        return dep();
      }
      if (isRef(dep)) {
        return dep.value;
      }
      if (isReactive(dep)) {
        return toRaw(dep);
      }
      return dep;
    });
    stopFn = cb(isArray(deps) ? initValues : initValues[0]) as any;
  });

  onBeforeUnmount(() => {
    stopHandler && stopHandler();
    stop();
  });
}
