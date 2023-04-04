<template>
  <pro-form :columns="take(columns, 3)" :operate="{}" @finish="handleFinish">
    <template #age="_, state">
      <pro-form-item name="age" label="age">
        <pro-input-number v-model="state.age" />
      </pro-form-item>
    </template>
    <template #gender>
      <div>gender重写</div>
    </template>
  </pro-form>
</template>

<script setup>
import { take } from "lodash";
import { columns } from "@/common/columns";

const handleFinish = (values) => {
  console.log("values", values);
};
</script>

<style scoped></style>
