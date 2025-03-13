import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { CurdAction } from "@vue-start/pro";
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
      show: true,
    },
    {
      action: CurdAction.DELETE,
      actor: userDel,
      show: true,
      title: "删除当前用户？",
    },
  ];

  return () => {
    return (
      <pro-curd-module
        modalType={"page"}
        columns={columns}
        operates={operates}
        title={"用户"}
        // useMenuName
        subPageProps={{
          slots: {
            start: () => <div style={"height:200px;background:pink"}>start</div>,
            end: () => <div style={"height:200px;background:pink"}>end</div>,
          },
        }}
      />
    );
  };
});
