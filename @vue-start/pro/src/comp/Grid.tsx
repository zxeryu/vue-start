import { defineComponent, PropType, VNode } from "vue";
import { map } from "lodash";

const proGridProps = <TRow, TCol>() => ({
  /**
   * row属性
   */
  row: { type: Object as PropType<TRow>, default: undefined },
  /**
   * 公共col属性
   */
  col: { type: Object as PropType<TCol> },
  /**
   *
   */
  items: {
    type: Array as PropType<
      {
        vNode: VNode;
        rowKey?: string | number;
        col?: TCol;
      }[]
    >,
  },
});

export const createGrid = <TRow, TCol>(Row: any, Col: any) => {
  return defineComponent<{
    row?: TRow;
    col?: TCol;
    items?: { vNode: VNode; rowKey?: string | number; col?: TCol }[];
  }>({
    props: {
      ...proGridProps(),
    } as any,
    setup: (props) => {
      return () => {
        return (
          <Row {...props.row}>
            {map(props.items, (item) => (
              <Col key={item.rowKey} {...props.col} {...item.col}>
                {item.vNode}
              </Col>
            ))}
          </Row>
        );
      };
    },
  }) as any;
};
