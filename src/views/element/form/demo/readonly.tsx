/*---
title: 只读状态
---*/
import { defineComponent, reactive } from "vue";
import { columns, dataSource } from "@/common/columns";
import { ProRadio } from "@vue-start/element-pro";
import { take } from "lodash";

export default defineComponent(() => {
  const state = reactive({ readonly: false });
  const formState = reactive({ ...dataSource[0] });

  return () => {
    return (
      <>
        <ProRadio
          v-model={state.readonly}
          options={[
            { value: false as any, label: "操作" },
            { value: true, label: "只读" },
          ]}
          buttonStyle={"button"}
        />
        <br />
        <br />
        <pro-form model={formState} columns={take(columns, 3)} readonly={state.readonly} labelWidth={80} />
      </>
    );
  };
});
