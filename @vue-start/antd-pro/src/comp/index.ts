import { RowProps, ColProps, Row, Col } from "ant-design-vue";
import { createGrid } from "@vue-start/pro";
import { DefineComponent, VNode } from "vue";

export type ProGridProps = {
  row?: RowProps;
  col?: ColProps;
  items?: { vNode: VNode; rowKey?: string | number; col?: ColProps }[];
};

export const ProGrid: DefineComponent<ProGridProps> = createGrid<RowProps, ColProps>(Row, Col);
