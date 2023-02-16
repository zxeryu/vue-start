<template>
  <pro-curd :columns="reColumns">
    <ProCurdForm signName="signFlag" :operate="{}" @finish="handleFinish" />
  </pro-curd>
</template>

<script setup>
import { ProCurdForm } from "@vue-start/pro";
import { columns } from "@/common/columns";
import { get, map } from "lodash";

//覆盖columns中的值
const reState = {
  name: { signFlag: true, signFlagSort: 3 },
  age: { signFlag: true, signFlagSort: 2 },
  gender: { signFlag: true, signFlagSort: 1 },
};

//columns中的前3项目标记 form
const reColumns = map(columns, (item) => {
  return { ...item, ...get(reState, item.dataIndex) };
});

const handleFinish = (values) => {
  console.log(values);
};
</script>

<style scoped></style>
