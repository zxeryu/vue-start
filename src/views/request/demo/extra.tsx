/*---
title: 直接发起请求，deps监听
---*/
import { defineComponent, reactive } from "vue";
import { useFetch } from "@vue-start/request";
import { userList } from "@/clients/client";
import { join, map } from "lodash";

export default defineComponent(() => {
  const state = reactive({ page: 1, pageSize: 10 });

  const { data, requesting } = useFetch(userList, {
    params: () => ({ ...state }),
    initEmit: true, //初始化的时候发起请求
    deps: [() => state.page], //state的page字段改变时 发起请求
  });

  const handleClick = () => {
    state.page = state.page === 1 ? 2 : 1;
  };

  return () => {
    return (
      <pro-loading loading={requesting.value}>
        <pro-operate items={[{ value: "value", label: "列表请求", onClick: handleClick }]} />
        <div>total：{data?.data?.total}</div>
        <div>
          {join(
            map(data?.data?.list, (item) => item.name),
            ",",
          )}
        </div>
      </pro-loading>
    );
  };
});
