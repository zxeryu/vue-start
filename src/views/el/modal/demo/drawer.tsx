/*---
title: ProDrawer
---*/

import { defineComponent, reactive, ref } from "vue";

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
        <pro-operate items={[{ value: "value", label: "open drawer", onClick: handleClick }]} />
        <pro-drawer v-model:visible={state.visible} title={"drawer"} confirmLoading={state.loading} onOk={handleOk}>
          <div>content</div>
          <div onClick={setLoading}>set loading</div>
        </pro-drawer>
      </>
    );
  };
});
