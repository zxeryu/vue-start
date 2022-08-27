import { defineComponent, PropType, ref } from "vue";
import { Table, TableProps } from "ant-design-vue";
import { omit, keys, pick } from "lodash";
import { ProTable as ProTableOrigin, ProTableProps as ProTablePropsOrigin, useProTable } from "@vue-start/pro";
import { Ref } from "@vue/reactivity";

export type ProTableProps = ProTablePropsOrigin & Omit<TableProps, "columns">;

const Content = defineComponent({
  props: {
    tableRef: Object as PropType<Ref<any>>,
    ...omit(Table.props, "columns"),
  },
  setup: (props, { slots }) => {
    const { columns } = useProTable();
    return <Table ref={props.tableRef} {...omit(props, "tableRef")} columns={columns.value as any} v-slots={slots} />;
  },
});

export const ProTable = defineComponent<ProTableProps>({
  inheritAttrs: false,
  props: {
    ...Table.props,
    ...omit(ProTableOrigin.props, "loading"),
  },
  setup: (props, { slots, expose, attrs }) => {
    const tableRef = ref();

    expose({ tableRef });

    const originKeys = keys(omit(ProTableOrigin.props, "loading"));

    return () => {
      return (
        <ProTableOrigin {...pick(props, ...originKeys)} provideExtra={{ tableRef, ...props.provideExtra }}>
          <Content tableRef={tableRef} {...attrs} {...omit(props, originKeys)} v-slots={slots} />
        </ProTableOrigin>
      );
    };
  },
});
