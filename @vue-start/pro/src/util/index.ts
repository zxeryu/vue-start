import { Ref } from "vue";
import { forEach, reduce, size } from "lodash";

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
