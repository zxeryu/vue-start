/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { ProCurdForm } from "@vue-start/pro";

export default defineComponent(() => {
  const handleFinish = (values: Record<string, any>) => {
    console.log(values);
  };

  return () => {
    return (
      <pro-curd columns={columns}>
        <ProCurdForm
          operate={{}}
          // @ts-ignore
          onFinish={handleFinish}
        />
      </pro-curd>
    );
  };
});
