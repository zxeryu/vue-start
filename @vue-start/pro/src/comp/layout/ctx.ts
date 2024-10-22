import { inject } from "vue";
import { Ref } from "@vue/reactivity";

export const ProLayoutKey = Symbol("pro-layout");

export type TLayoutMenu = {
  value: string;
  label: string;
  hide: boolean;
  [k: string]: any;
};

export type TLayoutType = "vertical" | "horizontal" | "horizontal-v" | "compose";

export interface IProLayoutProvide {
  //
  menus: Ref<TLayoutMenu[]>;
  menuMap: Ref<Record<string, TLayoutMenu>>;
  tabs: Ref<TLayoutMenu[]>;
  //刷新菜单
  refresh: (item?: TLayoutMenu) => void;
}

export const useProLayout = (): IProLayoutProvide => inject(ProLayoutKey) as IProLayoutProvide;
