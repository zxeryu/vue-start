/**
 * ProForm ctx
 */
import { inject, provide } from "vue";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { DefineComponent } from "@vue/runtime-core";
import { FormInstance } from "element-plus";

const ProFormKey = Symbol("pro-form");

interface IProFormProvide extends Record<string, any> {
  formRef: Ref<FormInstance & { submit: () => void }>;
  formState: UnwrapNestedRefs<Record<string, any>>;
  showState: UnwrapNestedRefs<Record<string, any>>;
  readonlyState: UnwrapNestedRefs<Record<string, any>>;
  disableState: UnwrapNestedRefs<Record<string, any>>;
  readonly: Ref<boolean | undefined>;
  //
  elementMap?: { [key: string]: DefineComponent };
}

export const useProForm = (): IProFormProvide => inject(ProFormKey) as IProFormProvide;

export const provideProForm = (ctx: IProFormProvide) => {
  provide(ProFormKey, ctx);
};

/**
 * ProFormList ctx
 */

const ProFormListKey = Symbol("pro-form-list");

interface IProFormListProvide {
  pathList: (string | number)[];
}

export const useProFormList = (): IProFormListProvide => inject(ProFormListKey) as IProFormListProvide;

export const provideProFormList = (ctx: IProFormListProvide) => {
  provide(ProFormListKey, ctx);
};
