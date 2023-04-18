import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElMenu, MenuProps } from "element-plus";
import { TreeOption, TreeOptions } from "@vue-start/pro";
import { get, keys, map, omit, pick, size } from "lodash";
import { convertTreeData, useWatch } from "@vue-start/hooks";

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
          <ElMenu.SubMenu
            index={menu?.value as string}
            {...props.convertSubMenuProps?.(menu)}
            v-slots={{ title: () => slots.title?.(menu) || menu?.label }}>
            {map(menu.children, (item) => {
              return <MenuItem menu={item} {...pick(props, commonKeys)} v-slots={slots} />;
            })}
          </ElMenu.SubMenu>
        );
      }

      return (
        <ElMenu.MenuItem
          index={menu?.value as string}
          {...props.convertMenuItemProps?.(menu)}
          onClick={handleClick}
          v-slots={{ title: () => slots.title?.(menu) || menu?.label }}
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
  ...commonProps,
});

export type ProMenusProps = Partial<ExtractPropTypes<ReturnType<typeof menuProps>>> & Omit<MenuProps, "defaultActive">;

export const ProMenus = defineComponent<ProMenusProps>({
  props: {
    ...omit(ElMenu.props, "defaultActive"),
    ...menuProps(),
  } as any,
  setup: (props, { slots }) => {
    const activeKey = ref(props.activeKey);

    useWatch(
      () => {
        if (props.activeKey !== activeKey.value) {
          activeKey.value = props.activeKey;
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

    const customKeys = keys(menuProps());
    return () => {
      return (
        <ElMenu defaultActive={activeKey.value} {...omit(props, customKeys)}>
          {map(options.value, (item) => {
            return <MenuItem menu={item} {...pick(props, commonKeys)} v-slots={slots} />;
          })}
        </ElMenu>
      );
    };
  },
});
