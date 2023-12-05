import { computed, defineComponent, PropType, ref } from "vue";
import { findTreeItem, getMenuTopNameMap, useResizeObserver, convertCollection } from "@vue-start/hooks";
import { useRoute } from "vue-router";
import { findLast, get, map, omit, pick, size } from "lodash";
import { filterSlotsByPrefix } from "../util";
import { ElementKeys, useGetCompByKey } from "./comp";
import { TreeOption } from "../types";

const Header = defineComponent((_, { slots }) => {
  const menuWrapperRef = ref();
  const menuWrapperWidth = ref(0);

  useResizeObserver(menuWrapperRef, (entries) => {
    const rect = entries[0]?.contentRect;
    menuWrapperWidth.value = rect?.width;
  });

  return () => {
    return (
      <header>
        {slots.start?.()}

        {slots.menus && (
          <div ref={menuWrapperRef} class={"pro-header-menus-wrapper"}>
            {slots.menus(menuWrapperWidth.value)}
          </div>
        )}
        {slots.default?.()}

        {slots.end?.()}
      </header>
    );
  };
});

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
  layout: { type: String as PropType<"vertical" | "horizontal" | "horizontal-v" | "compose">, default: "compose" },
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
  //SubMenu props 转换
  convertSubMenuProps: { type: Function },
  //MenuItem props 转换
  convertMenuItemProps: { type: Function },
  //MenuItem点击事件
  onMenuItemClick: { type: Function },
});

export const ProLayout = defineComponent({
  inheritAttrs: false,
  props: {
    ...layoutProps(),
  },
  setup: (props, { slots, attrs }) => {
    const getComp = useGetCompByKey();
    const Menus = getComp(ElementKeys.MenusKey);

    const route = useRoute();

    const reMenus = computed(() =>
      convertCollection(
        props.menus!,
        (item) => {
          const valueKey = props.fieldNames?.value || "value";
          const labelKey = props.fieldNames?.label || "label";
          return { ...omit(item, valueKey, labelKey), value: get(item, valueKey), label: get(item, labelKey) };
        },
        { children: props.fieldNames?.children || "children", childrenName: "children" },
      ),
    );

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
      if (route.name && get(menuTopMap.value, route.name!)) {
        return route.name;
      }
      return props.findActiveKey?.(route, menuTopMap.value);
    });

    //compose 模式 header中的menu item 事件
    const handleComposeTopMenuClick = (menu: TreeOption) => {
      const target = findTreeItem(reMenus.value, (item) => item.value === menu.value).target;
      props.onMenuItemClick?.(target);
    };

    const headerSlots = filterSlotsByPrefix(slots, "header");
    const menuSlots = filterSlotsByPrefix(slots, "menu");

    return () => {
      if (!Menus) return null;
      const pickAttrs = pick(attrs, "class");

      const menuProps = {
        class: "pro-layout-menus",
        options: reMenus.value,
        activeKey: activeKey.value,
        ...pick(props, "convertSubMenuProps", "convertMenuItemProps", "onMenuItemClick"),
      };

      if (props.layout === "vertical") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            <Header
              class={`${props.clsName}-header`}
              v-slots={{
                menus: (width: number) => {
                  if (!width) return null;
                  return <Menus style={`width:${width}px`} mode={"horizontal"} {...menuProps} v-slots={menuSlots} />;
                },
                ...headerSlots,
              }}
            />
            <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
          </main>
        );
      } else if (props.layout === "horizontal") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            <div class={"pro-layout-menus-wrapper"}>
              {menuSlots.start?.()}
              <Menus {...menuProps} v-slots={menuSlots} />
              {menuSlots.end?.()}
            </div>
            <div class={`${props.clsName}-structure`}>
              <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
              <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
            </div>
          </main>
        );
      } else if (props.layout === "horizontal-v") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-horizontal ${props.clsName}-horizontal-v`}>
            <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
            <div class={`${props.clsName}-structure`}>
              <div class={"pro-layout-menus-wrapper"}>
                {menuSlots.start?.()}
                <Menus {...menuProps} v-slots={menuSlots} />
                {menuSlots.end?.()}
              </div>
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
              menus: (width: number) => {
                if (!width) return null;
                return (
                  <Menus
                    style={`width:${width}px`}
                    class={"pro-layout-menus"}
                    mode={"horizontal"}
                    options={map(reMenus.value, (item) => omit(item, "children"))}
                    activeKey={currentTopName.value}
                    {...pick(props, "convertSubMenuProps", "convertMenuItemProps")}
                    onMenuItemClick={handleComposeTopMenuClick}
                    v-slots={menuSlots}
                  />
                );
              },
              ...headerSlots,
            }}
          />
          <div class={`${props.clsName}-structure`}>
            {currentTop.value && size(currentTop.value.children) > 0 && (
              <Menus options={currentTop.value.children} {...omit(menuProps, "options")} v-slots={menuSlots} />
            )}
            <div class={`${props.clsName}-section`}>{slots.default?.()}</div>
          </div>
        </main>
      );
    };
  },
});
