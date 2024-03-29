import { defineComponent } from "vue";
import { AddButton, CurdAction, ProCurdModalFormConnect } from "@vue-start/pro";
import { columns } from "@/common/columns";
import { userAdd, userDel, userDetail, userEdit, userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";

export default defineComponent(() => {
  const operates = [
    {
      action: CurdAction.LIST,
      actor: userList,
      convertData: (actor: IRequestActor) => {
        const data = actor.res?.data?.data;
        return { total: data?.total, dataSource: data?.list };
      },
    },
    {
      action: CurdAction.DETAIL,
      actor: userDetail,
      convertData: (actor: IRequestActor) => {
        return actor.res?.data?.data;
      },
      show: true,
    },
    {
      action: CurdAction.ADD,
      actor: userAdd,
      convertParams: (body: Record<string, any>) => ({ body }),
      show: true,
    },
    {
      action: CurdAction.EDIT,
      actor: userEdit,
      convertParams: (values: Record<string, any>, origin: Record<string, any>) => {
        return { body: { ...origin, ...values } };
      },
      show: true,
    },
    {
      action: CurdAction.DELETE,
      actor: userDel,
      show: true,
    },
  ];

  return () => {
    return (
      <pro-modal-curd columns={columns} operates={operates}>
        <pro-curd-list
          // searchInTable
          // addConfig={{ inTable: true, inSearch: true }}
          tableProps={{
            // toolbar: { columnSetting: {} },
            operate: {
              column: { minWidth: 120 },
            },
          }}
        />
        <ProCurdModalFormConnect />
      </pro-modal-curd>
    );
  };
});
