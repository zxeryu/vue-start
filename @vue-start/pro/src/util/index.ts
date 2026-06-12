import { Ref, Slot } from "vue";
import { filter, forEach, keys, pick, reduce, size, startsWith, mapKeys, get } from "lodash";
import { TColumn } from "../types";

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
 * 从TColumn中查找标记值
 * @param item
 * @param signName
 */
export const getSignValue = <T = any>(item: TColumn, signName: string): T => {
  return get(item, ["extra", signName]) || get(item, signName);
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
  const prefixStr = `${prefix}-`;
  const targetKeys = filter(slotKeys, (key) => startsWith(key, prefixStr));
  const targetSlots = pick(slots, targetKeys);
  return mapKeys(targetSlots, (_, key) => {
    return key.replace(prefixStr, "");
  });
};

/**
 * 优先使用模板插槽，否则使用 props 传入的函数插槽，否则使用 fallback
 * @param templateSlot 模板插槽（如 slots.icon）
 * @param propSlot     props 传入的插槽函数（如 props.slots?.icon）
 * @param fallback     默认内容（可以是 VNode、字符串或返回 VNode 的函数）
 * @param args         传递给插槽函数的参数
 * @returns            插槽函数调用的结果，或 fallback 的结果/值
 */
export const resolveSlot = (
  templateSlot: Slot | undefined,
  propSlot: ((...args: any[]) => any) | undefined,
  fallback: any = null,
  ...args: unknown[]
): any => {
  if (typeof templateSlot === 'function') {
    return templateSlot(...args)
  }
  if (typeof propSlot === 'function') {
    return propSlot(...args)
  }
  return typeof fallback === 'function' ? fallback(...args) : fallback
}