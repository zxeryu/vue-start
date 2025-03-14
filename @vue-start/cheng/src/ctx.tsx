import { IElement, IElementGroup, IPage, TTab } from "./types";
import { inject, Ref, UnwrapNestedRefs } from "vue";
import { IElementConfig } from "../../pro";

export interface IChengState {
  tab?: TTab;
  showElements: boolean; //展示组件
  showTree: boolean; //展示树
  showSet: boolean; //展示设置
}

export interface ISetOpts {
  clsNames: string[];
}

export interface IChengProvide {
  groupElements: (IElement | IElementGroup)[];
  //基础组件
  elements: IElement[];
  elementsMap: Record<string, IElement>;
  //设置相关的配置
  setOpts: ISetOpts;
  //当前操作的Page
  pageRef: Ref<IPage | undefined>;
  //当前Page中的Element
  elementRef: Ref<IElementConfig | undefined>;
  //
  chengState: UnwrapNestedRefs<IChengState>;
}

export const ProChengKey = Symbol("cheng");

export const useCheng = () => inject(ProChengKey) as IChengProvide;
