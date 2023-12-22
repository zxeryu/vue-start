import { computed, defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { filter, get, has, isBoolean, isFunction, map, omit, sortBy } from "lodash";
import { ElementKeys, useGetCompByKey } from "./comp";
import { useHasPer2 } from "../access";

/**
 * ！！！！ 这块修改后，得同步CudList tableOperateItems
 */
export interface IOpeItem {
  value: string | number;
  label?: string | VNode | (() => string | VNode);
  show?: boolean | (() => boolean);
  disabled?: boolean | (() => boolean);
  loading?: boolean | (() => boolean);
  //
  extraProps?: object | (() => Record<string, any>);
  onClick?: (value: string | number | boolean) => void;
  element?: (
    item?: Omit<IOpeItem, "show" | "disabled" | "opeProps" | "element"> & { disabled?: boolean },
  ) => VNode | null;
  //
  sort?: number; //排序
  per?: string; //权限字符串
  perSuffix?: string; //权限字符串后缀
}

const proOperateProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-operate" },
  items: { type: Array as PropType<IOpeItem[]> },
  //items 的补充
  itemState: { type: Object as PropType<Record<string, IOpeItem>> },
  elementKey: { type: String, default: ElementKeys.ButtonKey },
  //权限分割字符串
  splitStr: { type: String },
});

export type ProOperateProps = Partial<ExtractPropTypes<ReturnType<typeof proOperateProps>>>;

export const ProOperate = defineComponent<ProOperateProps>({
  props: {
    ...(proOperateProps() as any),
  },
  setup: (props, { slots }) => {
    const hasPer2 = useHasPer2();

    const reItems = computed(() => {
      //去除不显示的
      const items = filter(props.items, (item) => {
        if (!hasPer2(item.per, item.perSuffix, props.splitStr)) {
          return false;
        }

        if (isFunction(item.show)) {
          return item.show();
        } else if (isBoolean(item.show)) {
          return item.show;
        } else {
          return true;
        }
      });
      //合并itemState
      const list = map(items, (item) => {
        if (has(props.itemState, item.value)) {
          return { ...item, ...get(props.itemState, item.value) };
        }
        return item;
      });
      //排序
      return sortBy(list, (item) => item.sort);
    });

    const handleItemClick = (item: IOpeItem) => {
      item.onClick?.(item.value);
    };

    const getComp = useGetCompByKey();
    const Comp = props.elementKey ? getComp(props.elementKey) : undefined;

    return () => {
      return (
        <div class={props.clsName}>
          {map(reItems.value, (item) => {
            //是否禁用
            const disabled = isFunction(item.disabled) ? item.disabled() : item.disabled;
            const loading = isFunction(item.loading) ? item.loading() : item.loading;
            const label = isFunction(item.label) ? item.label() : item.label;
            const extraProps = isFunction(item.extraProps) ? item.extraProps() : item.extraProps;

            const renderItem = { ...omit(item, "show", "disabled", "element"), disabled };
            //优先级1：重写方法
            if (item.element && isFunction(item.element)) {
              return item.element(renderItem);
            }
            // 优先级2：插槽
            if (slots[item.value]) {
              return slots[item.value]!(renderItem);
            }
            // 优先级3：公共组件
            if (Comp) {
              return (
                <Comp disabled={disabled} loading={loading} onClick={() => handleItemClick(item)} {...extraProps}>
                  {label}
                </Comp>
              );
            }
            // 优先级4：默认
            return (
              <div class={`${props.clsName}-item`} onClick={() => handleItemClick(item)}>
                {label}
              </div>
            );
          })}
        </div>
      );
    };
  },
});
