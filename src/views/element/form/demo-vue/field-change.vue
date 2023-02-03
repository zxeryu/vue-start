<template>
  <pro-form :model="formState" :columns="take(columns, 3)" :label-width="80" />
</template>

<script setup>
import { reactive } from "vue";
import { take } from "lodash";
import { columns } from "@/common/columns";
import { useWatch } from "@vue-start/hooks";

const formState = reactive({});

useWatch(
  () => {
    formState.age = undefined;
  },
  () => formState.gender,
);
</script>

<style scoped></style>
