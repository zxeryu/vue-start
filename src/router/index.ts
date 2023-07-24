import { forEach, size } from "lodash";
import { RouterView, createRouter as createRouterOrigin, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { routes as moduleRoutes } from "./modules";
import { BasicLayout } from "@/layout";
import { IProConfigProvide, TRouter } from "@vue-start/pro";
import { findFirstValidMenu } from "@vue-start/hooks";

const replenishRoute = (routes: any[]) => {
  forEach(routes, (route) => {
    if (!route.component && !route.redirect) {
      route.component = RouterView;
    }
    if (size(route.children) > 0) {
      replenishRoute(route.children);
    }
  });
};

const reRoutes = [
  {
    path: "/",
    component: BasicLayout,
    children: [...routes, ...moduleRoutes],
  },
];

replenishRoute(reRoutes);

export const createRouter = () => {
  return createRouterOrigin({
    history: createWebHistory(),
    routes: reRoutes as any[],
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
