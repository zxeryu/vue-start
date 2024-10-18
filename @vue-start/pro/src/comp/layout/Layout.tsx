import { computed, defineComponent, PropType, ref } from "vue";
import {
  findTreeItem,
  getMenuTopNameMap,
  useResizeObserver,
  convertCollection,
  filterCollection,
} from "@vue-start/hooks";
import { find, findLast, get, map, omit, pick, size } from "lodash";
import { filterSlotsByPrefix } from "../../util";
import { ElementKeys, useGetCompByKey } from "../comp";
import { TreeOption } from "../../types";
import { useProRouter } from "../../core";

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

export type TLayoutMenu = {
  value: string;
  label: string;
  hide: boolean;
  [k: string]: any;
};

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
  //转换name，有些name是自定义的，可以用此方法拓展
  convertName: { type: Function },
  /**************************** menu相关 *******************************/
  menus: { type: Array as PropType<TLayoutMenu[]> },
  fieldNames: {
    type: Object as PropType<{ children: string; value: string; label: string; hide?: string }>,
    default: { children: "children", value: "value", label: "label", hide: "hide" },
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

    //菜单转换
    const reMenus = computed(() =>
      convertCollection(
        props.menus!,
        (item) => {
          const valueKey = props.fieldNames?.value || "value";
          const labelKey = props.fieldNames?.label || "label";
          const hideKey = props.fieldNames?.hide || "hide";
          return {
            ...omit(item, valueKey, labelKey, hideKey),
            value: get(item, valueKey),
            label: get(item, labelKey),
            hide: get(item, hideKey),
          };
        },
        { children: props.fieldNames?.children || "children", childrenName: "children" },
      ),
    );
    //需要展示的菜单
    const showMenus = computed(() => {
      return filterCollection(reMenus.value, (item) => !item.hide);
    });

    //所有菜单 第一级 映射关系
    const menuTopMap = computed(() => getMenuTopNameMap(reMenus.value));
    const showMenuTopMap = computed(() => getMenuTopNameMap(showMenus.value));

    //当前定位的第一级路由名称
    const currentTopName = computed(() => {
      if (props.findCurrentTopName) {
        return props.findCurrentTopName(route, menuTopMap.value);
      }
      const name = props.convertName?.(route) || route.name;
      return menuTopMap.value[name];
    });

    //当前定位的一级路由数据
    const currentTop = computed(() => {
      if (currentTopName.value) {
        return find(showMenus.value, (item) => item.value === currentTopName.value);
      }
      return null;
    });

    //compose模式 是否存在左侧菜单
    const hasLeftMenu = computed(() => {
      if (currentTop.value && currentTop.value.children && size(currentTop.value.children) > 0) {
        return true;
      }
      return false;
    });

    //当前路由对应的menu
    const activeKey = computed(() => {
      if (props.findActiveKey) {
        return props.findActiveKey(route, menuTopMap.value);
      }
      const name = props.convertName?.(route) || route.name;
      //如果当前路由是可展示的菜单，直接返回
      if (showMenuTopMap.value[name]) {
        return name;
      }
      //从菜单中定位到纵向菜单列表
      const { parentList } = findTreeItem(reMenus.value, (item) => item.value === name, undefined, []);
      //找出最后一个可见菜单
      const target = findLast(parentList, (item) => !item.hide);
      return target?.value || name;
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
      const target = findTreeItem(showMenus.value, (item) => item.value === menu.value).target;
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
        options: showMenus.value,
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
        <main
          {...pickAttrs}
          class={`${props.clsName} ${props.clsName}-${props.layout} ${
            hasLeftMenu.value ? "left-menu" : "no-left-menu"
          }`}>
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
                    options={map(showMenus.value, (item) => omit(item, "children"))}
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
            {hasLeftMenu.value && renderLeftMenu({ ...menuProps, options: currentTop.value!.children })}
            {section}
          </div>
        </main>
      );
    };
  },
});
