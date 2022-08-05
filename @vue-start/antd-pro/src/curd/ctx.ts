import { inject, provide } from "vue";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { TColumns } from "../../types";
import { ICurdState, IOperate } from "./CurdModule";
import { ProCurdListProps } from "./CurdList";

const ProCurdModuleKey = Symbol("pro-curd-module");

export interface IProCurdModuleProvide {
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  operate: IOperate;
  //子组件参数
  listProps?: ProCurdListProps;
}

export const useProCurdModule = (): IProCurdModuleProvide => inject(ProCurdModuleKey) as IProCurdModuleProvide;

export const provideProCurdModule = (ctx: IProCurdModuleProvide) => {
  provide(ProCurdModuleKey, ctx);
};
