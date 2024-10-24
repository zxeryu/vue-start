import { computed, defineComponent, ExtractPropTypes, PropType, reactive, ref, Teleport } from "vue";
import { useProRouter } from "../../core";
import { TLayoutMenu, TLayoutTabMenu, useProLayout } from "./ctx";
import { useEffect, useUpdateKey, jsonToStr } from "@vue-start/hooks";
import { ElementKeys, useGetCompByKey } from "../comp";
import { filter, find, get, map, findIndex } from "lodash";

const tabsProps = () => ({
  //是否隐藏关闭
  isHideClose: { type: Function as PropType<(item: TLayoutMenu) => boolean> },
  //转换name，有些name是自定义的，可以用此方法拓展
  convertName: { type: Function },
  //重写menu项
  covertMenuItem: { type: Function },
  //item项重写
  itemLabel: { type: Function },
});

export type ProLayoutTabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;

export const LayoutTabs = defineComponent<ProLayoutTabsProps>({
  props: {
    ...tabsProps(),
  } as any,
  setup: (props) => {
    const { router, route } = useProRouter();

    const { menuMap, tabs, refresh } = useProLayout();

    const state = reactive<{
      ctxMenuPos: { x: number; y: number } | null;
      ctxMenuItem: TLayoutMenu | null;
    }>({
      ctxMenuPos: null,
      ctxMenuItem: null,
    });

    //是否隐藏close
    const isHideClose = (item: TLayoutMenu) => {
      if (props.isHideClose) {
        return props.isHideClose(item);
      }
      return false;
    };

    //当前路由对应的菜单
    const menu = computed(() => {
      const name = props.convertName?.(route) || route.name;
      return get(menuMap.value, name!);
    });

    //路由监听
    useEffect(() => {
      //当前路由未找到对应的菜单
      const curMenu: TLayoutTabMenu = menu.value;
      if (!curMenu) {
        return;
      }

      //查找当前tab
      let target: TLayoutTabMenu | undefined = find(tabs.value, (item) => item.value === curMenu.value);
      //当前tabs不存在
      if (!target) {
        //如果是hide路由，记录query
        const newMenu = curMenu.hide ? { ...curMenu, query: route.query } : curMenu;
        //添加当前菜单
        tabs.value = [...tabs.value, newMenu];
      } else {
        //如果是hide路由，
        if (curMenu.hide) {
          const targetStr = jsonToStr(target.query!) || "{}";
          const curStr = jsonToStr(curMenu.query!) || "{}";
          //query如果不一样
          if (targetStr !== curStr) {
            const newMenu = { ...curMenu, query: route.query };
            tabs.value = map(
              map(tabs.value, (item) => {
                //替换当前menu对象（更新query）
                if (item.value === curMenu.value) return newMenu;
                return item;
              }),
            );
            //refresh操作，主要解决 添加、编辑、详情 是同一个路由的更新问题
            handleItemRefresh(newMenu);
          }
        }
      }
    }, route);

    /************************* 菜单点击事件 **********************/

    //
    const handleItemClick = (item: TLayoutTabMenu) => {
      //hide 路由
      if (item.hide) {
        router.push({ name: item.value, query: item.query });
        return;
      }
      router.openMenu(item);
    };

    //关闭指定menu
    const handleItemClose = (item: TLayoutTabMenu) => {
      //隐藏close的不响应
      if (isHideClose(item)) {
        return;
      }
      //如果关闭的是当前定位菜单，跳转到下/上一个菜单
      if (item.value === menu.value?.value) {
        const index = findIndex(tabs.value, (i) => i.value === menu.value.value);
        if (tabs.value[index + 1]) {
          handleItemClick(tabs.value[index + 1]);
        } else if (tabs.value[index - 1]) {
          handleItemClick(tabs.value[index - 1]);
        }
      }
      //从tabs中清除
      tabs.value = filter(tabs.value, (i) => i.value !== item.value);
    };

    //关闭指定menu外的其他menu
    const handleItemCloseOther = (item: TLayoutTabMenu) => {
      //如果当前选中的非当前tab，先切换
      if (item.value !== menu.value?.value) {
        handleItemClick(menu.value);
      }
      tabs.value = filter(tabs.value, (i) => {
        //保留当前
        if (i.value === item.value) return true;
        //保留禁用close的
        return isHideClose(item);
      });
    };

    //关闭全部
    const handleItemCloseAll = () => {
      //当前无定位菜单 或 定位的菜单可关闭
      if (!menu.value || !isHideClose(menu.value)) {
        //切换到第一个不能close的菜单
        const target = find(tabs.value, (i) => isHideClose(i));
        if (target) {
          router.openMenu(target);
        }
      }

      tabs.value = filter(tabs.value, (i) => isHideClose(i));
    };

    //刷新
    const handleItemRefresh = (item: TLayoutTabMenu) => {
      refresh(item);
    };

    //右键菜单
    const handleCtxMenu = (e: any, item: TLayoutTabMenu) => {
      e.preventDefault();
      const target = e.target;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      state.ctxMenuPos = { x: rect.x + rect.width / 2, y: rect.y + rect.height };
      state.ctxMenuItem = item;
    };

    //
    const handleCtxMenuNone = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleCtxMenuClose = () => {
      state.ctxMenuItem = null;
    };

    /******************************** 拖动 ****************************/
    const domRef = ref();
    const [domKey, updateDomKey] = useUpdateKey();


    /******************************** 弹出菜单 ****************************/
    const dropRef = ref();

    //直接打开 dropdown
    useEffect(() => {
      const drop = dropRef.value?.originRef;
      if (!drop) return;
      drop?.handleOpen();
    }, dropRef);

    const handleVisibleChange = (v: boolean) => {
      if (!v) {
        state.ctxMenuItem = null;
      }
    };

    const handleCommand = (command: string) => {
      if (command === "refresh") {
        handleItemRefresh(state.ctxMenuItem!);
      } else if (command === "close") {
        handleItemClose(state.ctxMenuItem!);
      } else if (command === "close-other") {
        handleItemCloseOther(state.ctxMenuItem!);
      } else if (command === "close-all") {
        handleItemCloseAll();
      }

      handleCtxMenuClose();
    };

    const options = computed(() => {
      const list = [];
      if (menu.value?.value === state.ctxMenuItem?.value) {
        list.push({ label: "刷新", value: "refresh" });
      }
      if (!isHideClose(state.ctxMenuItem!)) {
        list.push({ label: "关闭", value: "close" });
      }
      list.push(
        ...[
          { label: "关闭其他", value: "close-other" },
          { label: "全部关闭", value: "close-all" },
        ],
      );
      return map(list, (item) => {
        if (props.covertMenuItem) {
          return props.covertMenuItem(item);
        }
        return item;
      });
    });

    /***************************************************************/

    const getComp = useGetCompByKey();
    const Dropdown = getComp(ElementKeys.DropdownKey);
    const RComp = getComp(ElementKeys.ScrollKey) || "div";

    return () => {
      return (
        <>
          <RComp class={"pro-layout-tabs"}>
            <div class={"pro-layout-tabs-root"} ref={domRef} key={domKey.value}>
              <div class={"place place-start"} />
              {map(tabs.value, (item) => {
                const isHide = isHideClose(item);
                const isActive = item.value === menu.value?.value;

                return (
                  <div
                    class={["pro-layout-tabs-item", isActive ? "active" : ""]}
                    onClick={() => handleItemClick(item)}
                    // @ts-ignore
                    oncontextmenu={(e) => handleCtxMenu(e, item)}>
                    {item.itemLabel?.(item) || item.label}
                    {!isHide && (
                      <div
                        class={"pro-layout-tabs-item-close"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleItemClose(item);
                        }}
                        // @ts-ignore
                        oncontextmenu={handleCtxMenuNone}>
                        ✕
                      </div>
                    )}
                  </div>
                );
              })}
              <div class={"place place-end"} />
            </div>
          </RComp>
          {state.ctxMenuItem && state.ctxMenuPos && (
            <Teleport to={"body"}>
              <div class={"pro-layout-tabs-menus"} style={`left:${state.ctxMenuPos.x}px;top:${state.ctxMenuPos.y}px`}>
                <Dropdown
                  ref={dropRef}
                  trigger={"click"}
                  options={options.value}
                  hideOnClick={false}
                  onCommand={handleCommand}
                  onVisibleChange={handleVisibleChange}>
                  <div />
                </Dropdown>
              </div>
            </Teleport>
          )}
        </>
      );
    };
  },
});
