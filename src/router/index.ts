import { forEach, size } from "lodash";
import { RouterView, createRouter as createRouterOrigin, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { BasicLayout } from "@/layout";

export const replenishRoute = (routes: any[]) => {
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
    children: routes,
  },
];

replenishRoute(reRoutes);

export const createRouter = () => {
  return createRouterOrigin({
    history: createWebHistory(),
    routes: reRoutes as any[],
  });
};
