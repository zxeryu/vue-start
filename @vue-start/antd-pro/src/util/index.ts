import { filter, isArray, isString, keys, omit, split } from "lodash";
import { BooleanObjType, BooleanRulesObjType } from "../../types";

export * from "./format";
export * from "./tree";

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
