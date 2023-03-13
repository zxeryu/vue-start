<template>
  <pro-list
    :searchProps="{ columns: searchColumns }"
    :tableProps="{ columns, dataSource }"
    :paginationProps="{ total: size(dataSource) }"
    @search="handleSearch"
  />
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";

const searchColumns = take(columns, 3);

const handleSearch = (values) => {
  console.log("values", values);
};
</script>
