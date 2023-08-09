/**
 * string、boolean、number对应的描述
 */
export interface ISetPropItem {
  name: string; //属性名
  elementType: string; //属性对应的输入组件类型
  label?: string; //属性描述
  [key: string]: any;
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

  group?: string; //分组，仅展示用
}

/**
 * Module描述
 */
export interface IModule {}


export type TTab = "element" | "module";
