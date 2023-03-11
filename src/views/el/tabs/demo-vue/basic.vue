<template>
  <pro-tabs v-model="valueRef" :options="options" />
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref("man");
</script>
