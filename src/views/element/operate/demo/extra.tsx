/*---
title: 展示、禁用、tip
---*/
import { defineComponent } from "vue";

export default defineComponent(() => {
  const items = [
    { label: "详情", value: "detail" },
    { label: "编辑", value: "edit", show: false },
    { label: "删除", value: "delete", disabled: true, tip: "禁用删除" },
  ];

  return () => {
    return (
      <>
        <div>编辑-隐藏；删除-禁用</div>
        <br />
        <pro-operate items={items} />
      </>
    );
  };
});
