import { ComputedRef, Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { TColumns, TElementMap } from "../types";
import { inject, provide } from "vue";
import { ICurdOperateOpts, ICurdState, TCurdActionEvent } from "./Curd";

const ProCurdKey = Symbol("pro-curd");

export interface IProCurdProvide {
  columns: Ref<TColumns>;
  getSignColumns: (signName: string) => TColumns; //获取标记的column
  elementMap: TElementMap;
  formElementMap: TElementMap;
  //
  rowKey: string;
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  //发送curd事件
  sendCurdEvent: (event: TCurdActionEvent) => void;
  operates: ICurdOperateOpts[];
  //获取配置的operate
  getOperate: (action: ICurdAction) => ICurdOperateOpts | undefined;
  //刷新列表
  refreshList: (extra?: Record<string, any>) => void;
  //
  defaultAddRecord?: ComputedRef<Record<string, any> | undefined>;
  //模块名称
  title?: string;
  /******************子组件参数*******************/
  listProps?: ComputedRef<Record<string, any> | undefined>;
  formProps?: ComputedRef<Record<string, any> | undefined>;
  descProps?: ComputedRef<Record<string, any> | undefined>;
  modalProps?: ComputedRef<Record<string, any> | undefined>;
  //
  pageProps?: ComputedRef<Record<string, any> | undefined>; //ProCurdListPage 组件参数
  subPageProps?: ComputedRef<Record<string, any> | undefined>; //ProCurdPage组件参数
}

export const useProCurd = <T extends IProCurdProvide>(): T => inject(ProCurdKey) as T;

export const provideProCurd = (ctx: IProCurdProvide) => provide(ProCurdKey, ctx);

/************************************ 常量 *************************************/

/**
 * curd 5种基础Action
 */
export enum CurdAction {
  LIST = "LIST",
  DETAIL = "DETAIL",
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
}

export type ICurdAction = keyof typeof CurdAction | string;

/**
 * CurdAction 的子事件
 */
export enum CurdSubAction {
  EMIT = "EMIT", //事件触发
  EXECUTE = "EXECUTE", //add、edit完成提交 发起网络请求
  PAGE = "PAGE", //Page模式下事件
  SUCCESS = "SUCCESS", //请求成功
  FAIL = "FAIL", //请求失败
}

export type ICurdSubAction = keyof typeof CurdSubAction;

/**
 * curd 操作模式
 */
export enum CurdCurrentMode {
  ADD = "ADD",
  EDIT = "EDIT",
  DETAIL = "DETAIL",
}

export type ICurdCurrentMode = keyof typeof CurdCurrentMode | string;

/**
 * curd add 模式下 标记 "确定" "确定并继续" 触发
 */
export enum CurdAddAction {
  NORMAL = "NORMAL",
  CONTINUE = "CONTINUE",
}

export type ICurdAddAction = keyof typeof CurdAddAction;
