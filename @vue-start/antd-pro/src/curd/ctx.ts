import { inject, provide } from "vue";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { TColumns } from "../../types";
import { ICurdState, IOperate } from "./CurdModule";
import { ProCurdListProps } from "./CurdList";
import { ProCurdFormProps } from "./CurdForm";
import { DescriptionsProps } from "ant-design-vue";

const ProCurdModuleKey = Symbol("pro-curd-module");

export interface IProCurdModuleProvide {
  rowKey: string;
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  operate: IOperate;
  /******************子组件参数*******************/
  listProps?: ProCurdListProps;
  formProps?: ProCurdFormProps;
  descProps?: DescriptionsProps;
}

export const useProCurdModule = (): IProCurdModuleProvide => inject(ProCurdModuleKey) as IProCurdModuleProvide;

export const provideProCurdModule = (ctx: IProCurdModuleProvide) => {
  provide(ProCurdModuleKey, ctx);
};
