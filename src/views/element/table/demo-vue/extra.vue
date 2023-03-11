<template>
  <pro-table
    serialNumber
    columnEmptyText="--"
    :column="{ align: 'center' }"
    :columns="columns"
    :dataSource="dataSource"
    :toolbar="{}"
  >
    <template #columnSetting-default>
      <span style="color: red">设置图标</span>
    </template>
  </pro-table>
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
</script>
