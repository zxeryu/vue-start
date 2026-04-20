/*---
title: 单选模式
---*/
import { defineComponent, reactive } from "vue";
import { CurdAction } from "@vue-start/pro";
import { userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";

const columns = [
  {
    dataIndex: "name",
    title: "姓名",
    valueType: "text",
    extra: { search: true, form: true, table: true },
  },
  {
    dataIndex: "age",
    title: "年龄",
    valueType: "digit",
    extra: { search: true, form: true, table: true },
  },
  {
    dataIndex: "status",
    title: "状态",
    valueType: "select",
    formFieldProps: {
      options: [
        { value: 1, label: "启用" },
        { value: 0, label: "禁用" },
      ],
    },
    extra: { search: true, form: true, table: true },
  },
];

export default defineComponent(() => {
  const state = reactive({
    singleValue: undefined as number | undefined,
  });

  return () => (
    <>
      <pro-table-select
        v-model={state.singleValue}
        onChange={(val: any, opts: any) => console.log("onChange", val, opts)}
        fieldNames={{ value: "id", label: "name" }}
        curdModuleProps={{
          columns,
          operates: [
            {
              action: CurdAction.LIST,
              actor: userList,
              convertData: (actor: IRequestActor) => {
                const data = actor.res?.data?.data;
                return { total: data?.total, dataSource: data?.list };
              },
            },
          ],
        }}
        modalProps={{ title: "选择人员" }}
      />
      <p>选中值: {state.singleValue}</p>
    </>
  );
});
