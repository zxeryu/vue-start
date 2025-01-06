import { every, isArray, isEqual, sortBy, map } from "lodash";
/**
 * 唯一id
 */
export const generateId = (): string => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

/****************************** json转换 *************************/

export const strToJson = (v: string): any => {
  if (!v) return undefined;
  let obj: any;
  try {
    obj = JSON.parse(v);
  } catch (e) {
    console.error(e);
  }
  return obj;
};

export const jsonToStr = (obj: Object): string => {
  if (!obj) return "";
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return "";
  }
};

/****************************** rules逻辑 *************************/

export type TRule = (target: Record<string, any>) => boolean;
export type TRules = TRule | TRule[];
//转换
export type TConvert = (...params: any[]) => any;

/**
 * 当前target对象 是否满足 rules 规则集
 * @param target
 * @param rules
 */
export const isValidInRules = (target: Record<string, any>, rules: TRule | TRules) => {
  //无规则，返回true
  if (!rules) return true;
  //数组
  if (isArray(rules)) {
    return every(rules, (rule) => {
      //不存在rule函数，默认true
      if (!rule) return true;
      return rule(target);
    });
  }
  return rules(target);
};

/****************************** 判断两个对象是否相等 *************************/
/**
 *
 * @param num1
 * @param num2
 */
export const isSameNum = (num1: number | string | null | undefined, num2: number | string | null | undefined) => {
  //严格判断
  if (num1 === num2) {
    return true;
  }
  //0 特殊处理
  if (num1 === 0 || num2 === 0) {
    return num1?.toString() === num2?.toString();
  }
  // "" null undefined 视为相等
  if (!!num1 === !!num2 && !!num1 === false) {
    return true;
  }
  //如果有字符串
  if (typeof num1 === "string" || typeof num2 === "string") {
    return num1?.toString() === num2?.toString();
  }
  return num1 === num2;
};

/**
 *
 * @param a
 * @param b
 * @param opts 数组间比较，
 * {
 *   sort,  是否需要排序
 *   idFn,  数组元素是对象的时候，idFn传入的话就是对比 idFn返回的值产生的新数组
 * }
 */
export const isSame = (
  a: any,
  b: any,
  opts?: {
    sort?: boolean;
    idFn?: (item: any) => string | number;
  },
) => {
  if (a === b) {
    return true;
  }
  if (typeof a === "number" || typeof b === "number") {
    return isSameNum(a, b);
  }
  // "" null undefined 视为相等
  if (!!a === !!b && !!a === false) {
    return true;
  }

  //如果是数组，排序后处理
  if (isArray(a) && isArray(b) && opts?.sort) {
    const na = opts?.idFn ? map(a, (item) => opts.idFn!(item)) : a;
    const nb = opts?.idFn ? map(b, (item) => opts.idFn!(item)) : b;
    return isEqual(sortBy(na), sortBy(nb));
  }

  return isEqual(a, b);
};
