import { inject } from "vue";
import { Ref, UnwrapRef } from "@vue/reactivity";
import { RouteLocationNormalizedLoaded } from "vue-router";

export const ProLayoutKey = Symbol("pro-layout");

export type TLayoutMenu = {
  value: string;
  label: string;
  hide: boolean;
  keep: boolean; // keep-live 缓存
  [k: string]: any;
};

export type TLayoutTabMenu = TLayoutMenu & { query?: Record<string, any> };

export type TLayoutType = "vertical" | "horizontal" | "horizontal-v" | "compose";

export interface IProLayoutProvide {
  //
  //路由转化为菜单id （根据路由找菜单）
  convertName: (route: RouteLocationNormalizedLoaded) => string;
  //菜单转换为路由name （根据菜单找路由）
  convertValue: (menu: TLayoutTabMenu) => string;
  //
  menus: Ref<TLayoutMenu[]>;
  showMenus: Ref<TLayoutMenu[]>;
  menuMap: Ref<Record<string, TLayoutMenu>>;
  tabs: Ref<TLayoutTabMenu[]>;
  showTabs: Ref<boolean>;
  closeTab: (value: string) => void;
  //刷新菜单
  refreshRef: Ref<UnwrapRef<boolean>>;
  refresh: (item?: TLayoutMenu) => void;
}

export const useProLayout = (): IProLayoutProvide => inject(ProLayoutKey) as IProLayoutProvide;
