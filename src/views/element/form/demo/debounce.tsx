/*---
title: 防抖提交
desc: 延迟1000ms
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  return () => (
    <pro-form
      columns={columns}
      debounceSubmit={1000}
      operate={{}}
      onFinish={(values: Record<string, any>) => {
        console.log("values", values);
      }}
    />
  );
});
