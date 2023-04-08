import { every, isArray, keys } from "lodash";
/**
 * 唯一id
 */
export const generateId = (): string => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

/****************************** rules逻辑 *************************/

export type TRule = (target: Record<string, any>) => boolean;
export type TRules = TRule | TRule[];
//转换
export type TConvert = (target: Record<string, any>) => Record<string, any>;

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
