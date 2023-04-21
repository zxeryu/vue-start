import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { Menu, MenuProps } from "ant-design-vue";
import { get, keys, map, omit, pick, size, dropRight, filter, reduce, last } from "lodash";
import { convertTreeData, findTreeItem, useEffect, useWatch } from "@vue-start/hooks";
import { TreeOption, TreeOptions } from "@vue-start/pro";

/******************************* MenuItem ************************************/

const commonProps = {
  //SubMenu props 转换
  convertSubMenuProps: { type: Function },
  //MenuItem props 转换
  convertMenuItemProps: { type: Function },
  //MenuItem点击事件
  onMenuItemClick: { type: Function },
};

const commonKeys = keys(commonProps);

const MenuItem = defineComponent({
  inheritAttrs: false,
  props: {
    menu: { type: Object as PropType<TreeOption> },
    ...commonProps,
  },
  setup: (props, { slots }) => {
    const handleClick = () => {
      props.onMenuItemClick?.(props.menu);
    };

    return () => {
      const menu = props.menu;

      if (menu?.children && size(menu.children) > 0) {
        return (
          <Menu.SubMenu
            key={menu?.value}
            {...props.convertSubMenuProps?.(menu)}
            v-slots={{
              title: () => slots.title?.(menu) || menu?.label,
              icon: () => slots.icon?.(menu),
              expandIcon: slots.expandIcon ? () => slots.expandIcon?.(menu) : undefined,
            }}>
            {map(menu.children, (item) => {
              return <MenuItem menu={item} {...pick(props, commonKeys)} v-slots={slots} />;
            })}
          </Menu.SubMenu>
        );
      }

      return (
        <Menu.Item
          key={menu?.value}
          {...props.convertMenuItemProps?.(menu)}
          onClick={handleClick}
          v-slots={{
            default: () => slots.title?.(menu) || menu?.label,
            icon: () => slots.icon?.(menu),
            title: slots.hoverTitle ? () => slots.hoverTitle?.(menu) : undefined,
          }}
        />
      );
    };
  },
});

/******************************* Menus ************************************/

const menuProps = () => ({
  //当前选中对象
  activeKey: { type: String },
  //tree数据
  options: { type: Array as PropType<Record<string, any>[]> },
  fieldNames: {
    type: Object as PropType<{ children: string; value: string; label: string }>,
    default: { children: "children", value: "value", label: "label" },
  },
  //是否只保持一个子菜单的展开
  uniqueOpened: { type: Boolean },
  //SubMenu props 转换
  convertSubMenuProps: { type: Function },
  //叶子节点点击事件
  onMenuItemClick: { type: Function },
});

export type ProMenusProps = Partial<ExtractPropTypes<ReturnType<typeof menuProps>>> &
  Omit<MenuProps, "selectedKeys" | "openKeys">;

export const ProMenus = defineComponent<ProMenusProps>({
  props: {
    ...omit(Menu.props, "selectedKeys", "openKeys"),
    ...menuProps(),
    mode: { type: String, default: "inline" },
  } as any,
  setup: (props, { slots }) => {
    const activeKeyRef = ref([props.activeKey]);
    const openKeysRef = ref([]);

    useWatch(
      () => {
        if (props.activeKey !== get(activeKeyRef.value, 0)) {
          activeKeyRef.value = [props.activeKey];
        }
      },
      () => props.activeKey,
    );

    const options = computed(
      () =>
        convertTreeData(
          props.options!,
          (item) => {
            const valueKey = props.fieldNames?.value || "value";
            const labelKey = props.fieldNames?.label || "label";
            return { ...omit(item, valueKey, labelKey), value: get(item, valueKey), label: get(item, labelKey) };
          },
          { children: props.fieldNames?.children || "children", childrenName: "children" },
        ) as TreeOptions,
    );

    //初始化 或 props.activeKey 发生改变的时候，加入SubMenu key
    useEffect(() => {
      if (props.mode !== "inline") return;
      if (size(options.value) <= 0 || !props.activeKey) return;
      const parent = findTreeItem(options.value, (item) => item.value === props.activeKey, undefined, []).parentList;
      const keyMap = reduce(openKeysRef.value, (pair, item) => ({ ...pair, [item]: true }), {});
      const addList = filter(dropRight(parent), (item) => !get(keyMap, item.value));
      if (size(addList) > 0) {
        openKeysRef.value = [...openKeysRef.value, ...map(addList, (item) => item.value)] as any;
      }
    }, [() => props.activeKey, options]);

    const customKeys = keys(menuProps());
    return () => {
      return (
        <Menu
          openKeys={openKeysRef.value}
          onUpdate:openKeys={(v: any[]) => {
            // activeKey.value = v;
            if (props.uniqueOpened && size(v) > 1) {
              openKeysRef.value = [last(v)] as any;
            } else {
              openKeysRef.value = v as any;
            }
          }}
          selectedKeys={activeKeyRef.value as any}
          onUpdate:selectedKeys={(v: any[]) => {
            activeKeyRef.value = v;
          }}
          {...omit(props, customKeys)}
          v-slots={slots}>
          {map(options.value, (item) => {
            return <MenuItem menu={item} {...pick(props, commonKeys)} v-slots={slots} />;
          })}
        </Menu>
      );
    };
  },
});
