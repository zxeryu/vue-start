import { forEach, get, size } from "lodash";
import { isValidInRules, TRules } from "./base";

type TMenu = Record<string, any>;

const findFirstValidMenuRecursion = (
  menus: TMenu[],
  rules: TRules,
  fieldNames: { children: string } | undefined = { children: "children" },
  mapObj: { target?: TMenu },
) => {
  for (let i = 0; i < menus.length; i++) {
    //如果已经找到，返回方法
    if (mapObj.target) return;
    const item = menus[i];
    if (isValidInRules(item, rules)) {
      mapObj.target = item;
      return;
    }
    const children = get(item, fieldNames?.children);
    if (children && size(children) > 0 && !mapObj.target) {
      findFirstValidMenuRecursion(children, rules, fieldNames, mapObj);
    }
  }
};

/**
 * 查找第一个有效的menu
 * @param menus
 * @param rules
 * @param fieldNames
 */
export const findFirstValidMenu = (
  menus: TMenu[],
  rules: TRules,
  fieldNames: { children: string; value: string } | undefined = { children: "children", value: "value" },
): TMenu | undefined => {
  const mapObj: { target?: TMenu } = {};
  findFirstValidMenuRecursion(menus, rules, fieldNames, mapObj);
  return mapObj.target;
};

/**
 *  {
 *    ${menu.name}: ${topName}(第一级菜单name)
 *  }
 * @param menus
 * @param fieldNames
 * @param mapObj
 * @param parentName
 */
const setMenuTopNameRecursion = (
  menus: TMenu[],
  fieldNames: { children: string; value: string } | undefined = { children: "children", value: "value" },
  mapObj: Record<string, any>,
  parentName?: string,
) => {
  forEach(menus, (item) => {
    const name = get(item, fieldNames?.value);
    const pn = parentName || name;
    mapObj[name] = pn;
    const children = get(item, fieldNames?.children);
    if (children && size(children) > 0) {
      setMenuTopNameRecursion(children, fieldNames, mapObj, pn);
    }
  });
};

/**
 *  设置当前menu对象分类（topName）
 * @param menus
 * @param fieldNames
 */
export const getMenuTopNameMap = (
  menus: TMenu[],
  fieldNames: { children: string; value: string } | undefined = { children: "children", value: "value" },
): Record<string, any> => {
  const mapObj = {};
  setMenuTopNameRecursion(menus, fieldNames, mapObj);
  return mapObj;
};
