import { BooleanObjType, BooleanRulesObjType } from "../types";
import {
  filter,
  get,
  isArray,
  isEmpty,
  isFunction,
  isObject,
  isString,
  keys,
  map,
  mergeWith,
  omit,
  split,
} from "lodash";

/**
 * 剔除showState或showStateRules规则为!true的值
 * @param values
 * @param showState
 * @param showStateRules
 */
export const getValidValues = (
  values: Record<string, any>,
  showState?: BooleanObjType,
  showStateRules?: BooleanRulesObjType,
): Record<string, any> => {
  if (showState) {
    const invalidKeys = filter(keys(showState), (key) => !showState[key]);
    return omit(values, invalidKeys);
  }
  if (showStateRules) {
    const invalidKeys = filter(keys(showStateRules), (key) => !showStateRules[key](values));
    return omit(values, invalidKeys);
  }
  return values;
};

/**
 * string类型的path转为arr
 * @param path
 */
export const convertPathToList = (
  path: undefined | string | number | (string | number)[],
): undefined | (string | number)[] => {
  if (!path) {
    return undefined;
  }
  if (isArray(path)) {
    return path;
  }
  if (path && isString(path) && path.indexOf(".") > 0) {
    return split(path, ".");
  }
  return [path];
};

/**
 * 将listState 中的数据通过id merge到 list item中
 * ps：数组会替换
 * 注意：mergeWith 会改变原始对象
 * @param list
 * @param listState
 * @param id
 */
export const mergeStateToList = (
  list: Record<string, any>[],
  listState: Record<string, any>,
  id: string | number | ((item: Record<string, any>) => string | number),
): Record<string, any>[] => {
  if (!listState || !id) {
    return list;
  }
  return map(list, (item) => {
    const idName = isFunction(id) ? id(item) : id;
    //如果listState中有值，merge处理
    const stateData = get(listState, idName);
    if (!stateData || isEmpty(stateData) || isFunction(stateData) || !isObject(stateData)) {
      return item;
    }
    //只有是对象（键值对）才合并
    return mergeWith(item, stateData, (objValue, srcValue) => {
      //如果是数组，替换
      if (isArray(objValue) || isArray(srcValue)) {
        return srcValue;
      }
    });
  });
};
