/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { find, get, map } from "lodash";
import { css } from "@emotion/css";
import { ElementKeys, useProConfig } from "@vue-start/pro";

const getBrowserInfo = () => {
  const userAgent = window.navigator.userAgent;
  const isWindows = userAgent.indexOf("Windows") > -1;
  const isMac = userAgent.indexOf("Macintosh") > -1;

  const arr = [
    { type: "Firefox", flag: "Firefox" },
    { type: "Edge", flag: "Edg/" },
    { type: "360", flag: "QIHU" },
    { type: "QQ", flag: "QQBrowser/" },
    { type: "Chrome", flag: "Chrome/" },
    { type: "Safari", flag: "Safari/" },
  ];

  //按顺序匹配
  const target = find(arr, (item) => userAgent.indexOf(item.flag) > 0) || { type: "Chrome" };
  return { ...target, isWindows, isMac };
};

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

  const browser = getBrowserInfo();
  const coverFlag = browser.type === "Chrome";

  return () => {
    return (
      <>
        <pro-operate items={items} />
        {currentRef.value && (
          <pro-modal visible width={"80vw"} title={currentRef.value} onCancel={() => (currentRef.value = "")}>
            <pro-preview
              class={css({ width: "100%", height: "60vh", background: "#efefef" })}
              Loading={get(elementMap, ElementKeys.LoadingKey)}
              name={currentRef.value}
              actor={window.location.origin + "/res/" + currentRef.value}
              subProps={{
                showNameCover: coverFlag,
                showDownloadCover: coverFlag,
              }}
            />
          </pro-modal>
        )}
      </>
    );
  };
});
