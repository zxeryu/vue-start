<template>
  <pro-radio
    v-model="state.readonly"
    :options="[
      { value: false, label: '操作' },
      { value: true, label: '只读' },
    ]"
    optionType="button"
  />
  <br />
  <br />
  <pro-form :model="formState" :columns="take(columns, 3)" :readonly="state.readonly" :label-width="80" />
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";
import { take } from "lodash";
import { reactive } from "vue";

const state = reactive({ readonly: false });
const formState = reactive({ ...dataSource[0] });
</script>

<style scoped></style>
