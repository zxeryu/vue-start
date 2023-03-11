<template>
  <pro-pagination v-model:page="state.page" v-model:pageSize="state.pageSize" :total="50" />
</template>

<script setup>
import { reactive } from "vue";
const state = reactive({
  page: 1,
  pageSize: 10,
});
</script>
