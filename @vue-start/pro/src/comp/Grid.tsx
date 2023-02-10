import { defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { map } from "lodash";
import { ColKey, RowKey, useGetCompByKey } from "./comp";

const proGridProps = () => ({
  row: { type: Object as PropType<Record<string, any>>, default: undefined },
  //公共col
  col: { type: Object as PropType<Record<string, any>> },
  items: {
    type: Array as PropType<
      {
        vNode: VNode;
        rowKey?: string | number;
        //当前item 独有col
        col?: Record<string, any>;
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
    const getComp = useGetCompByKey();

    const Row = getComp(RowKey);
    const Col = getComp(ColKey);

    return () => {
      if (!Row || !Col) {
        return null;
      }
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
