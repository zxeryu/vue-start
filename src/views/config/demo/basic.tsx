/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { useConfig } from "@vue-start/config";

export default defineComponent(() => {
  const config = useConfig();

  const handleClick = () => {
    console.log(config);
  };

  return () => {
    return (
      <div>
        {JSON.stringify(config)}
        <br />
        <br />
        <pro-operate items={[{ value: "value", label: "变量", onClick: handleClick }]} />
      </div>
    );
  };
});
