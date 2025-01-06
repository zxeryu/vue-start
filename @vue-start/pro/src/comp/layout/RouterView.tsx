import { computed, defineComponent, ExtractPropTypes, KeepAlive, PropType, ref } from "vue";
import { RouterView } from "vue-router";
import { TLayoutMenu, useProLayout } from "./ctx";
import { filter, map } from "lodash";
import { useProRouter } from "../../core";
import { findTreeItem } from "@vue-start/hooks";

const routerViewProps = () => ({
  //includes
  includes: { type: Array as PropType<string[]>, default: [] },
});

export type ProRouterViewProps = Partial<ExtractPropTypes<ReturnType<typeof routerViewProps>>>;

export const ProRouterView = defineComponent<ProRouterViewProps>({
  props: {
    ...routerViewProps(),
  } as any,
  setup: (props) => {
    const { menus, tabs, refreshRef, showTabs, convertName, convertValue } = useProLayout();
    const { router, route } = useProRouter();

    const include = computed<string[]>(() => {
      //***************** 非tabs模式 *************
      if (!showTabs.value) {
        //菜单树
        const { parentList } = findTreeItem(menus.value, (item) => item.value === convertName(route), undefined, []);
        //有效菜单集合
        const validList = filter(parentList, (item) => {
          const routeName = convertValue(item as TLayoutMenu);
          return router.hasRoute(routeName);
        });
        return [...props.includes!, ...map(validList, (item) => item.value)];
      }
      //****************** tabs模式 ****************
      let list = map(tabs.value, (item) => convertValue(item));
      if (refreshRef.value) {
        //在 KeepLive 中删除需要刷新的路由name
        list = filter(list, (item) => item !== route.name);
      }
      return [...props.includes!, ...list];
    });

    return () => {
      return (
        <RouterView
          v-slots={{
            default: ({ Component, route }: any) => {
              if (Component && Component.type && !Component.type.name && route.name) {
                Component.type.name = route.name;
              }
              return <KeepAlive include={include.value}>{refreshRef.value ? null : <Component />}</KeepAlive>;
            },
          }}
        />
      );
    };
  },
});
