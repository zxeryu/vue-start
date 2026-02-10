import { computed, defineComponent, ExtractPropTypes, PropType, provide, ref } from "vue";
import {
  findTreeItem,
  getMenuTopNameMap,
  useResizeObserver,
  convertCollection,
  filterCollection,
  treeToMap,
  useWatch,
  useEffect,
  jsonToStr,
  strToJson,
  findFirstValidMenu,
} from "@vue-start/hooks";
import { filter, find, findLast, get, map, omit, pick, size, countBy, pickBy, keys, reduce } from "lodash";
import { filterSlotsByPrefix } from "../../util";
import { ElementKeys, useGetCompByKey } from "../comp";
import { TreeOption } from "../../types";
import { useProRouter } from "../../core";
import { IProLayoutProvide, ProLayoutKey, TLayoutMenu, TLayoutTabMenu, TLayoutType } from "./ctx";
import { LayoutTabs, ProLayoutTabsProps } from "./Tabs";
import { ProRouterView, ProRouterViewProps } from "./RouterView";
import { ProWatermark, ProWatermarkProps } from "../Watermark";
import { LayoutBreadcrumb, LayoutBreadcrumbProps } from "./Breadcrumb";

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
          <div
            ref={menuWrapperRef}
            class={"pro-header-menus-wrapper"}
            style={{
              "--pro-header-menus-wrapper-wid": menuWrapperWidth.value + "px",
            }}>
            {slots.menus()}
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
  layout: { type: String as PropType<TLayoutType>, default: "compose" },
  //获取当前路由对应的第一级menu name，匹配不到topName的时候会调用
  findCurrentTopName: { type: Function },
  //获取当前路由对应的menu对象，匹配不到activeKey的时候调用
  findActiveKey: { type: Function },
  convertName: { type: Function }, //route to menu
  convertValue: { type: Function }, //menu to route
  //tabs相关配置
  tabs: {
    type: Object as PropType<
      ProLayoutTabsProps & {
        sessionKey?: string; //同步到session中的key
        clearWhileUnmount?: boolean; //卸载组件的时候是否清空
      }
    >,
    default: undefined,
  },
  // breadcrumb相关配置
  breadcrumb: { type: Object as PropType<LayoutBreadcrumbProps> },
  //horizontal、horizontal-v、compose 模式下，左侧菜单收起状态
  collapse: { type: Boolean },
  //router配置
  routeOpts: { type: Object as PropType<ProRouterViewProps>, default: undefined },
  //Watermark
  watermark: { type: Object as PropType<ProWatermarkProps>, default: undefined },
  //simple 模式下, Drawer visible状态
  drawerMenuVisible: { type: Boolean },
  drawerProps: { type: Object },
  drawerMenuProps: { type: Object },
  /**************************** menu相关 *******************************/
  menus: { type: Array as PropType<TLayoutMenu[]> },
  fieldNames: {
    type: Object as PropType<{ children: string; value: string; label: string; hide?: string; keep?: string }>,
    default: { children: "children", value: "value", label: "label", hide: "hide", keep: "keep" },
  },
  //SubMenu props 转换
  convertSubMenuProps: { type: Function },
  //MenuItem props 转换
  convertMenuItemProps: { type: Function },
  //MenuItem点击事件
  onMenuItemClick: { type: Function },
  //menu参数
  menuProps: { type: Object }, //compose模式下-为左侧菜单Props
  topMenuProps: { type: Object }, //compose模式下-为顶部菜单Props
});

export type ProLayoutProps = Partial<ExtractPropTypes<ReturnType<typeof layoutProps>>>;

