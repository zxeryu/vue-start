/*---
title: ProShowText
---*/

import { defineComponent } from "vue";
import { ProShowText } from "@vue-start/pro";
import { css } from "@emotion/css";

export default defineComponent(() => {
  return () => {
    return (
      <div class={css({ width: 300 })}>
        <ProShowText value={"这是一段文本内容文本内容文本内容文本内容"} />
        <br />
        <br />
        <ProShowText
          value={"这是一段文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容"}
          showProps={{ ellipsis: true, popoverProps: {} }}
        />
      </div>
    );
  };
});
