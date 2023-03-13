<template>
  <pro-loading :loading="requesting">
    <pro-operate :items="[{ value: 'v', label: '列表请求', onClick: handleClick }]" />
    <div>total：{{ data?.data?.total }}</div>
    <div>
      {{
        join(
          map(data?.data?.list, (item) => item.name),
          ",",
        )
      }}
    </div>
  </pro-loading>
</template>

<script setup>
import { useFetch } from "@vue-start/request";
import { userList } from "@/clients/client";
import { join, map } from "lodash";

const { data, request, requesting } = useFetch(userList, {
  onSuccess: (actor) => {
    console.log("请求成功", actor.res?.data);
  },
  onFail: (actor) => {
    console.log("请求失败", actor.err);
  },
  onFinish: () => {
    console.log("请求完成");
  },
});

const handleClick = () => {
  request({ page: 1, pageSize: 10 });
};
</script>