export const ProLayout = defineComponent<ProLayoutProps>({
  inheritAttrs: false,
  props: {
    ...layoutProps(),
  } as any,
  setup: (props, { slots, attrs, emit }) => {
    const getComp = useGetCompByKey();
    const Menus = getComp(ElementKeys.MenusKey);
    const Drawer = getComp(ElementKeys.DrawerKey);
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
          const keepKey = props.fieldNames?.keep || "keep";
          return {
            ...omit(item, valueKey, labelKey, hideKey, keepKey),
            value: get(item, valueKey),
            label: get(item, labelKey),
            hide: get(item, hideKey),
            keep: get(item, keepKey),
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
    //所有菜单record
    const menuMap = computed(() => {
      return treeToMap(reMenus.value, (item) => omit(item, "children"));
    });

    /************************** 菜单、路由转换 *********************************/
    //菜单value 转 路由name
    const convertValue: IProLayoutProvide["convertValue"] = (menu) => {
      if (props.convertValue) {
        return props.convertValue(menu);
      }
      // 处理 name 中携带"？"的情况
      const index = menu.value.indexOf("?");
      if (index > 0) {
        return menu.value.substring(0, index);
      }
      return menu.value;
    };

    //重复路由集（一个路由对应多个菜单，即：菜单value中携带"?"）
    const repeatRouteMap = computed<Record<string, true>>(() => {
      const list = keys(
        pickBy(
          countBy(menuMap.value, (item) => convertValue(item)),
          (v) => v > 1,
        ),
      );
      return reduce(list, (pair, item) => ({ ...pair, [item]: true }), {});
    });

    // 路由name 转 菜单value
    const convertName: IProLayoutProvide["convertName"] = (route) => {
      if (props.convertName) {
        return props.convertName(route, { menuTopMap: menuTopMap.value });
      }

      // 处理重复路由，即：name 中携带"?"的情况
      if (route.name && repeatRouteMap.value[route.name as string]) {
        const index = route.fullPath.indexOf("?");
        return (route.name as string) + route.fullPath.substring(index);
      }

      return route.name as string;
    };

    //当前定位的第一级路由名称
    const currentTopName = computed(() => {
      if (props.findCurrentTopName) {
        return props.findCurrentTopName(route, menuTopMap.value);
      }
      const name = convertName(route);
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
      const name = convertName(route);
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

      handleMenuVisibleChange(false)
    };

    //compose 模式 header中的menu item 事件
    const handleComposeTopMenuClick = (menu: TreeOption) => {
      const target = findTreeItem(showMenus.value, (item) => item.value === menu.value).target;
      onMenuItemClick(target as any);
    };

    /************************** tabs *********************************/
    const showTabs = computed(() => !!props.tabs);

    const getSessionKey = () => {
      let sessionKey = props.tabs?.sessionKey;
      if (sessionKey === undefined) {
        sessionKey = "pro-layout-tabs";
      }
      return sessionKey;
    };

    //第一个有效菜单
    const firstValidMenu =
      props.tabs?.findFirstMenu?.(showMenus.value) ||
      (findFirstValidMenu(showMenus.value, (item) => {
        return !item.children || size(item.children) <= 0;
      }) as TLayoutMenu);

    const initTabs = () => {
      //未开启 tabs
      if (!showTabs.value) {
        return [];
      }

      const sessionKey = getSessionKey();
      let list: TLayoutTabMenu[] = [];
      if (sessionKey) {
        const str = window.sessionStorage.getItem(sessionKey);
        const vs = str ? strToJson(str) : [];
        list = map(vs, (item) => {
          return { ...get(menuMap.value, item.name), query: item.query };
        });
      }
      if (size(list) <= 0 && firstValidMenu) {
        list = [firstValidMenu];
      }
      return list;
    };

    const tabs = ref<TLayoutTabMenu[]>(initTabs());

    const isHideClose = (item: TLayoutMenu) => {
      if (item.value === firstValidMenu?.value) {
        return true;
      }
      return false;
    };

    const closeTab: IProLayoutProvide["closeTab"] = (value) => {
      tabs.value = filter(tabs.value, (item) => {
        return item.value !== value;
      });
    };

    //同步到session
    useWatch(() => {
      const sessionKey = getSessionKey();
      if (!sessionKey) return;

      const vs = map(tabs.value, (item) => ({ name: item.value, query: item.query }));

      window.sessionStorage.setItem(sessionKey, jsonToStr(vs));
    }, tabs);

    const getClearWhileUnmount = () => {
      const clearWhileUnmount = props.tabs?.clearWhileUnmount;
      if (clearWhileUnmount === undefined) {
        return true;
      }
      return clearWhileUnmount;
    };

    //卸载清空session数据项
    useEffect(() => {
      return () => {
        const sessionKey = getSessionKey();
        if (sessionKey && getClearWhileUnmount()) {
          window.sessionStorage.removeItem(sessionKey);
        }
      };
    }, []);

    /************************** breadcrumb *********************************/

    const showBreadcrumb = computed(() => !!props.breadcrumb);

    /************************** simple *********************************/

    const handleMenuVisibleChange = (v: boolean) => {
      emit("update:drawerMenuVisible", v);
    };

    /************************** 刷新当前路由 *********************************/

    const refreshRef = ref(false);

    const refresh = () => {
      refreshRef.value = true;
      setTimeout(() => {
        refreshRef.value = false;
      }, 0);
    };

    provide<IProLayoutProvide>(ProLayoutKey, {
      convertName,
      convertValue,
      //
      menus: reMenus as any,
      showMenus: showMenus as any,
      repeatRouteMap: repeatRouteMap as any,
      menuMap: menuMap as any,
      tabs: tabs as any,
      showTabs: showTabs as any,
      closeTab,
      //
      refreshRef: refreshRef as any,
      refresh,
    });

    /************************** render *********************************/

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

    //cls
    const cls = computed(() => {
      const cls = [`${props.clsName} ${props.clsName}-${props.layout}`];
      if (showTabs.value) {
        cls.push("has-tabs");
      }
      if (showBreadcrumb.value) {
        cls.push("has-breadcrumb");
      }
      if (props.layout === "horizontal" || props.layout === "horizontal-v") {
        cls.push("has-left-menu");
        if (props.collapse) cls.push("mini");
      }
      if (props.layout === "compose") {
        if (hasLeftMenu.value) cls.push("has-left-menu");
        if (props.collapse) cls.push("mini");
      }
      return cls;
    });

    const menuProps = computed(() => {
      return {
        class: `${props.clsName}-menus`,
        options: showMenus.value,
        activeKey: activeKey.value,
        ...pick(props, "convertSubMenuProps", "convertMenuItemProps"),
        onMenuItemClick,
        ...props.menuProps,
      };
    });

    const leftMenuProps = computed(() => {
      return { ...menuProps.value, collapse: props.collapse };
    });

    return () => {
      if (!Menus) return null;

      //内容区
      const section = (
        <>
          {showTabs.value && (
            <LayoutTabs isHideClose={isHideClose} {...omit(props.tabs, "sessionKey", "clearWhileUnmount")} />
          )}
          {showBreadcrumb.value && <LayoutBreadcrumb {...props.breadcrumb} />}
          {slots.connect?.()}
          <div class={`${props.clsName}-section`}>
            {slots.default?.()}
            {slots.routerView ? slots.routerView() : <ProRouterView {...props.routeOpts} />}
            {props.watermark && <ProWatermark {...props.watermark} />}
            {slots.end?.()}
          </div>
        </>
      );

      if (props.layout === "simple") {
        return (
          <main {...attrs} class={cls.value}>
            <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
            {section}
            {slots.drawerMenuTrigger && (
              <div class={`${props.clsName}-trigger`} onClick={() => handleMenuVisibleChange(true)}>
                {slots.drawerMenuTrigger()}
              </div>
            )}
            <Drawer
              visible={props.drawerMenuVisible}
              onUpdate:visible={(v: boolean) => handleMenuVisibleChange(v)}
              footer={false}
              {...props.drawerProps}>
              {renderLeftMenu({ ...leftMenuProps.value, ...props.drawerMenuProps })}
            </Drawer>
          </main>
        );
      } else if (props.layout === "vertical") {
        return (
          <main {...attrs} class={cls.value}>
            <Header
              class={`${props.clsName}-header`}
              v-slots={{
                menus: () => {
                  return <Menus mode={"horizontal"} {...menuProps.value} v-slots={menuSlots} />;
                },
                ...headerSlots,
              }}
            />
            {section}
          </main>
        );
      } else if (props.layout === "horizontal") {
        return (
          <main {...attrs} class={cls.value}>
            {renderLeftMenu(leftMenuProps.value)}
            <div class={`${props.clsName}-structure`}>
              <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
              {section}
            </div>
          </main>
        );
      } else if (props.layout === "horizontal-v") {
        return (
          <main {...attrs} class={cls.value}>
            <Header class={`${props.clsName}-header`} v-slots={headerSlots} />
            <div class={`${props.clsName}-structure`}>
              {renderLeftMenu(leftMenuProps.value)}
              <div class={`${props.clsName}-right`}>{section}</div>
            </div>
          </main>
        );
      }

      return (
        <main {...attrs} class={cls.value}>
          <Header
            class={`${props.clsName}-header`}
            v-slots={{
              menus: () => {
                return (
                  <Menus
                    class={`${props.clsName}-menus`}
                    mode={"horizontal"}
                    options={map(showMenus.value, (item) => omit(item, "children"))}
                    activeKey={currentTopName.value}
                    {...props.topMenuProps}
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
            {hasLeftMenu.value &&
              renderLeftMenu({
                ...leftMenuProps.value,
                options: currentTop.value!.children,
                key: currentTop.value!.value,
              })}
            <div class={`${props.clsName}-right`}>{section}</div>
          </div>
        </main>
      );
    };
  },
});
