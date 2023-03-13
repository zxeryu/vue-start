/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { css } from "@emotion/css";

export default defineComponent(() => {
  return () => {
    return (
      <div
        class={css({
          ".pro-page": {
            height: "40vh !important",
            backgroundColor: "#eee",
          },
          ".pro-page .pro-page-content .page-content": {
            width: "unset",
            margin: "unset",
          },
        })}>
        <pro-page
          fillMode={false}
          title={"示例页面"}
          subTitle={"子标题"}
          showBack
          loading
          loadingOpts={{ background: "#eee" }}
          v-slots={{
            extra: () => <span>extra</span>,
          }}>
          <div>content</div>
        </pro-page>
      </div>
    );
  };
});
