<template>
  <el-button @click="handleClick">set loading state</el-button>
  <pro-loading :loading="valueRef">
    <div style="height: 10vh; background-color: pink">content</div>
  </pro-loading>
</template>

<script setup>
import { ref } from "vue";

const valueRef = ref(true);

const handleClick = () => {
  valueRef.value = !valueRef.value;
};
</script>
