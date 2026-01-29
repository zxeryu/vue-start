/*---
title: value 转换，parseValue$、formatValue$
desc: 优先级最高
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
    return (
      <pro-tree-select
        v-model={valueRef.value}
        options={treeOptions}
        multiple
        // 解析
        parseValue$={(v: string) => {
          if (!v) return [];
          return v.split(",");
        }}
        // 转换
        formatValue$={(v: string[]) => {
          if (!v) return "";
          return v.join(",");
        }}
      />
    );
  };
});
