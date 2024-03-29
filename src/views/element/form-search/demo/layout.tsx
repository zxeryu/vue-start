/*---
title: 布局自定义
desc: 本质上还是对Form的布局
---*/
import { defineComponent, ref } from "vue";
import { columns } from "@/common/columns";
import { SearchMode } from "@vue-start/pro";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const formRef = ref();

  const handleSubmit = (values: Record<string, any>) => {
    console.log("values", values);
  };

  return () => (
    <pro-search-form
      ref={formRef}
      class={css({
        ".pro-search-form-operate": {
          display: "flex",
          justifyContent: "center",
        },
      })}
      searchMode={SearchMode.MANUAL}
      initEmit={false}
      inline={false}
      columns={columns}
      row={{ gutter: 30 }}
      col={{ span: 8 }}
      operate={{}}
      onFinish={handleSubmit}
    />
  );
});
