import { computed, defineComponent } from "vue";
import { useLogonUser } from "@vue-start/pro";
import { map, get, size, forEach, findLast } from "lodash";
import { useRoute, useRouter } from "vue-router";
import { css } from "@emotion/css";
import { findTreeItem, getMenuTopNameMap } from "@vue-start/hooks";

export interface IMenu {
  title: string;
  name: string;
  children?: IMenu[];
}

export const findValidMenu = (item: IMenu): IMenu | null => {
  if (size(item.children) > 0) {
    return findValidMenu(item.children![0]);
  } else {
    return item;
  }
  return null;
};

export const TopMenu = defineComponent(() => {
  const { per } = useLogonUser();
  const router = useRouter();
  const route = useRoute();

  const menuTopMap = computed(() => {
    return getMenuTopNameMap(per.menus, { children: "children", value: "name" });
  });

  const current = computed(() => {
    const target = findLast(route.matched, (item) => !!get(menuTopMap.value, item.name!));
    if (target) {
      return get(menuTopMap.value, target.name as string);
    }
    return "";
  });

  const handleClick = (item: IMenu) => {
    const menu = findValidMenu(item);
    if (menu) {
      router.push({ name: menu.name });
    }
  };

  return () => {
    return (
      <div class={css({ display: "flex", color: "#606266", "& > * + *": { marginLeft: 16 } })}>
        {map(per.menus, (item) => {
          return (
            <div
              class={css({
                cursor: "pointer",
                color: current.value === item.name ? "var(--pro-color-primary)" : undefined,
              })}
              onClick={() => handleClick(item)}>
              {item.title}
            </div>
          );
        })}
      </div>
    );
  };
});

export const LeftMenu = defineComponent(() => {
  const { per } = useLogonUser();
  const router = useRouter();
  const route = useRoute();

  const menuTopMap = computed(() => {
    return getMenuTopNameMap(per.menus, { children: "children", value: "name" });
  });

  const menuData = computed(() => {
    const target = findLast(route.matched, (item) => !!get(menuTopMap.value, item.name!));
    if (target?.name) {
      return findTreeItem(per.menus, (item) => get(menuTopMap.value, target.name!) === item.name, undefined).target;
    }
    return null;
  });

  const handleClick = (item: IMenu) => {
    router.push({ name: item.name });
  };

  return () => {
    if (!menuData.value || size(menuData.value.children) <= 0) {
      return null;
    }
    return (
      <nav
        class={css({
          height: "calc(100vh - var(--header-hei) - var(--divide-vertical-hei))",
          overflowY: "auto",
          borderRight: "1px solid #f0f0f0",
          color: "#606266",
          lineHeight: "36px",
          width: 200,
          minWidth: 200,
        })}>
        {map(menuData.value.children, (item) => {
          if (!item.children) {
            return (
              <div
                class={css({
                  paddingLeft: 16,
                  cursor: "pointer",
                  color: item.name === route.name ? "var(--pro-color-primary)" : undefined,
                })}
                onClick={() => handleClick(item)}>
                {item.title}
              </div>
            );
          }
          return (
            <div>
              <div class={css({ fontSize: 12, color: "#999", paddingLeft: 16 })}>{item.title}</div>
              {map(item.children, (subItem) => {
                return (
                  <div
                    class={css({
                      paddingLeft: 16,
                      cursor: "pointer",
                      color: subItem.name === route.name ? "var(--pro-color-primary)" : undefined,
                    })}
                    onClick={() => handleClick(subItem)}>
                    {subItem.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>
    );
  };
});
