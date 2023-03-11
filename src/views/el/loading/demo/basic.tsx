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
        <el-button onClick={handleClick}>set loading state</el-button>
        <pro-loading loading={valueRef.value}>
          <div style={"height:10vh;background-color:pink"}>content</div>
        </pro-loading>
      </>
    );
  };
});
