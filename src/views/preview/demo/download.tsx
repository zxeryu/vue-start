/*---
title: 下载
---*/
import { defineComponent, ref } from "vue";
import { endsWith, map } from "lodash";
import { css } from "@emotion/css";
import { TDownloadOptions } from "@vue-start/request";

export default defineComponent(() => {
  const names = ["test.jpg", "test.docx", "test.xlsx", "test.pdf", "test.doc"];

  const previewRef = ref();
  const currentRef = ref();
  const loadingRef = ref(false);

  let originRes: any;

  const items = map(names, (item) => ({
    label: item,
    value: item,
    onClick: () => {
      currentRef.value = item;
      originRes = null;
    },
  }));

  const downloadOptions: TDownloadOptions = {
    onStart: () => {
      originRes = null;
      loadingRef.value = true;
    },
    onSuccess: (res) => {
      originRes = res;
      loadingRef.value = false;
      if (endsWith(currentRef.value, ".doc")) {
        console.log("####### doc=", originRes);
      }
    },
    onFail: () => {
      loadingRef.value = false;
    },
  };

  const handleExport = () => {
    if (endsWith(currentRef.value, ".doc")) {
      previewRef.value?.download?.();
      return;
    }
    console.log("#######", originRes);
  };

  return () => {
    return (
      <>
        <pro-operate items={items} />
        {currentRef.value && (
          <pro-modal visible width={"80vw"} title={currentRef.value} onCancel={() => (currentRef.value = "")}>
            <pro-operate
              class={css({ position: "absolute", right: 100, top: 16 })}
              items={[
                { label: "导出", value: "export", onClick: handleExport, extraProps: { loading: loadingRef.value } },
              ]}
            />
            <pro-preview
              ref={previewRef}
              class={css({ width: "100%", height: "60vh", background: "#efefef" })}
              name={currentRef.value}
              actor={window.location.origin + "/res/" + currentRef.value}
              downloadOptions={downloadOptions}
            />
          </pro-modal>
        )}
      </>
    );
  };
});
