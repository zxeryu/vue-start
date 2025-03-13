import { computed, defineComponent, ExtractPropTypes, KeepAlive, PropType, ref } from "vue";
import { RouterView } from "vue-router";
import { TLayoutMenu, useProLayout } from "./ctx";
import { filter, map, pickBy, identity, size, every, keys } from "lodash";
import { useProRouter } from "../../core";
import { findTreeItem, treeToMap } from "@vue-start/hooks";

const routerViewProps = () => ({
  //includes 额外拓展
  includes: { type: Array as PropType<string[]>, default: [] },
  //开启 tags 模式全部缓存策略
  tagsCache: { type: Boolean, default: true },
});

export type ProRouterViewProps = Partial<ExtractPropTypes<ReturnType<typeof routerViewProps>>>;

export const ProRouterView = defineComponent<ProRouterViewProps>({
  props: {
    ...routerViewProps(),
  } as any,
  setup: (props) => {
    const { menus, tabs, refreshRef, showTabs, convertName, convertValue } = useProLayout();
    const { router, route } = useProRouter();

    //所有开启缓存的路由名称
    const menuIncludes = computed(() => {
      const obj = treeToMap(menus.value, (item) => {
        if (item.keep) {
          //子节点都为hide，认定为有效菜单;
          if (size(item.children) > 0) {
            return every(item.children, (m) => m.hide);
          }
          return true;
        }
        return false;
      });
      return pickBy(obj, identity);
    });

    const include = computed<string[]>(() => {
      const menuIncludeKeys = keys(menuIncludes.value);
      //***************** 非tabs模式 *************
      if (!showTabs.value) {
        //菜单树
        const { parentList } = findTreeItem(menus.value, (item) => item.value === convertName(route), undefined, []);
        //有效菜单集合
        const validList = filter(parentList, (item) => {
          const routeName = convertValue(item as TLayoutMenu);
          return router.hasRoute(routeName);
        });
        return [...menuIncludeKeys, ...props.includes!, ...map(validList, (item) => item.value)];
      }
      //****************** tabs模式 ****************
      let cacheTabs = tabs.value;
      //未开启tags缓存，只保留keep为true的
      if (!props.tagsCache) {
        cacheTabs = filter(tabs.value, (tab) => tab.keep);
      }
      //name list
      let list = map(cacheTabs, (item) => convertValue(item));

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
