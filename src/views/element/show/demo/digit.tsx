/*---
title: ProShowDigit
---*/

import { defineComponent } from "vue";
import { ProShowDigit } from "@vue-start/pro";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <ProShowDigit value={"12346525.123"} />
        <br />
        <br />
        小数位处理&nbsp;
        <ProShowDigit value={"12346525.123"} decimalFixed={2} />
        <br />
        <br />
        千分位处理&nbsp;
        <ProShowDigit value={"12346525.123"} thousandDivision />
      </>
    );
  };
});
