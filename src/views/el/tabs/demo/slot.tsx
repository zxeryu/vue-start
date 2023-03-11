/*---
title: 插槽
---*/

import { defineComponent, ref } from "vue";
import { options } from "@/common/columns";

export default defineComponent(() => {
  const valueRef = ref("man");

  return () => {
    return (
      <pro-tabs
        v-model:modelValue={valueRef.value}
        options={options}
        v-slots={{
          label: (item: any) => {
            if (item.value === "man") {
              return <> &copy;&hearts; 自定义 {item.label}</>;
            }
            return item.label;
          },
        }}
      />
    );
  };
});
