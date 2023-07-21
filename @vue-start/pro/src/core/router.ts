import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { useProConfig } from "./pro";

export type TOpen = (url?: string | URL, target?: string, features?: string) => WindowProxy | null;

export type TOpenMenu = (menu: any) => void;

export type TRouter = Router & {
  open: TOpen;
  openMenu: TOpenMenu;
};

export const useProRouter = (): {
  router: TRouter;
  route: RouteLocationNormalizedLoaded;
} => {
  const { convertRouter } = useProConfig();

  const originRouter = useRouter();
  const route = useRoute();

  const open: TOpen = (url, target, features) => {
    return window.open(url, target, features);
  };

  const openMenu = (menu: any) => {};
  const reRouter = { ...originRouter, open, openMenu };

  const router = convertRouter ? convertRouter(reRouter) : reRouter;

  return { router, route };
};
