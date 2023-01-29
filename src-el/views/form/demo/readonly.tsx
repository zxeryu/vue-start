import { defineComponent, reactive } from "vue";
import { columns, dataSource } from "@el/common/columns";
import { ProRadio } from "@vue-start/element-pro";
import { take } from "lodash";

export default defineComponent(() => {
  const state = reactive({ readonly: false });
  const formState = reactive({ ...dataSource[0] });

  return () => {
    return (
      <>
        <ProRadio
          v-model:modelValue={state.readonly}
          options={[
            { value: 111, label: "操作" },
            { value: 222, label: "只读" },
          ]}
          buttonStyle={"button"}
        />
        <br />
        <pro-form model={formState} columns={take(columns, 3)} readonly={state.readonly} labelWidth={80} />
      </>
    );
  };
});
