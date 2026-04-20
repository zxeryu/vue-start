/*---
title: 多选模式
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
    multipleValue: ["1", "2"] as string[],
  });

  return () => (
    <>
      <pro-table-select
        v-model={state.multipleValue}
        onChange={(val: any, opts: any) => console.log("onChange", val, opts)}
        popupType="popover"
        multiple
        clearable
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={3}
        showPopupTags
        options={[
          { name: "用户1", id: "1" },
          { name: "用户2", id: "2" },
        ]}
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
          listProps: {
            tableProps: {
              rowSelection: { pagination: true },
            },
          },
        }}
        popoverProps={{ width: 800 }}
      />
      <p>选中值: {JSON.stringify(state.multipleValue)}</p>
    </>
  );
});
