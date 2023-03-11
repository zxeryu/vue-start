<template>
  <pro-select v-model="valueRef" :options="options">
    <template #label="item">
      <span v-if="item.value === 'man'"> &copy;&hearts; 自定义 {{ item.label }} </span>
    </template>
  </pro-select>
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref();
</script>
