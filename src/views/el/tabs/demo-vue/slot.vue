<template>
  <pro-tabs v-model="valueRef" :options="options">
    <template #label="item">
      <span v-if="item.value === 'man'"> &copy;&hearts; 自定义 {{ item.label }} </span>
      <span v-else> {{ item.label }} </span>
    </template>
  </pro-tabs>
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref("man");
</script>
