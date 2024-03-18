import { TConfigData } from "../../pro";

/**
 * string、boolean、number对应的描述
 */
export interface ISetPropItem {
  name: string; //属性名
  label?: string; //属性描述
  //设置属性的时候 form-item-field 配置
  elementType: string; //输入组件类型
  inputProps?: Record<string, any>;
  options?: (string | boolean | number)[]; //select拓展
}

/**
 * object、array对应的描述
 */
export interface ISetPropGroup {
  groupType: "object" | "array";
  name: string;
  label?: string;
  setProps: (ISetPropItem | ISetPropGroup)[];
}

/**
 * 组件描述
 */
export interface IElement {
  name: string;
  elementType: string;
  setProps: (ISetPropItem | ISetPropGroup)[];
  //是否可以添加子元素
  children?: boolean;
  //如果可以配置children，childrenSlotName代表字段绑定
  childrenSlotName?: string;

  custom?: boolean; //是否是自定义组件
}

/**
 * 组件分组title
 */
export interface IElementGroup {
  title: string;
  desc?: string;
}

/**
 *  页面描述
 */
export interface IPage {
  id?: string; //todo::线上拓展
  path?: string; //组件路径（本地）
  configData: TConfigData;
}

export type TTab = "element" | "module";
