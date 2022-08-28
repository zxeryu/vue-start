import { Ref } from "vue";
import { reduce } from "lodash";

export * from "./tree";
export * from "./state";

/**
 * 唯一id
 */
export const generateId = (): string => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

/**
 * ref 传递
 */
export const createExpose = (methods: string[], targetRef: Ref) => {
  return reduce(
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
};
