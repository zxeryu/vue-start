<template>
  <pro-curd :columns="columns">
    <ProCurdForm :operate="{}" @finish="handleFinish" />
  </pro-curd>
</template>

<script setup>
import { ProCurdForm } from "@vue-start/pro";
import { columns } from "@/common/columns";

const handleFinish = (values) => {
  console.log(values);
};
</script>

<style scoped></style>
