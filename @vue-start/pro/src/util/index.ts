import { Ref } from "vue";
import { filter, forEach, keys, pick, reduce, size, startsWith } from "lodash";

export * from "./state";

/**
 * ref 传递
 */
export const createExpose = (methods: string[], targetRef: Ref) => {
  const exposeObj: Record<string, any> = reduce(
    methods,
    (pair, method) => {
      return {
        ...pair,
        [method]: (...params: any[]) => {
          return targetRef.value?.[method]?.(...params);
        },
      };
    },
    {},
  );
  exposeObj.originRef = targetRef;
  return exposeObj;
};

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

/**
 * 从slots对象中找出`${prefix}`开头的属性组成一个对象
 * {
 *   `${prefix}${slot name}}`: ()=>Function,
 *   ...
 * }
 * @param slots
 * @param prefix
 */
export const filterSlotsByPrefix = (slots: Record<string, any>, prefix: string) => {
  const slotKeys = keys(slots);
  const targetKeys = filter(slotKeys, (key) => startsWith(key, prefix));
  return pick(slots, targetKeys);
};
