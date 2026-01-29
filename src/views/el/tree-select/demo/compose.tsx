/*---
title: 组合
---*/

import { defineComponent, reactive, ref } from "vue";
import { treeOptions } from "@/common/columns";
import { useUpdateKey, useWatch } from "@vue-start/hooks";

export default defineComponent(() => {
  const valueRef = ref();
  const [key, updateKey] = useUpdateKey();

  useWatch(() => {
    console.log("valueRef.value: ", valueRef.value);
  }, [valueRef]);

  const formState = reactive({});

  const columns = [
    { title: "emitPath", dataIndex: "emitPath", valueType: "switch" },
    { title: "multiple", dataIndex: "multiple", valueType: "switch" },
    { title: "separator$", dataIndex: "separator$" },
    { title: "itemSeparator$", dataIndex: "itemSeparator$" },
  ];

  useWatch(() => {
    valueRef.value = undefined;
    updateKey();
  }, [formState]);

  const opeItems = [{ label: "update", value: "update", onClick: () => updateKey() }];

  return () => {
    return (
      <>
        <pro-tree-select key={key.value} v-model={valueRef.value} options={treeOptions} {...formState} />
        <pro-operate style={{ margin: "16px 0" }} items={opeItems} />
        <div>条件设置</div>
        <pro-form model={formState} columns={columns} />
      </>
    );
  };
});
