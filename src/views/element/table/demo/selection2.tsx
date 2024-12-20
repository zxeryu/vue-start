/*---
title: 选择-单选
---*/

import { computed, defineComponent, reactive } from "vue";
import { useUpdateKey, useWatch } from "@vue-start/hooks";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  const [tableKey, updateTableKey] = useUpdateKey();

  const state = reactive<{ enable: string; selectedRowKeys: string }>({
    enable: "enable",
    selectedRowKeys: "1",
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
      type: "single",
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
