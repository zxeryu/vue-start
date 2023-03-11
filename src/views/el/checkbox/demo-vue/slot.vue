<template>
  <pro-checkbox v-model="valueRef" :options="options" buttonStyle="button">
    <template #label="item">
      <span v-if="item.value === 'man'"> &copy;&hearts; 自定义 {{ item.label }} </span>
    </template>
  </pro-checkbox>
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref();
</script>
