<template>
  <pro-radio v-model="valueRef" :options="options" buttonStyle="button" />
</template>

<script setup>
import { ref } from "vue";
import { options } from "@/common/columns";

const valueRef = ref();
</script>
