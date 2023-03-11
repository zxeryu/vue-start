/*---
title: 事件 compose-change
---*/
import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({
    page: 1,
    pageSize: 10,
  });

  const handleComposeChange = (page: number, pageSize: number) => {
    console.log("#######", page, pageSize);
  };

  return () => {
    return (
      <pro-pagination
        v-model:page={state.page}
        v-model:pageSize={state.pageSize}
        total={100}
        background
        layout={"total, sizes, prev, pager, next, jumper"}
        onComposeChange={handleComposeChange}
      />
    );
  };
});
