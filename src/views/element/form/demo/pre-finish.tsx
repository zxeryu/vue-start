/*---
title: onPreFinish校验
---*/
import { defineComponent, reactive } from "vue";
import { columns } from "@/common/columns";
import { take } from "lodash";
import { useProMsg } from "@vue-start/pro";

export default defineComponent(() => {
  const showMsg = useProMsg();
  const formState = reactive({});

  const handlePreFinish = (values: Record<string, any>) => {
    if (values.gender === "man") {
      showMsg({type:"error",message:"选Man就是不行！"})
      return true;
    }
  };

  return () => (
    <pro-form
      model={formState}
      columns={take(columns, 3)}
      operate={{}}
      onPreFinish={handlePreFinish}
      onFinish={(values: Record<string, any>) => {
        console.log("values", values);
      }}
    />
  );
});
