<template>
  <pro-search-form :columns="columns" :label-width="80" @finish="handleSubmit" />
</template>

<script setup>
import { columns } from "@/common/columns";

const handleSubmit = (values) => {
  console.log("values", values);
};
</script>

<style scoped></style>
