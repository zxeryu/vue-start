/*---
title: 组合
---*/
import { defineComponent, reactive, ref } from "vue";
import { CurdAction } from "@vue-start/pro";
import { userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";
import { useUpdateKey, useWatch } from "@vue-start/hooks";

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
  const valueRef = ref();
  const [key, updateKey] = useUpdateKey();

  useWatch(() => {
    console.log("valueRef.value: ", valueRef.value);
  }, [valueRef]);

  const formState = reactive({});

  const formColumns = [
    { title: "multiple", dataIndex: "multiple", valueType: "switch" },
    { title: "separator$", dataIndex: "separator$" },
  ];

  useWatch(() => {
    valueRef.value = undefined;
    updateKey();
  }, [formState]);

  const opeItems = [{ label: "reset", value: "reset", onClick: () => updateKey() }];

  return () => {
    return (
      <>
        <pro-table-select
          key={key.value}
          v-model={valueRef.value}
          options={[
            { name: "用户1", id: "1" },
            { name: "用户2", id: "2" },
          ]}
          fieldNames={{ value: "id", label: "name" }}
          {...formState}
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
        />
        <pro-operate style={{ margin: "16px 0" }} items={opeItems} />
        <div>条件设置</div>
        <pro-form model={formState} columns={formColumns} />
      </>
    );
  };
});