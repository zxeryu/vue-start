<template>
  <div>{{ JSON.stringify(config) }}}</div>
  <br />
  <br />
  <el-button @click="handleClick">变量</el-button>
</template>

<script setup>
import { useConfig } from "@vue-start/config";

const config = useConfig();

const handleClick = () => {
  console.log(config);
};
</script>

<style scoped></style>
