<template>
  <pro-radio v-model="valueRef" :options="options" optionType="button">
    <template #label="item">
      <span v-if="item.value === 'man'"> &copy;&hearts; 自定义 {{ item.label }} </span>
    </template>
  </pro-radio>
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref();
</script>
