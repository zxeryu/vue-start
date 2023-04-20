/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const valueRef = ref([]);

  return () => {
    console.log("file", valueRef.value);
    return (
      <pro-uploader
        v-model={valueRef.value}
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        maxSize={1024 * 1024}
        onErrorMsg={(type: string, msg: string) => {
          console.log("######onErrorMsg", type, msg);
        }}>
        上传
      </pro-uploader>
    );
  };
});
