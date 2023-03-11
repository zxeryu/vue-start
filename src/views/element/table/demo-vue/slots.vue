<template>
  <pro-table :columns="columns" :dataSource="dataSource">
    <template #name="{ row }">
      <div style="color: red">重写：{{ row.name }}</div>
    </template>
    <template #name-header>
      <div style="color: red">重写：名称</div>
    </template>
  </pro-table>
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
</script>
