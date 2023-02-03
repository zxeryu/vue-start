<template>
  <pro-form :columns="columns" :label-width="80" :operate="{}" @finish="handleFinish" />
</template>

<script setup>
import { columns } from "@/common/columns";

const handleFinish = (values) => {
  console.log("values", values);
};
</script>

<style scoped></style>
