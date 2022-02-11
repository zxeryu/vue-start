import { watch, onMounted, onBeforeUnmount, isRef, isReactive, toRaw } from "vue";
import { isArray, map, isFunction, isUndefined, filter } from "lodash";

type cbType = ((...args: any) => void) | ((...args: any) => () => void);

export default function useEffect(cb: cbType, deps: any | any[]): void {
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
    stopHandler = watch(validDeps, (...v) => {
      stop();
      stopFn = cb(...v) as any;
    });
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
