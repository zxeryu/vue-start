/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const valueRef = ref(false);

  const handleClick = () => {
    valueRef.value = true;
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ value: "value", label: "open modal", onClick: handleClick }]} />
        <pro-modal v-model:visible={valueRef.value} title={"modal"}>
          <div>content</div>
        </pro-modal>
      </>
    );
  };
});
