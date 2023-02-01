/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { columns } from "@el/common/columns";

export default defineComponent(() => {
  return () => (
    <pro-form
      columns={columns}
      labelWidth={80}
      operate={{}}
      onFinish={(values: Record<string, any>) => {
        console.log("values", values);
      }}
    />
  );
});
