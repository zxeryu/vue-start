/*---
title: ProShowOptions
---*/

import { defineComponent } from "vue";
import { ProShowOptions } from "@vue-start/pro";

export default defineComponent(() => {
  const options = [
    { value: "1", label: "1-label" },
    { value: "2", label: "2-label" },
  ];

  return () => {
    return (
      <>
        <ProShowOptions value={"1"} options={options} />
        <br />
        <br />
        多个值&nbsp;
        <ProShowOptions value={["1", "2"]} options={options} />
        <br />
        <br />
        颜色设置&nbsp; <ProShowOptions value={"1"} options={options} colorMap={{ "1": "red", "2": "green" }} />
      </>
    );
  };
});
