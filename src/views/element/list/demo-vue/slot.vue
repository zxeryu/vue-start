<template>
  <pro-list
    :searchProps="{ columns: searchColumns }"
    :tableProps="{ columns, dataSource }"
    :paginationProps="{ total: size(dataSource) }"
  >
    <template #start>
      <div style="color: red">插槽：start</div>
    </template>
    <template #divide>
      <div style="color: red">插槽：divide</div>
    </template>
    <template #divide2>
      <div style="color: red">插槽：divide2</div>
    </template>
    <template #end>
      <div style="color: red">插槽：end</div>
    </template>
  </pro-list>
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";

const searchColumns = take(columns, 3);
</script>
