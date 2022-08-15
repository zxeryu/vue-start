import { defineComponent, isVNode, ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx, TColumns } from "../../types";
import { get, keys, map, omit, pick } from "lodash";
import { ProTable as ProTableOrigin, ProTableProps as ProTablePropsOrigin, useProTable } from "@vue-start/pro";

export type ProTableProps = Omit<ProTablePropsOrigin, "columns"> & {
  columns?: TColumns;
} & Omit<TableProps<any>, "tableLayout" | "flexible" | "data"> & {
    tableLayout?: "fixed" | "auto";
    flexible?: boolean;
    data?: any;
  };

const Content = defineComponent(() => {
  const { columns } = useProTable();

  return () => {
    return (
      <>
        {map(columns.value, (item) => {
          const formatter = (record: Record<string, any>, column: TableColumnCtx<any>, value: any, index: number) => {
            if (item.customRender) {
              return item.customRender({ value, text: value, record, column, index } as any);
            }
            return value;
          };

          return (
            <ElTableColumn
              key={item.dataIndex}
              {...omit(item, "title", "label", "renderHeader", "prop", "dataIndex", "formatter", "customRender")}
              label={isVNode(item.title) ? undefined : item.title || get(item, "label")}
              renderHeader={isVNode(item.title) ? () => item.title as any : undefined}
              prop={item.dataIndex as any}
              formatter={formatter as any}
            />
          );
        })}
      </>
    );
  };
});

export const ProTable = defineComponent<ProTableProps>({
  inheritAttrs: false,
  props: {
    ...ElTable.props,
    ...ProTableOrigin.props,
  },
  setup: (props, { slots, expose, attrs }) => {
    const tableRef = ref();

    const originKeys = keys(ProTableOrigin.props);

    return () => {
      return (
        <ProTableOrigin
          {...attrs}
          {...(pick(props, ...originKeys, "provideExtra") as any)}
          provideExtra={{ tableRef, ...props.provideExtra }}>
          <ElTable
            ref={(el: any) => {
              expose(el);
              tableRef.value = el;
            }}
            {...omit(props, originKeys)}
            v-slots={omit(slots, "default")}>
            <Content />
            {slots.default?.()}
          </ElTable>
        </ProTableOrigin>
      );
    };
  },
});
