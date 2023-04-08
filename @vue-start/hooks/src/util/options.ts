import { forEach, get, map, omit, reduce, size } from "lodash";
import { FieldNames, TOptions, TreeOptions } from "@vue-start/pro";

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
