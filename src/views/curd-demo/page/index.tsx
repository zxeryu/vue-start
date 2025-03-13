import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { CurdAction } from "@vue-start/pro";
import { userDel, userList } from "@/clients/client";
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
      // routeOpts: (record:Record<string, any>) => ({ name: "CurdDemoPageDetail", query: {id:record.id} }),
      routeOpts: { name: "CurdDemoPageDetail", query: ["id"] },
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
