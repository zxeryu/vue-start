<template>
  <pro-table :columns="columns" :dataSource="dataSource">
    <template #bodyCell="{ value, column }">
      <span v-if="column.dataIndex === 'name'" style="color: red">重写：{{ value }}</span>
    </template>
    <template #headerCell="{ title, column }">
      <span v-if="column.dataIndex === 'name'" style="color: red">重写：{{ title }}</span>
      <span v-else>{{ title }}</span>
    </template>
  </pro-table>
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
</script>
