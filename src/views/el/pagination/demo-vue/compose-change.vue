<template>
  <pro-pagination
    v-model:page="state.page"
    v-model:pageSize="state.pageSize"
    :total="100"
    background
    layout="total, sizes, prev, pager, next, jumper"
    @compose-change="handleComposeChange"
  />
</template>

<script setup>
import { reactive } from "vue";
const state = reactive({
  page: 1,
  pageSize: 10,
});

const handleComposeChange = (page, pageSize) => {
  console.log("#######", page, pageSize);
};
</script>
