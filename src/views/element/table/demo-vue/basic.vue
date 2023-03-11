<template>
  <pro-table :columns="columns" :dataSource="dataSource" />
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
</script>
