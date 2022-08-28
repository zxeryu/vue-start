import { DefineComponent, VNode } from "vue";
import { ICol, IRow } from "../../types";
import { ElRow, ElCol } from "element-plus";
import { createGrid } from "@vue-start/pro";

export type ProGridProps = {
  row?: IRow;
  col?: ICol;
  items?: { vNode: VNode; rowKey?: string | number; col?: ICol }[];
};

export const ProGrid: DefineComponent<ProGridProps> = createGrid(ElRow, ElCol);
