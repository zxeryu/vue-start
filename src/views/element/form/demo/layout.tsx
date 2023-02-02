/*---
title: row col 布局
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return <pro-form columns={columns} row={{}} col={{ span: 8 }} />;
  };
});
