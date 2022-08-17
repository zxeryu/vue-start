import { defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { ICol, IRow } from "../../types";
import { ElRow, ElCol } from "element-plus";
import { map, merge } from "lodash";

const proGridProps = () => ({
  /**
   * row属性
   */
  row: { type: Object as PropType<IRow>, default: undefined },
  /**
   * 公共col属性
   */
  col: { type: Object as PropType<ICol> },
  /**
   *
   */
  items: {
    type: Array as PropType<
      {
        vNode: VNode;
        rowKey?: string | number;
        col?: ICol;
      }[]
    >,
  },
});

export type ProGridProps = Partial<ExtractPropTypes<ReturnType<typeof proGridProps>>>;

export const ProGrid = defineComponent<ProGridProps>({
  props: {
    ...proGridProps(),
  } as any,
  setup: (props) => {
    return () => {
      return (
        <ElRow {...props.row}>
          {map(props.items, (item) => {
            return (
              <ElCol key={item.rowKey} {...merge(props.col, item.col)}>
                {item.vNode}
              </ElCol>
            );
          })}
        </ElRow>
      );
    };
  },
});
