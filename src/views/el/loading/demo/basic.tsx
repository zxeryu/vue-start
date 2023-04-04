/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const valueRef = ref(true);

  const handleClick = () => {
    valueRef.value = !valueRef.value;
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ value: "value", label: "set loading state", onClick: handleClick }]} />
        <pro-loading loading={valueRef.value}>
          <div style={"height:10vh;background-color:pink"}>content</div>
        </pro-loading>
      </>
    );
  };
});
