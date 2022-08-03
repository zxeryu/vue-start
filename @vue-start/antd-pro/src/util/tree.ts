import { DefaultOptionType, FieldNames } from "ant-design-vue/lib/vc-tree-select/TreeSelect";
import { find, findIndex, forEach, get, map, size } from "lodash";

export type TData = {} | any;

const treeDefaultNames = {
  children: "children",
  label: "label",
  value: "value",
};

/**
 * list数据转treeData数据
 * @param data
 * @param fieldNames
 * @param options
 * @param extra
 */
export const dataToTreeSelectData = (
  data: TData[],
  fieldNames: FieldNames,
  options: {
    onlyChild?: true;
  },
  extra?: (item: TData) => DefaultOptionType,
): DefaultOptionType[] => {
  return map(data, (item) => {
    const children = get(item, fieldNames.children || treeDefaultNames.children);
    return {
      key: get(item, fieldNames.value || treeDefaultNames.value),
      value: get(item, fieldNames.value || treeDefaultNames.value),
      label: get(item, fieldNames.label || treeDefaultNames.label),
      children: size(children) > 0 ? dataToTreeSelectData(children, fieldNames, options, extra) : undefined,
      disabled: options.onlyChild && size(children) > 0,
      ...(extra ? extra(item) : undefined),
    };
  });
};

/**
 * 从tree数据中找到对应的对象
 * @param data
 * @param value
 * @param fieldNames
 * @param cb
 */
export const findTarget = (
  data: TData[],
  value: string | number,
  fieldNames: FieldNames,
  cb: (index: number, data: TData, list: TData[]) => void,
) => {
  const index = findIndex(data, (item) => item[fieldNames.value || treeDefaultNames.value] === value);
  if (index > -1) {
    cb(index, data[index], data);
    return;
  }
  forEach(data, (item) => {
    const children = item[fieldNames.children || treeDefaultNames.children];
    if (size(children) > 0) {
      findTarget(children, value, fieldNames, cb);
    }
  });
};

/**
 * 从tree数据中找到指定元素及所有父元素列表
 * @param data
 * @param value
 * @param fieldNames
 * @param cb
 * @param parent
 */
export const findTargetList = (
  data: TData[],
  value: string | number,
  fieldNames: FieldNames,
  cb: (list: TData[]) => void,
  parent: TData[] = [],
) => {
  const target = find(data, (item) => {
    return item[fieldNames.value || treeDefaultNames.value] === value;
  });
  if (target) {
    cb([...parent, target]);
    return;
  }
  forEach(data, (item) => {
    const children = item[fieldNames.children || treeDefaultNames.children];
    if (size(children) > 0) {
      findTargetList(children, value, fieldNames, cb, [...parent, item]);
    }
  });
};
