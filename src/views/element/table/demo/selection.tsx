/*---
title: 选择-多选
desc: v-model:selectedRowKeys 暂时只支持 element-plus
---*/

import { computed, defineComponent, reactive } from "vue";
import { columns, dataSource } from "@/common/columns";
import { useUpdateKey, useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  const [tableKey, updateTableKey] = useUpdateKey();

  const state = reactive<{ tab: string; enable: string; selectedRowKeys: string[] }>({
    tab: "1",
    enable: "enable",
    selectedRowKeys: [],
  });

  const disableOptions = [
    { value: "enable", label: "启用选择" },
    { value: "disable", label: "禁用选择" },
  ];

  useWatch(() => {
    updateTableKey();
  }, [() => state.enable]);

  const rowSelection = computed(() => {
    return {
      type: "multi",
      column: {
        selectable: state.enable === "disable" ? () => false : undefined,
      },
      onChange: (ids: string[], rows: any[]) => {
        console.log("onChange=", ids, rows);
      },
    };
  });

  return () => {
    return (
      <>
        <pro-radio v-model={state.enable} options={disableOptions} />
        <pro-table
          key={tableKey.value}
          v-model:selectedRowKeys={state.selectedRowKeys}
          rowSelection={rowSelection.value}
          columns={columns}
          dataSource={dataSource}
        />
      </>
    );
  };
});
