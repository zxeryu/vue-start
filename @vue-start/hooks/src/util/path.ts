import { get, isArray, isNumber, size } from "lodash";
import { findTreeItem } from "./collection";

/**
 * 如有对象
 * {
 *   id: "id",
 *   name: "name",
 *   options:[
 *     {value: "v", label: "l", extra: "extra"},
 *     {value: "v2", label: "l2"},
 *   ]
 * }
 *
 * path "options.0.extra" 表示上述对象的options中第一项的extra的值
 *
 * 在做高级设计过程中 如：静态数据的补充数据，需要将补充数据设计为
 * {
 *   [path]: any,
 *   ...
 * }
 *
 * 问题：静态数据修改的情况下，path中包含下标"index"的对应关系可能出现错误，如：上述对象中options删除值或者调整顺序。
 *
 * 为解决该问题可能造成的影响，将下标"index"的值改为"[idName,idValue]"描述，即："options.0.extra" ——> "options.[value,v].extra"
 *
 * 解析数据过程中需要调用 restorePath 方法还原path，即 "options.[value,v].extra" ——> "options.0.extra"的过程
 *
 * @param path
 * @param obj
 */
export const restorePath = (path: string, obj: Record<string, any>): string => {
  const arr = path.match(/\[(.*?)\]/g);
  if (!arr || size(arr) <= 0) return path;

  const firstItem = arr[0];
  if (!firstItem || firstItem.indexOf(",") < 0) return path;

  const [idName, idValue] = firstItem.replace("[", "").replace("]", "").split(",");
  const leftPath = path.substring(0, path.indexOf(firstItem) - 1);

  const arrObj = get(obj, leftPath);
  if (!isArray(arrObj)) return path;

  const { index } = findTreeItem(arrObj, (item) => item[idName] === idValue);
  if (!isNumber(index)) return path;

  const cp = path.replace(firstItem, String(index));

  return restorePath(cp, obj);
};

/**
 * 是否是合法的path （不存在"["或"]"）
 * @param path
 */
export const isValidPath = (path: string): boolean => {
  if (!path) return false;
  if (path.indexOf("[") > -1) return false;
  if (path.indexOf("]") > -1) return false;
  return true;
};

/**
 * 父级对象是否存在，在使用 set 设置数据时候，如果不需要为obj设置新对象，将使用该方法预先判断
 * path 为 "options.0.extra" 时，判断"options.0"是否存在
 * @param path
 * @param obj
 */
export const isPathHasParent = (path: string, obj: Record<string, any>): boolean => {
  if (path.indexOf(".") > 0) {
    const leftPath = path.substring(0, path.lastIndexOf("."));
    return !!get(obj, leftPath);
  }
  return true;
};
