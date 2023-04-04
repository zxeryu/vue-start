/*---
title: 手动触发
desc: 提交按钮触发 onFinish
---*/
import { defineComponent, ref } from "vue";
import { columns } from "@/common/columns";
import { SearchMode } from "@vue-start/pro";

export default defineComponent(() => {
  const formRef = ref();

  const handleSubmit = (values: Record<string, any>) => {
    console.log("values", values);
  };

  return () => (
    <pro-search-form
      ref={formRef}
      searchMode={SearchMode.MANUAL}
      columns={columns}
      labelWidth={80}
      operate={{}}
      onFinish={handleSubmit}
    />
  );
});
