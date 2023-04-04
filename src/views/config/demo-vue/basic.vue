<template>
  <div>{{ JSON.stringify(config) }}}</div>
  <br />
  <br />
  <pro-operate :items="opeItems" />
</template>

<script setup>
import { useConfig } from "@vue-start/config";

const config = useConfig();

const handleClick = () => {
  console.log(config);
};

const opeItems = [{ value: "value", label: "变量", onClick: handleClick }];
</script>

<style scoped></style>
