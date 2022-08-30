import { ComputedRef, Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { TColumn, TColumns, TElementMap } from "../types";
import { inject, provide, VNode } from "vue";
import { ICurdOperateOpts, ICurdState, TCurdActionEvent } from "./Curd";

const ProCurdKey = Symbol("pro-curd");

export interface IProCurdProvide {
  columns: Ref<TColumns>;
  getFormItemVNode: (column: TColumn, needRules: boolean | undefined) => VNode | null;
  getItemVNode: (column: TColumn, value: any) => VNode | null;
  elementMap: TElementMap;
  formElementMap: TElementMap;
  //
  rowKey: string;
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  //
  sendCurdEvent: (event: TCurdActionEvent) => void;
  //
  getOperate: (action: ICurdAction) => ICurdOperateOpts | undefined;
  //
  refreshList: (extra?: Record<string, any>) => void;
  /******************子组件参数*******************/
  listProps?: ComputedRef<Record<string, any> | undefined>;
  formProps?: ComputedRef<Record<string, any> | undefined>;
  descProps?: ComputedRef<Record<string, any> | undefined>;
  modalProps?: ComputedRef<Record<string, any> | undefined>;
}

export const useProCurd = <T extends IProCurdProvide>(): T => inject(ProCurdKey) as T;

export const provideProCurd = (ctx: IProCurdProvide) => provide(ProCurdKey, ctx);

/************************************ 常量 *************************************/

/**
 * curd 5种Action
 */
export enum CurdAction {
  LIST = "LIST",
  DETAIL = "DETAIL",
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
}

export type ICurdAction = keyof typeof CurdAction;

/**
 * 5种Action 的子事件
 */
export enum CurdSubAction {
  EMIT = "EMIT", //事件触发
  EXECUTE = "EXECUTE", //add、edit完成提交
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

export type ICurdCurrentMode = keyof typeof CurdCurrentMode;

/**
 * curd add 模式下 标记 "确定" "确定并继续" 触发
 */
export enum CurdAddAction {
  NORMAL = "NORMAL",
  CONTINUE = "CONTINUE",
}

export type ICurdAddAction = keyof typeof CurdAddAction;
