/*---
title: 基础使用
---*/

import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({
    page: 1,
    pageSize: 10,
  });

  return () => {
    return <pro-pagination v-model:page={state.page} v-model:pageSize={state.pageSize} total={50} />;
  };
});
