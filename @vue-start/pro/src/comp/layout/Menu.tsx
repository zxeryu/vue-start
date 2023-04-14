import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElementKeys, useGetCompByKey } from "../comp";
import { keys, map, pick, reduce, size } from "lodash";

export type TMenu = {
  [key: string]: any;
  value: string;
  label: string;
  children?: TMenu[];
};

const commonProps = {
  convertSubMenuParams: { type: Function },
  convertMenuItemParams: { type: Function },
  //
  subMenuSlots: { type: Object },
  menuItemSlots: { type: Object },
  //
  onMenuItemClick: { type: Function },
};

export const commonKeys = keys(commonProps);

const ProMenuItem = defineComponent({
  inheritAttrs: false,
  props: {
    menu: Object,
    ...commonProps,
  },
  setup: (props) => {
    const getComp = useGetCompByKey();
    const SubMenu = getComp(ElementKeys.MenuSubKey);
    const MenuItem = getComp(ElementKeys.MenuItemKey);

    const handleClick = () => {
      props.onMenuItemClick?.(props.menu);
    };

    const subMenuSlots = reduce(
      keys(props.subMenuSlots),
      (pair, item) => {
        return { ...pair, [item]: () => props.subMenuSlots![item]?.(props.menu) };
      },
      {},
    );

    const menuItemSlots = reduce(
      keys(props.menuItemSlots),
      (pair, item) => {
        return { ...pair, [item]: () => props.menuItemSlots![item]?.(props.menu) };
      },
      {},
    );

    return () => {
      if (props.menu?.children && size(props.menu.children) > 0) {
        if (!SubMenu) return null;
        return (
          <SubMenu {...props.convertSubMenuParams?.(props.menu)} v-slots={subMenuSlots}>
            {map(props.menu.children, (item) => {
              return <ProMenuItem menu={item} {...pick(props, commonKeys)} />;
            })}
          </SubMenu>
        );
      }

      if (!MenuItem) {
        return null;
      }
      return <MenuItem {...props.convertMenuItemParams?.(props.menu)} onClick={handleClick} v-slots={menuItemSlots} />;
    };
  },
});

const menuProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-layout-menus" },
  menus: { type: Array as PropType<TMenu[]> },
  mode: { type: String, default: "vertical" },
  //当前选中的key
  activeKey: { type: String },
  openKeys: { type: Array as PropType<string[]> },
  //参数转换
  convertMenuParams: { type: Function },
  ...commonProps,
});

export type ProMenuProps = Partial<ExtractPropTypes<ReturnType<typeof menuProps>>>;

export const Menus = defineComponent<ProMenuProps>({
  inheritAttrs: false,
  props: {
    ...menuProps(),
  } as any,
  setup: (props) => {
    const getComp = useGetCompByKey();
    const Menu = getComp(ElementKeys.MenuKey);

    return () => {
      if (!Menu) {
        return null;
      }
      return (
        <Menu
          class={props.clsName}
          {...props.convertMenuParams?.(pick(props, "mode", "activeKey", "openKeys", "collapse"))}>
          {map(props.menus, (item) => {
            return <ProMenuItem menu={item} {...pick(props, commonKeys)} />;
          })}
        </Menu>
      );
    };
  },
});
