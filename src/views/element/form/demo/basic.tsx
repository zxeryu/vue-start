/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  return () => (
    <pro-form
      columns={columns}
      operate={{}}
      onFinish={(values: Record<string, any>) => {
        console.log("values", values);
      }}
    />
  );
});
