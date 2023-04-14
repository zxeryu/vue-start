import { computed, defineComponent, PropType } from "vue";
import { Header } from "./Header";
import { commonKeys, Menus, TMenu } from "./Menu";
import { findTreeItem, getMenuTopNameMap } from "@vue-start/hooks";
import { useRoute } from "vue-router";
import { findLast, get, map, omit, pick, size } from "lodash";
import { filterSlotsByPrefix } from "../../util";

const layoutProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-layout" },
  /**
   * vertical:    上下
   * horizontal:  左右
   * compose：     菜单第一级在header中，子级在左侧菜单
   */
  layout: { type: String as PropType<"vertical" | "horizontal" | "compose">, default: "compose" },
  //获取当前路由对应的第一级menu name，匹配不到topName的时候会调用
  findCurrentTopName: { type: Function },
  //获取当前路由对应的menu对象，匹配不到activeKey的时候调用
  findActiveKey: { type: Function },
  /**************************** menu相关 *******************************/
  menus: { type: Array as PropType<Record<string, any>[]> },
  fieldNames: {
    type: Object as PropType<{ children: string; value: string; label: string }>,
    default: { children: "children", value: "value", label: "label" },
  },
  ...pick(Menus.props, ...commonKeys, "convertMenuParams"),
});

export const ProLayout = defineComponent({
  inheritAttrs: false,
  props: {
    ...layoutProps(),
  },
  setup: (props, { slots, attrs }) => {
    const route = useRoute();

    const convertMenus = (menus: Record<string, any>): TMenu[] => {
      return map(menus, (item) => {
        return {
          value: get(item, props.fieldNames?.value || "value"),
          label: get(item, props.fieldNames?.label || "label"),
          children: convertMenus(get(item, props.fieldNames?.children || "children")),
        };
      });
    };

    const reMenus = computed(() => convertMenus(props.menus!));

    //所有菜单 第一级 映射关系
    const menuTopMap = computed(() => getMenuTopNameMap(reMenus.value));

    //当前定位的第一级路由名称
    const currentTopName = computed(() => {
      const target = findLast(route.matched, (item) => !!get(menuTopMap.value, item.name!));
      if (target) {
        return get(menuTopMap.value, target.name!);
      }
      return props.findCurrentTopName?.(route, menuTopMap.value);
    });

    //当前定位的一级路由数据
    const currentTop = computed(() => {
      if (currentTopName.value) {
        return findTreeItem(reMenus.value, (item) => item.value === currentTopName.value).target;
      }
      return null;
    });

    //当前路由对应的menu
    const activeKey = computed(() => {
      const target = findLast(route.matched, (item) => !!get(menuTopMap.value, item.name!));
      if (target) {
        return target.name;
      }
      return props.findActiveKey?.(route, menuTopMap.value);
    });

    //compose 模式 header中的menu item 事件
    const handleComposeTopMenuClick = (menu: TMenu) => {
      const target = findTreeItem(reMenus.value, (item) => item.value === menu.value).target;
      props.onMenuItemClick?.(target);
    };

    const headerSlots = filterSlotsByPrefix(slots, "header");

    return () => {
      const pickAttrs = pick(attrs, "class");

      const menuProps = {
        ...pick(props, ...commonKeys, "convertMenuParams"),
        ...pick(slots, "title", "icon", "default"),
      };

      if (props.layout === "vertical") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            <Header
              class={`${props.clsName}-header`}
              v-slots={{
                menus: () => (
                  <Menus
                    mode={"horizontal"}
                    menus={reMenus.value}
                    activeKey={activeKey.value as string}
                    {...(menuProps as any)}
                  />
                ),
                ...headerSlots,
              }}
            />
            <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
          </main>
        );
      }
      if (props.layout === "horizontal") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            <Menus menus={reMenus.value} activeKey={activeKey.value as string} {...(menuProps as any)} />
            <div class={`${props.clsName}-structure`}>
              <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
              <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
            </div>
          </main>
        );
      }
      return (
        <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
          <Header
            class={`${props.clsName}-header`}
            v-slots={{
              menus: () => (
                <Menus
                  mode={"horizontal"}
                  menus={map(reMenus.value, (item) => omit(item, "children")) as any}
                  activeKey={currentTopName.value}
                  {...omit(menuProps, "onMenuItemClick")}
                  onMenuItemClick={handleComposeTopMenuClick}
                />
              ),
              ...headerSlots,
            }}
          />
          <div class={`${props.clsName}-structure`}>
            {currentTop.value && size(currentTop.value.children) > 0 && (
              <Menus menus={currentTop.value.children} activeKey={activeKey.value as string} {...(menuProps as any)} />
            )}
            <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
          </div>
        </main>
      );
    };
  },
});
