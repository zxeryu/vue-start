/*---
title: 列表
---*/

import { defineComponent, ref } from "vue";
import { get, map } from "lodash";
import { css } from "@emotion/css";
import { useProConfig } from "@vue-start/pro";

export default defineComponent(() => {
  const { elementMap } = useProConfig();

  const names = ["test.jpg", "IMG_20211112_174146_478_0.jpg", "test.docx", "test.xls"];

  const showRef = ref(false);
  const currentRef = ref(names[0]);

  const items = map(names, (item) => ({
    label: item,
    value: item,
    onClick: () => {
      currentRef.value = item;
    },
  }));

  const handleShow = () => {
    showRef.value = true;
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ label: "预览列表", value: "list", onClick: handleShow }]} />
        {showRef.value && (
          <pro-modal visible width={"80vw"} title={currentRef.value} onCancel={() => (showRef.value = false)}>
            <pro-preview
              key={currentRef.value}
              class={css({ width: "100%", height: "60vh", background: "#efefef" })}
              Loading={get(elementMap, "loading")}
              name={currentRef.value}
              actor={window.location.origin + "/res/" + currentRef.value}
            />
            <pro-operate items={items} />
          </pro-modal>
        )}
      </>
    );
  };
});
