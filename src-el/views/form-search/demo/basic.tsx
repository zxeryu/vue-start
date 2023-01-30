/*---
title: 基础使用
desc: 直接触发 onFinish
---*/
import { defineComponent } from "vue";
import { columns } from "@el/common/columns";

export default defineComponent(() => {
  const handleSubmit = (values: Record<string, any>) => {
    console.log("values", values);
  };
  return () => <pro-search-form columns={columns} labelWidth={80} onFinish={handleSubmit} />;
});
