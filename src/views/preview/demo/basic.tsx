/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { get, map } from "lodash";
import { css } from "@emotion/css";
import { useProConfig } from "@vue-start/pro";

export default defineComponent(() => {
  const { elementMap } = useProConfig();

  const names = [
    "test.jpg",
    "IMG_20211112_174146_478_0.jpg",
    "企业微信截图_16288170502889.png",
    "test.docx",
    "test.xls",
    "test.xlsx",
    "test.pdf",
    "test.doc",
  ];

  const currentRef = ref();

  const items = map(names, (item) => ({
    label: item,
    value: item,
    onClick: () => {
      currentRef.value = item;
    },
  }));

  return () => {
    return (
      <>
        <pro-operate items={items} />
        {currentRef.value && (
          <pro-modal visible width={"80vw"} title={currentRef.value} onCancel={() => (currentRef.value = "")}>
            <pro-preview
              class={css({ width: "100%", height: "60vh", background: "#efefef" })}
              Loading={get(elementMap, "loading")}
              name={currentRef.value}
              actor={window.location.origin + "/res/" + currentRef.value}
            />
          </pro-modal>
        )}
      </>
    );
  };
});
