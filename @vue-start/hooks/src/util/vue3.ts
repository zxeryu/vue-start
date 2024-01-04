import { Ref, unref, ComponentPublicInstance, onMounted, onActivated } from "vue";
import { debounce, forEach, isFunction, size } from "lodash";

export const createExposeObj = (targetRef: Ref, methods?: string[], opts?: Record<string, any>) => {
  const exposeObj: Record<string, any> = { originRef: targetRef, ...opts };
  if (methods && size(methods) > 0) {
    forEach(methods, (method) => {
      exposeObj[method] = (...params: any[]) => {
        return targetRef.value?.[method]?.(...params);
      };
    });
  }
  return exposeObj;
};

export const toValue = <T>(r: T | Ref<T> | (() => T)) => {
  return isFunction(r) ? r() : unref(r);
};

export type MaybeElement = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null;

export const unrefElement = <T extends MaybeElement>(elRef: T | Ref<T> | (() => T)) => {
  const plain = toValue(elRef);
  return (plain as ComponentPublicInstance)?.$el ?? plain;
};

export const useSafeActivated = (cb: () => void) => {
  let isInit = false;

  const resetFlag = debounce(() => {
    isInit = false;
  }, 500);

  onMounted(() => {
    isInit = true;
    resetFlag();
  });

  onActivated(() => {
    //如果执行了onMounted，不响应
    if (isInit) return;

    cb();
  });
};
