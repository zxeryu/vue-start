import { isValidInRules, TConvert, TRules } from "./base";
import {
  assign,
  find,
  findIndex,
  forEach,
  get,
  isArray,
  isEmpty,
  isFunction,
  isObject,
  map,
  mergeWith,
  omit,
  reduce,
  size,
} from "lodash";
import { FieldNames, TOption } from "@vue-start/pro";
import { getFieldNames } from "./options";

type TData = Record<string, any>;

/************************************** list *******************************************/

/**
 * list数据转化为Map对象
 * @param data
 * @param convert
 * @param fieldNames
 */
export const listToMap = (
  data: TData[],
  convert: TConvert,
  fieldNames: { value: string } | undefined = { value: "value" },
) => {
  return reduce(
    data,
    (pair, item) => {
      return { ...pair, [get(item, fieldNames?.value)]: convert(item) };
    },
    {},
  );
};

/************************************** tree *******************************************/
/**
 * @deprecated 使用 findTreeItem 代替
 *
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
 * @deprecated 使用 findTreeItem 代替
 *
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

type TFindTarget = {
  index?: number;
  target?: TData;
  list?: TData[]; //目标所在的list
  parentList?: TData[];
};

/**
 * 根据规则从tree数据中查找目标
 * @param data
 * @param rules
 * @param fieldNames
 * @param targetObj
 * @param parent
 */
const findTreeItemRecursion = (
  data: TData[],
  rules: TRules,
  fieldNames: { children: string } | undefined = { children: "children" },
  targetObj: TFindTarget,
  parent?: TData[],
) => {
  if (targetObj.target) return;

  forEach(data, (item, index) => {
    //forEach的弊端，用for更合适
    if (targetObj.target) return;
    //匹配到对应的数据
    if (isValidInRules(item, rules)) {
      targetObj.index = index;
      targetObj.target = item;
      targetObj.list = data;
      targetObj.parentList = parent ? [...parent, item] : undefined;
      return;
    }

    const children = get(item, fieldNames?.children);
    if (children && size(children) > 0) {
      const parentList = parent ? [...parent, item] : undefined;
      findTreeItemRecursion(children, rules, fieldNames, targetObj, parentList);
    }
  });
};

/**
 * 根据规则从tree数据中查找目标
 * @param data
 * @param rules
 * @param fieldNames
 * @param parent
 */
export const findTreeItem = (
  data: TData[],
  rules: TRules,
  fieldNames: { children: string } | undefined = { children: "children" },
  parent?: TData[],
): TFindTarget => {
  const obj: TFindTarget = {};
  findTreeItemRecursion(data, rules, fieldNames, obj, parent);
  return obj;
};

/**
 * tree数据转化为Map对象
 * @param data
 * @param convert
 * @param fieldNames
 * @param mapObj
 * @param onlyLeaf 只需要子节点数据
 */
const treeToMapRecursion = (
  data: TData[],
  convert: TConvert,
  fieldNames: { children: string; value: string } | undefined = { children: "children", value: "value" },
  mapObj: Record<string, any>,
  onlyLeaf?: boolean,
) => {
  forEach(data, (item) => {
    const children = get(item, fieldNames?.children);
    let isAdd = true;
    if (children && size(children) > 0 && onlyLeaf) {
      //只需要添加子节点，设置为false
      isAdd = false;
    }
    if (isAdd) {
      mapObj[get(item, fieldNames?.value)] = convert(item);
    }
    if (children && size(children) > 0) {
      treeToMapRecursion(children, convert, fieldNames, mapObj);
    }
  });
};

/**
 * tree数据转化为Map对象
 * @param data
 * @param convert
 * @param fieldNames
 * @param onlyLeaf 只需要子节点数据
 */
export const treeToMap = (
  data: TData[],
  convert: TConvert,
  fieldNames: { children: string; value: string } | undefined = { children: "children", value: "value" },
  onlyLeaf?: boolean,
): Record<string, any> => {
  const mapObj = {};
  treeToMapRecursion(data, convert, fieldNames, mapObj, onlyLeaf);
  return mapObj;
};

/**
 * tree数据转换
 * @param data
 * @param convert
 * @param fieldNames
 */
export const convertTreeData = (
  data: TData[],
  convert: TConvert,
  //children：data数据中子集属性名；childrenName：转换后数据的子集属性名
  fieldNames: { children: string; childrenName: string } | undefined = {
    children: "children",
    childrenName: "children",
  },
): TData[] => {
  return map(data, (item) => {
    const childrenKey = fieldNames.children;
    return {
      ...convert(omit(item, childrenKey)),
      [fieldNames.childrenName]: convertTreeData(get(item, childrenKey), convert, fieldNames),
    };
  });
};

/************************************** common *******************************************/

/**
 * 将state（补充Map）数据 merge 到 data 中
 * @param data list 或者 tree
 * @param state
 * @param value
 * @param fieldNames
 */
export const mergeStateToData = (
  data: TData,
  state: Record<string, any>,
  value: string | ((item: TData) => string),
  fieldNames?: { children: "children" },
) => {
  if (!data || !value) return data;

  return map(data, (item) => {
    const id = isFunction(value) ? value(item) : item[value];
    const stateData = get(state, id);

    if (!stateData || isEmpty(stateData) || isFunction(stateData) || !isObject(stateData)) {
      return item;
    }
    const reItem = fieldNames?.children ? omit(item, fieldNames.children) : { ...item };
    const reStateData = fieldNames?.children ? omit(stateData, fieldNames.children) : stateData;

    const nextItem = mergeWith(reItem, reStateData, (objValue, srcValue) => {
      if (isArray(objValue) || isArray(srcValue)) {
        return srcValue;
      }
    });
    if (fieldNames?.children && item[fieldNames.children]) {
      nextItem[fieldNames.children] = mergeStateToData(item[fieldNames.children], state, value, fieldNames);
    }

    return nextItem;
  });
};

/**
 * 将state（补充Map）数据 assign 到 data 中
 * @param data
 * @param state
 * @param value
 * @param fieldNames
 */
export const assignStateToData = (
  data: TData,
  state: Record<string, any>,
  value: string | ((item: TData) => string),
  fieldNames?: { children: "children" },
) => {
  if (!data || !value) return data;

  return map(data, (item) => {
    const id = isFunction(value) ? value(item) : item[value];
    const stateData = get(state, id);

    if (!stateData || isEmpty(stateData) || isFunction(stateData) || !isObject(stateData)) {
      return item;
    }

    const reItem = fieldNames?.children ? omit(item, fieldNames.children) : { ...item };
    const reStateData = fieldNames?.children ? omit(stateData, fieldNames.children) : stateData;

    const nextItem = assign(reItem, reStateData);
    if (fieldNames?.children && item[fieldNames.children]) {
      nextItem[fieldNames.children] = assignStateToData(item[fieldNames.children], state, value, fieldNames);
    }

    return nextItem;
  });
};
