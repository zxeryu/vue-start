/*---
title: 基础使用
---*/

import { defineComponent, reactive } from "vue";

export default defineComponent(() => {
  const state = reactive({
    visible: false,
    loading: false,
  });

  const handleClick = () => {
    state.visible = true;
  };

  const setLoading = () => {
    state.loading = true;
    setTimeout(() => {
      state.loading = false;
    }, 2000);
  };

  const handleOk = () => {
    console.log("ok");
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ value: "value", label: "open modal", onClick: handleClick }]} />
        <pro-modal v-model:visible={state.visible} title={"modal"} confirmLoading={state.loading} onOk={handleOk}>
          <div>content</div>
          <div onClick={setLoading}>set loading</div>
        </pro-modal>
      </>
    );
  };
});
