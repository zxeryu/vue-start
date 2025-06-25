import { computed, defineComponent, ExtractPropTypes, PropType, reactive, Ref, ref, Teleport } from "vue";
import { useProRouter } from "../../core";
import { TLayoutMenu, TLayoutTabMenu, useProLayout } from "./ctx";
import { useEffect, useUpdateKey, jsonToStr } from "@vue-start/hooks";
import { ElementKeys, useGetCompByKey } from "../comp";
import { filter, find, get, map, findIndex, reduce } from "lodash";

const tabsProps = () => ({
  //是否隐藏关闭
  isHideClose: { type: Function as PropType<(item: TLayoutMenu) => boolean> },
  //重写menu项
  covertMenuItem: { type: Function },
  //item项重写
  itemLabel: { type: Function },
  //拖动钩子
  onDragRegister: {
    type: Function as PropType<
      (params: { dom: HTMLDivElement; dataIdAttr: string; onDragEnd: (tabIds: string[]) => void }) => void
    >,
  },
  //找到第一个menu
  findFirstMenu: { type: Function },
  //tab item 点击监听
  onItemClick: { type: Function },
});

export type ProLayoutTabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;

export const LayoutTabs = defineComponent<ProLayoutTabsProps>({
  props: {
    ...tabsProps(),
  } as any,
  setup: (props) => {
    const { router, route } = useProRouter();

    const { menuMap, tabs, refresh, convertName } = useProLayout();

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
      const name = convertName(route);
      return get(menuMap.value, name!);
    });

    //路由切换（包含初始化）监听
    useEffect(
      (cur: string, pre: string) => {

        //当前路由未找到对应的菜单
        const curMenu: TLayoutTabMenu = menu.value;
        if (!curMenu) return;

        //查找当前tab
        let target: TLayoutTabMenu | undefined = find(tabs.value, (item) => item.value === curMenu.value);
        //当前tabs不存在
        if (!target) {
          //添加当前菜单
          tabs.value = [...tabs.value, { ...curMenu, query: route.query }];
          return;
        }

        const targetStr = jsonToStr(target.query!) || "{}";
        const curStr = jsonToStr(route.query!) || "{}";
        //query如果不一样，更新query
        if (targetStr !== curStr) {
          const newMenu = { ...curMenu, query: route.query };
          tabs.value = map(
            map(tabs.value, (item) => {
              //替换当前menu对象（更新query）
              if (item.value === curMenu.value) return newMenu;
              return item;
            }),
          );
          // 非当前页面 query replace 情况
          if (cur !== pre) {
            //refresh操作，主要解决 添加、编辑、详情 是同一个路由的更新问题
            handleItemRefresh(newMenu);
          }
        }
      },
      () => route.name,
    );

    // 只处理当前路由 query 变化
    useEffect(
      (cur, pre) => {
        const curName = cur?.[0];
        const preName = pre?.[0];
        if (curName !== preName) return;

        //当前路由未找到对应的菜单
        const curMenu: TLayoutTabMenu = menu.value;
        if (!curMenu) return;

        //更新 query
        tabs.value = map(
          map(tabs.value, (item) => {
            //替换当前menu对象（更新query）
            if (item.value === curMenu.value) return { ...curMenu, query: route.query };
            return item;
          }),
        );
      },
      [() => route.name, () => route.query],
    );

    /************************* 菜单点击事件 **********************/

    //
    const handleItemClick = (item: TLayoutTabMenu) => {
      if (props.onItemClick) {
        props.onItemClick(item);
        return;
      }
      //如果是普通路由，跳转
      if (router.hasRoute(item.value)) {
        router.push({ name: item.value, query: item.query });
        return;
      }
      //复用路由（会丢失query）
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
        handleItemClick(item);
      }
      tabs.value = filter(tabs.value, (i) => {
        //保留当前
        if (i.value === item.value) return true;
        //保留禁用close的
        return isHideClose(i);
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

    const onDragEnd = (tabIds: string[]) => {
      const tabsMap = reduce(tabs.value, (pair, item) => ({ ...pair, [item.value]: item }), {});
      tabs.value = map(tabIds, (item) => get(tabsMap, item));
      updateDomKey();
    };

    useEffect(() => {
      if (!domRef.value) return;
      if (!props.onDragRegister) return;

      props.onDragRegister({ dom: domRef.value, dataIdAttr: "data-url", onDragEnd });
    }, [domRef]);

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
              {map(tabs.value, (item) => {
                const isHide = isHideClose(item);
                const isActive = item.value === menu.value?.value;

                return (
                  <div
                    class={["pro-layout-tabs-item", isActive ? "active" : ""]}
                    data-url={item.value}
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
