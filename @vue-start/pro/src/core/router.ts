import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter, parseQuery, stringifyQuery } from "vue-router";
import { useProConfig } from "./pro";
import { size } from "lodash";
import { findFirstValidMenu } from "@vue-start/hooks";

export type TOpenMenu = (menu: any) => void;

export const RouterMethods = {
  open: (url?: string | URL, target?: string, features?: string): WindowProxy | null => {
    return window.open(url, target, features);
  },
  parseStr: (str: string) => {
    if (!str) return null;
    try {
      const u = new URL(str);
      return {
        protocol: u.protocol,
        path: u.pathname,
        origin: u.origin,
        query: parseQuery(u.search),
        url: u.origin + u.pathname,
      };
    } catch (e) {}
    const protocol = str.indexOf("//") > -1 ? str.split("//")?.[0] : "";
    let url = "";
    let search = "";
    if (str.indexOf("?") >= -1) {
      url = str.substring(0, str.indexOf("?"));
      search = str.substring(str.indexOf("?"));
    }
    const query = search ? parseQuery(search) : {};
    return { protocol, query, url };
  },
  stringifyUrl: ({ url, query }: { url: string; query: Record<string, any> }) => {
    const search = stringifyQuery(query);
    return `${url}${search ? "?" : ""}${search || ""}`;
  },
};

export type TRouter = Router &
  Partial<typeof RouterMethods> & {
    openMenu: TOpenMenu;
  };

export const useProRouter = (): {
  router: TRouter;
  route: RouteLocationNormalizedLoaded;
} => {
  const { convertRouter } = useProConfig();

  const originRouter = useRouter();
  const route = useRoute();

  const openMenu = (menu: any) => {
    if (!menu) return;
    if (size(menu.children) > 0) {
      const first = findFirstValidMenu(menu.children, (sub) => !sub.children || size(sub.children) <= 0);
      if (first) {
        originRouter.push({ name: first.value });
        return;
      }
    }
    originRouter.push({ name: menu.value });
  };
  const reRouter = { ...originRouter, openMenu, ...RouterMethods };

  const router = convertRouter ? convertRouter(reRouter) : reRouter;

  return { router, route };
};
