import { defineComponent } from "vue";
import { useFetch } from "@vue-start/request";
import { userDetail } from "@/clients/client";
import { useProRouter } from "@vue-start/pro";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  const { router, route } = useProRouter();

  const { data, requesting } = useFetch(userDetail, {
    initEmit: true,
    params: () => ({ id: route.query.id }),
  });

  return () => {
    return (
      <pro-page title={"desc"} showBack loading={requesting.value}>
        <pro-desc columns={columns} model={data.data} />
        <pro-button
          onClick={() => {
            router.back();
          }}>
          back
        </pro-button>
      </pro-page>
    );
  };
});
