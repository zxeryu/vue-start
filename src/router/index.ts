import { size } from "lodash";
import { createRouter as createRouterOrigin, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { routes as moduleRoutes } from "./modules";
import { BasicLayout } from "@/layout";
import { IProConfigProvide, TRouter } from "@vue-start/pro";
import { findFirstValidMenu } from "@vue-start/hooks";

const reRoutes = [
  {
    path: "/",
    component: BasicLayout,
    children: [...routes, ...moduleRoutes],
  },
];

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
      const name = item.value;

      // name带参数
      if (name.indexOf("?") > 0) {
        const paramIndex = name.indexOf("?");
        const routeName = name.substring(0, paramIndex);
        const to = router.resolve({ name: routeName });

        router.push(to.fullPath + name.substring(paramIndex));

        return;
      }

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
