import { defineComponent, Fragment } from "vue";
import { columns } from "@/common/columns";
import { CurdAction, ModalCurdOpe, ProCurdModalFormConnect } from "@vue-start/pro";
import { userAdd, userDel, userDetail, userEdit, userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";
import { css } from "@emotion/css";
import { CurdListPage } from "@/component/curd-list-page";

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
      // convertParams: (values: Record<string, any>, origin: Record<string, any>) => {
      //   return { body: { ...origin, ...values } };
      // },
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
      <pro-curd
        columns={columns}
        operates={operates}
        listProps={{
          addConfig: { inTable: true },
          tableProps: {
            column: { minWidth: 160 },
          },
        }}>
        <ModalCurdOpe />
        <CurdListPage />
        <ProCurdModalFormConnect />
      </pro-curd>
    );
  };
});
