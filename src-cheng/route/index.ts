import { createRouter as createRouterOrigin, createWebHistory } from "vue-router";
import { IProConfigProvide, TRouter } from "@vue-start/pro";
import { size } from "lodash";
import { findFirstValidMenu } from "@vue-start/hooks";
import { BasicLayout } from "../component/layout";
import { routes } from "./routes";

const baseRoutes = [
  {
    path: "/",
    component: BasicLayout,
    children: routes,
  },
];

export const createRouter = () => {
  return createRouterOrigin({
    history: createWebHistory(),
    routes: baseRoutes as any,
  });
};

export const convertRouter: IProConfigProvide["convertRouter"] = (router) => {
  return {
    ...router,
    //菜单点击 根据菜单不同的类型 不同处理 （外链等）
    openMenu: (item: any) => {
      if (size(item.children) > 0) {
        const first = findFirstValidMenu(item.children, (item) => !item.children || size(item.children) <= 0);
        if (first) {
          router.push({ name: first.value });
        }
        return;
      }
      router.push({ name: item.value });
    },
  } as TRouter;
};
