import { computed, defineComponent, PropType, ref } from "vue";
import { findTreeItem, getMenuTopNameMap, useResizeObserver, convertCollection } from "@vue-start/hooks";
import { findLast, get, map, omit, pick, size } from "lodash";
import { filterSlotsByPrefix } from "../util";
import { ElementKeys, useGetCompByKey } from "./comp";
import { TreeOption } from "../types";
import { useProRouter } from "../core";

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
  //menu参数
  menuProps: { type: Object },
});

export const ProLayout = defineComponent({
  inheritAttrs: false,
  props: {
    ...layoutProps(),
  },
  setup: (props, { slots, attrs }) => {
    const getComp = useGetCompByKey();
    const Menus = getComp(ElementKeys.MenusKey);
    const Scroll = getComp(ElementKeys.ScrollKey) || "div";

    const { router, route } = useProRouter();

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
      if (props.findCurrentTopName) {
        return props.findCurrentTopName(route, menuTopMap.value);
      }
      const target = findLast(route.matched, (item) => !!get(menuTopMap.value, item.name!));
      if (target) {
        return get(menuTopMap.value, target.name!);
      }
      return undefined;
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
      if (props.findActiveKey) {
        return props.findActiveKey(route, menuTopMap.value);
      }
      if (route.name && get(menuTopMap.value, route.name!)) {
        return route.name;
      }
      return undefined;
    });

    const onMenuItemClick = (menu: TreeOption) => {
      if (props.onMenuItemClick) {
        props.onMenuItemClick(menu);
      } else {
        router.openMenu(menu);
      }
    };

    //compose 模式 header中的menu item 事件
    const handleComposeTopMenuClick = (menu: TreeOption) => {
      const target = findTreeItem(reMenus.value, (item) => item.value === menu.value).target;
      onMenuItemClick(target as any);
    };

    const headerSlots = filterSlotsByPrefix(slots, "header");
    const menuSlots = filterSlotsByPrefix(slots, "menu");

    //左侧菜单
    const renderLeftMenu = (menuProps: object) => {
      return (
        <div class={`${props.clsName}-menus-wrapper`}>
          {menuSlots.start?.()}
          <Scroll class={`${props.clsName}-menus-scroll`}>
            <Menus {...menuProps} v-slots={menuSlots} />
          </Scroll>
          {menuSlots.end?.()}
        </div>
      );
    };

    return () => {
      if (!Menus) return null;
      const pickAttrs = pick(attrs, "class");

      const menuProps = {
        class: `${props.clsName}-menus`,
        options: reMenus.value,
        activeKey: activeKey.value,
        ...pick(props, "convertSubMenuProps", "convertMenuItemProps"),
        onMenuItemClick,
        ...props.menuProps,
      };

      //内容区
      const section = <div class={`${props.clsName}-section`}>{slots.default?.()}</div>;

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
            {section}
          </main>
        );
      } else if (props.layout === "horizontal") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            {renderLeftMenu(menuProps)}
            <div class={`${props.clsName}-structure`}>
              <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
              {section}
            </div>
          </main>
        );
      } else if (props.layout === "horizontal-v") {
        return (
          <main {...pickAttrs} class={`${props.clsName} ${props.clsName}-${props.layout}`}>
            <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
            <div class={`${props.clsName}-structure`}>
              {renderLeftMenu(menuProps)}
              {section}
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
                    class={`${props.clsName}-menus`}
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
            {currentTop.value &&
              size(currentTop.value.children) > 0 &&
              renderLeftMenu({ ...menuProps, options: currentTop.value.children })}
            {section}
          </div>
        </main>
      );
    };
  },
});
