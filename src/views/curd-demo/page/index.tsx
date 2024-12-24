import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { CurdAction, useProRouter } from "@vue-start/pro";
import { userDel, userList } from "@/clients/client";
import { IRequestActor } from "@vue-start/request";

export default defineComponent(() => {
  const { router } = useProRouter();

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
      onClick: (record: Record<string, any>) => {
        router.push({ name: "CurdDemoPageDetail", query: { id: record.id } });
      },
    },
    {
      action: CurdAction.DELETE,
      actor: userDel,
      show: true,
    },
  ];

  return () => {
    return (
      <pro-curd columns={columns} operates={operates}>
        <pro-curd-list />
      </pro-curd>
    );
  };
});
