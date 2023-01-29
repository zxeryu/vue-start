/*---
title: 表单项联动
desc: gender切换age设置为空
---*/
import { defineComponent, reactive } from "vue";
import { take } from "lodash";
import { columns } from "@el/common/columns";
import { useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  const formState = reactive<{ age?: number; gender?: string }>({});

  useWatch(
    () => {
      formState.age = undefined;
    },
    () => formState.gender,
  );

  return () => {
    return <pro-form model={formState} columns={take(columns, 3)} labelWidth={80} />;
  };
});
