/*---
title: 自定义
desc: trigger 插槽、选择列表自定义
---*/
import { defineComponent, reactive } from "vue";
import { CurdAction } from "@vue-start/pro";
import { userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";
import { indexOf, map } from "lodash";
import { css } from "@emotion/css";

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
    value: undefined as number | undefined,
  });

  return () => (
    <>
      <pro-table-select
        v-model={state.value}
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
            slots: {
              //重写列表
              table: (opts: any, tableOpts: any) => {
                //选择配置
                const rowSelection = tableOpts.rowSelection;

                //列表数据
                const list = tableOpts.dataSource;
                //选中keys
                const selectedRowKeys = rowSelection?.selectedRowKeys || [];

                return (
                  <div>
                    {map(list, (item) => {
                      return (
                        <div
                          class={css({
                            cursor: "pointer",
                            lineHeight: 2,
                            color: indexOf(selectedRowKeys, item.id) > -1 ? "var(--pro-color-primary)" : undefined,
                          })}
                          onClick={() => {
                            rowSelection?.onChange?.(item.id, item);
                          }}>
                          {item.name}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
          },
        }}
        onChange={(val: any, opts: any) => console.log("onChange", val, opts)}
        v-slots={{
          trigger: (props: any) => (
            <pro-operate
              items={[
                {
                  label: props.label || props.placeholder,
                  onClick: props.onClick,
                },
              ]}
            />
          ),
        }}
      />
      <p>选中值: {state.value}</p>
    </>
  );
});
