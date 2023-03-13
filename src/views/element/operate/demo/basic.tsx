/*---
title: 基础使用
---*/
import { defineComponent } from "vue";

export default defineComponent(() => {
  const items = [
    {
      label: "详情",
      value: "detail",
      onClick: () => {
        console.log("detail");
      },
    },
    { label: "编辑", value: "edit" },
    { label: "删除", value: "delete" },
  ];

  return () => {
    return <pro-operate items={items} />;
  };
});
