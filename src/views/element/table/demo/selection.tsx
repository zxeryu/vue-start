/*---
title: 选择
desc: v-model:selectedRowKeys 暂时只支持 element-plus
---*/

import { computed, defineComponent, reactive } from "vue";
import { columns, dataSource } from "@/common/columns";
import { useEffect, useUpdateKey, useWatch } from "@vue-start/hooks";

const Case1 = defineComponent<any>(() => {
  const state = reactive<{ selectedRowKeys: string[]; dataSource: any[] }>({
    selectedRowKeys: ["1"],
    dataSource: dataSource,
  });

  return () => {
    return (
      <pro-table v-model:selectedRowKeys={state.selectedRowKeys} columns={columns} dataSource={state.dataSource} />
    );
  };
});

const Case2 = defineComponent<any>(() => {
  const state = reactive<{ selectedRowKeys: string[]; dataSource: any[]; loading: boolean }>({
    selectedRowKeys: [],
    dataSource: [],
    loading: true,
  });

  useEffect(() => {
    setTimeout(() => {
      state.selectedRowKeys = ["1"];
    }, 1000);
    setTimeout(() => {
      state.dataSource = dataSource;
      state.loading = false;
    }, 2000);
  }, []);

  return () => {
    return (
      <pro-table
        loading={state.loading}
        v-model:selectedRowKeys={state.selectedRowKeys}
        columns={columns}
        dataSource={state.dataSource}
      />
    );
  };
});

export default defineComponent(() => {
  const [tableKey, updateTableKey] = useUpdateKey();

  const state = reactive<{ tab: string; mode: string; enable: string }>({
    tab: "1",
    mode: "multi",
    enable: "enable",
  });

  const options = [
    { value: "1", label: "初始化即存在数据" },
    { value: "2", label: "keys和data异步" },
  ];

  const selectOptions = [
    { value: "multi", label: "多选" },
    { value: "single", label: "单选" },
  ];

  const disableOptions = [
    { value: "enable", label: "启用选择" },
    { value: "disable", label: "禁用选择" },
  ];

  useWatch(() => {
    updateTableKey();
  }, [() => state.mode, () => state.enable]);

  const rowSelection = computed(() => {
    return {
      type: state.mode,
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
        <div style={"display:flex;justify-content:space-between"}>
          <pro-tabs v-model={state.tab} options={options} />
          <pro-select v-model={state.mode} options={selectOptions} />
          <pro-select v-model={state.enable} options={disableOptions} />
        </div>
        <div key={tableKey.value}>
          {state.tab === "1" && <Case1 rowSelection={rowSelection.value} />}
          {state.tab === "2" && <Case2 rowSelection={rowSelection.value} />}
        </div>
      </>
    );
  };
});
