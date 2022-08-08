import { inject, provide, VNode } from "vue";
import { Ref } from "@vue/reactivity";
import { TColumn, TColumns } from "../../types";

const ProModuleKey = Symbol("pro-module");

export interface IProModuleProvide {
  columns: Ref<TColumns>;
  getFormItemVNode: (column: TColumn, needRules: boolean | undefined) => VNode | null;
  getItemVNode: (column: TColumn, value: any) => VNode | null;
  elementMap: { [key: string]: any };
  formElementMap: { [key: string]: any };
}

export const useProModule = (): IProModuleProvide => inject(ProModuleKey) as IProModuleProvide;

export const provideProModule = (ctx: IProModuleProvide) => {
  provide(ProModuleKey, ctx);
};
