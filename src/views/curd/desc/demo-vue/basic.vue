<template>
  <pro-curd :curdState="{ curdState }" :columns="{ columns }">
    <ProCurdDesc />
  </pro-curd>
</template>

<script setup>
import { reactive } from "vue";
import { columns } from "@/common/columns";
import { ProCurdDesc } from "@vue-start/pro";

const curdState = reactive({
  detailData: {
    id: "1",
    name: "aaa",
    age: 18,
    gender: "man",
    treeOperate: "v-1-1",
    birthday: "2020-01-01",
    checkbox: ["man", "other"],
    radio: "other",
    digitRange: [1, 10],
  },
});
</script>

<style scoped></style>
