<template>
  <pro-desc :model="data" :columns="columns">
    <template #label="item">
      <span v-if="item.dataIndex === 'name'" style="color: red">重写：{{ item.title }}</span>
      <span v-else>{{ item.title }}</span>
    </template>
    <template #value="value, item">
      <span v-if="item.dataIndex === 'name'" style="color: red">重写：{{ value }}</span>
      <span v-else>{{ value }}</span>
    </template>
  </pro-desc>
</template>

<script setup>
import { columns } from "@/common/columns";

const data = {
  id: "1",
  name: "aaa",
  age: 18,
  gender: "man",
  treeOperate: "v-1-1",
  birthday: "2020-01-01",
  checkbox: ["man", "other"],
  radio: "other",
  digitRange: [1, 10],
};
</script>
