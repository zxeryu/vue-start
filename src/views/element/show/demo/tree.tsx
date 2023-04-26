/*---
title: ProShowTree
---*/

import { defineComponent } from "vue";
import { ProShowTree } from "@vue-start/pro";

export default defineComponent(() => {
  const options = [
    {
      id: "1",
      label: "1-label",
      children: [
        { id: "1-1", label: "1-1-label" },
        { id: "2-1", label: "2-1-label" },
      ],
    },
    { id: "2", label: "2-label" },
  ];

  return () => {
    return (
      <>
        <ProShowTree value={"1-1"} options={options} />
        <br />
        <br />
        多个值&nbsp;
        <ProShowTree value={["1-1", "2-1"]} options={options} />
        <br />
        <br />
        分隔符&nbsp;
        <ProShowTree value={["1-1", "2-1"]} options={options} splitStr={","} />
      </>
    );
  };
});
