import { forEach, get, isArray, isNumber, isString, join, last, map, omit, reduce, size } from "lodash";
import { FieldNames, TOptions, TreeOptions } from "@vue-start/pro";
import { findTreeItem, findTreeItem2 } from "./collection";

export const getFieldNames = (fieldNames?: FieldNames) => {
  const labelName = fieldNames?.label || "label";
  const valueName = fieldNames?.value || "value";
  const childrenName = fieldNames?.children || "children";
  return { labelName, valueName, childrenName };
};

export const enumToOptions = (enumObj: Record<string, string>, displayEnumObj: (v: string) => string): TOptions => {
  return map(enumObj, (v) => ({ value: v, label: displayEnumObj(v) }));
};

export type TRewriteProps = (item: Record<string, any>) => Record<string, any>;

export const listToOptions = (list: Record<string, any>[], fieldNames?: FieldNames, rewriteProps?: TRewriteProps) => {
  const { labelName, valueName } = getFieldNames(fieldNames);
  return map(list, (item) => ({
    value: get(item, valueName),
    label: get(item, labelName),
    ...(rewriteProps ? rewriteProps(item) : undefined),
  }));
};

/**
 *
 * @param list
 * @param fieldNames
 * @param isItemObj true:{[string]:item} false:{[string]:label}
 */
export const listToOptionsMap = (
  list: Record<string, any>[],
  fieldNames: FieldNames | undefined,
  isItemObj?: boolean,
) => {
  const { labelName, valueName } = getFieldNames(fieldNames);
  return reduce(
    list,
    (pair, item) => ({
      ...pair,
      [get(item, valueName)]: isItemObj ? item : get(item, labelName),
    }),
    {},
  );
};

/**
 * tree数据转options
 * @param data
 * @param fieldNames
 */
export const treeToOptions = (
  data: Record<string, any>[],
  fieldNames?: FieldNames,
  rewriteProps?: TRewriteProps,
): TreeOptions => {
  const { labelName, valueName, childrenName } = getFieldNames(fieldNames);
  return map(data, (item) => {
    return {
      label: get(item, labelName),
      value: get(item, valueName),
      ...(rewriteProps ? rewriteProps(item) : undefined),
      children: treeToOptions(get(item, childrenName), fieldNames, rewriteProps),
    };
  });
};

/**
 * tree数据转optionsMap
 * @param data
 * @param fieldNames
 * @param mapObj
 * @param itemMapObj
 */
export const treeToOptionsMap = (
  data: Record<string, any>[],
  fieldNames: FieldNames | undefined,
  mapObj: Record<string, string | number> | undefined = {},
  itemMapObj?: Record<string, any> | undefined,
) => {
  forEach(data, (item) => {
    const { labelName, valueName, childrenName } = getFieldNames(fieldNames);
    mapObj[get(item, valueName)] = get(item, labelName);
    if (itemMapObj) {
      itemMapObj[get(item, valueName)] = omit(item, childrenName);
    }
    const children = get(item, childrenName);
    if (size(children) > 0) {
      treeToOptionsMap(children, fieldNames, mapObj, itemMapObj);
    }
  });
};

/* ************************** value ******************************* */

export type TValueOpts = {
  multiple?: boolean;
  allPath?: boolean; //tree数据使用完整路径
  separator?: string; //分割符
  itemSeparator?: string; //子分割符
};

/**
 * 解析
 */
export const parseValue = (v: any, opts: TValueOpts) => {
  //
  if (!v) {
    return opts.multiple ? [] : v;
  }

  //已经是数组格式
  if (isArray(v)) return v;

  const separator = opts.separator || ",";
  const itemSeparator = opts.itemSeparator || "/";

  //字符串情况
  if (isString(v)) {
    if (opts.multiple) {
      if (opts.allPath) {
        return map(v.split(separator), (item) => {
          if (item) return item.split(itemSeparator);
          return [];
        });
      }
      return v.split(separator);
    } else {
      if (opts.allPath) {
        return v.split(itemSeparator);
      }
    }
  }

  return v;
};

/**
 * 转换
 */
export const formatValue = (v: any, opts: TValueOpts) => {
  if (!isArray(v)) return v;

  const separator = opts.separator || ",";
  const itemSeparator = opts.itemSeparator || "/";

  if (opts.multiple) {
    if (opts.allPath) {
      return join(
        map(v, (item) => {
          return item ? join(item, itemSeparator) : "";
        }),
        separator,
      );
    } else {
      return join(v, separator);
    }
  } else {
    if (opts.allPath) {
      return join(v, itemSeparator);
    }
  }

  return v;
};

export type TLabelOpts = TValueOpts & {
  options?: Record<string, any>[];
  fieldNames?: Record<string, string>;
  showAllPath?: boolean;
};

/**
 * 获取value对应的record
 */
export const findValueRecord = (v: any, opts: TLabelOpts) => {
  const rv = parseValue(v, opts);

  if (!rv) return null;

  const valueName = opts.fieldNames?.value || "value";
  const childrenName = opts.fieldNames?.children || "children";

  if (opts.multiple) {
    if (opts.allPath) {
      return map(rv, (item) => {
        return findTreeItem2(opts.options || [], item, { value: valueName, children: childrenName }).parentList;
      });
    } else {
      return map(rv, (item) => {
        return findTreeItem(
          opts.options || [],
          (subItem) => get(subItem, valueName) === item,
          { children: childrenName },
          [],
        ).parentList;
      });
    }
  } else {
    if (opts.allPath) {
      return findTreeItem2(opts.options || [], rv, { value: valueName, children: childrenName }).parentList;
    }
  }

  return findTreeItem(opts.options || [], (item) => get(item, valueName) === rv, { children: childrenName }, [])
    .parentList;
};

/**
 * 获取value对应的label
 */
export const findValueLabel = (r: any, opts: TLabelOpts) => {
  if (!r) return "";
  if (isArray(r) && size(r) <= 0) return "";

  const labelName = opts.fieldNames?.label || "label";

  const separator = opts.separator || ",";
  const itemSeparator = opts.itemSeparator || "/";

  return join(
    map(r, (sr) => {
      if (isArray(sr)) {
        if (opts.showAllPath) {
          return join(
            map(sr, (item) => get(item, labelName)),
            itemSeparator,
          );
        }
        return get(last(sr), labelName);
      }
      return get(sr, labelName);
    }),
    separator,
  );
};
