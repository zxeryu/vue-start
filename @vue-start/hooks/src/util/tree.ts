import { find, findIndex, forEach, get, isFunction, size } from "lodash";
import { FieldNames, TOption } from "../../../pro";
import { getFieldNames } from "./options";

type TData = Record<string, any>;

/**
 * 根据value从treeData中找到对象
 * @param data
 * @param value
 * @param fieldNames
 * @param cb 对象：同步   方法：回调，可以理解为异步
 */
export const findTargetInTree = (
  data: TData[],
  value: TOption["value"],
  fieldNames: FieldNames,
  cb: ((index: number, target: TData, list: TData[]) => void) | { target?: TData; index?: number; list?: TData[] },
) => {
  const { valueName, childrenName } = getFieldNames(fieldNames);
  const index = findIndex(data, (item) => get(item, valueName) === value);
  if (index > -1) {
    if (isFunction(cb)) {
      cb(index, data[index], data);
    } else {
      cb.index = index;
      cb.target = data[index];
      cb.list = data;
    }
    return;
  }
  forEach(data, (item) => {
    const children = get(item, childrenName);
    if (size(children) > 0) {
      findTargetInTree(children, value, fieldNames, cb);
    }
  });
};

/**
 * 根据value从treeData中找出对象及父列表
 * @param data
 * @param value
 * @param fieldNames
 * @param cb
 * @param parent
 */
export const findTargetListInTree = (
  data: TData[],
  value: TOption["value"],
  fieldNames: FieldNames,
  cb: ((list?: TData[]) => void) | { list?: TData[] },
  parent: TData[] = [],
) => {
  const { valueName, childrenName } = getFieldNames(fieldNames);
  const target = find(data, (item) => get(item, valueName) === value);
  if (target) {
    if (isFunction(cb)) {
      cb([...parent, target]);
    } else {
      cb.list = [...parent, target];
    }
    return;
  }
  forEach(data, (item) => {
    const children = get(item, childrenName);
    if (size(children) > 0) {
      findTargetListInTree(children, value, fieldNames, cb, [...parent, item]);
    }
  });
};
