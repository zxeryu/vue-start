<template>
  <pro-uploader
    v-model="valueRef"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :maxSize="1024 * 1024"
    :onErrorMsg="onErrorMsg"
  >
    上传
  </pro-uploader>
</template>

<script setup>
import { ref } from "vue";

const valueRef = ref([]);

const onErrorMsg = (type, msg) => {
  console.log("######onErrorMsg", type, msg);
};
</script>
