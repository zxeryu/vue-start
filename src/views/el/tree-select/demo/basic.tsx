/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { treeOptions } from "@/common/columns";
import { useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  const valueRef = ref();

  useWatch(() => {
    console.log("valueRef.value: ", valueRef.value);
  }, [valueRef]);

  return () => {
    return <pro-tree-select v-model={valueRef.value} options={treeOptions} />;
  };
});
