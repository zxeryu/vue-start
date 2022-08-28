import { defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { map } from "lodash";

const proGridProps = () => ({
  row: { type: Object as PropType<Record<string, any>>, default: undefined },
  col: { type: Object as PropType<Record<string, any>> },
  items: {
    type: Array as PropType<
      {
        vNode: VNode;
        rowKey?: string | number;
        col?: Record<string, any>;
      }[]
    >,
  },
});

export type GridProps = Partial<ExtractPropTypes<ReturnType<typeof proGridProps>>>;

export const createGrid = (Row: any, Col: any): any => {
  return defineComponent<GridProps>({
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
  });
};
