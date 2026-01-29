/*---
title: 组合
---*/

import { defineComponent, reactive, ref } from "vue";
import { options } from "@/common/columns";
import { useUpdateKey, useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  const valueRef = ref();
  const [key, updateKey] = useUpdateKey();

  useWatch(() => {
    console.log("valueRef.value: ", valueRef.value);
  }, [valueRef]);

  const formState = reactive({});

  const columns = [
    { title: "multiple", dataIndex: "multiple", valueType: "switch" },
    { title: "separator$", dataIndex: "separator$" },
  ];

  useWatch(() => {
    valueRef.value = undefined;
    updateKey();
  }, [formState]);

  const opeItems = [{ label: "update", value: "update", onClick: () => updateKey() }];

  return () => {
    return (
      <>
        <pro-select key={key.value} v-model={valueRef.value} options={options} {...formState} />
        <pro-operate style={{ margin: "16px 0" }} items={opeItems} />
        <div>条件设置</div>
        <pro-form model={formState} columns={columns} />
      </>
    );
  };
});
