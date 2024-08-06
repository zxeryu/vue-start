/*---
title: 选择
desc: v-model:selectedRowKeys 暂时只支持 element-plus
---*/

import { defineComponent, reactive } from "vue";
import { columns, dataSource } from "@/common/columns";
import { useUpdateKey } from "@vue-start/hooks";

export default defineComponent(() => {
  const [tableKey, updateTableKey] = useUpdateKey();

  const state = reactive<{
    selectedRowKeys: string[];
    dataSource: any[];
  }>({
    selectedRowKeys: [],
    dataSource: [],
  });

  const opeItems = [
    {
      label: "初始化即存在数据",
      value: "1",
      onClick: () => {
        state.selectedRowKeys = ["2"];
        state.dataSource = dataSource;
        updateTableKey();
      },
    },
    {
      label: "keys和data异步",
      value: "2",
      onClick: () => {
        state.selectedRowKeys = [];
        state.dataSource = [];
        updateTableKey();

        setTimeout(() => {
          state.selectedRowKeys = ["1"];
        }, 2000);
        setTimeout(() => {
          state.dataSource = dataSource;
        }, 3000);
      },
    },
  ];

  const rowSelection = {
    type: "multi",
    onChange: (ids: string[], rows: any[]) => {
      console.log("onChange=", ids, rows);
    },
  };

  return () => {
    return (
      <>
        <pro-operate items={opeItems} />
        <pro-table
          key={tableKey.value}
          v-model:selectedRowKeys={state.selectedRowKeys}
          columns={columns}
          dataSource={state.dataSource}
          rowSelection={rowSelection}
        />
      </>
    );
  };
});
