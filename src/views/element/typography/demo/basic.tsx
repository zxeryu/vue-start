/*---
title: Typography
---*/

import { defineComponent } from "vue";
import { css } from "@emotion/css";

export default defineComponent(() => {
  return () => {
    return (
      <div class={css({ width: 300 })}>
        <pro-typography content={"这是一段文本内容"} />
        <br />
        <pro-typography content={"这是一段单行文本，文本内容文本内容文本内容文本内容文本内容文本内容"} ellipsis />
        <br />
        <pro-typography
          content={
            "这是一段两行文本，文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容"
          }
          ellipsis={{ rows: 2 }}
        />
        <br />
        <pro-typography
          content={"这是一段可展示Popover的文本，文本内容文本内容文本内容文本内容文本内容文本内容"}
          ellipsis
          popoverProps={{}}
        />
      </div>
    );
  };
});
