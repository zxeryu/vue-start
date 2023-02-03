<template>
  <div>
    <p>gender === man，age只读</p>
    <p>gender === woman，age禁用</p>
    <p>gender === other，age不渲染</p>
  </div>
  <br />
  <pro-form
    :model="formState"
    :columns="take(columns, 3)"
    :showStateRules="showStateRules"
    :readonlyStateRules="readonlyStateRules"
    :disableStateRules="disableStateRules"
    :label-width="80"
  />
</template>

<script setup>
import { reactive } from "vue";
import { take } from "lodash";
import { columns } from "@/common/columns";

const formState = reactive({
  name: "aaa",
  age: 18,
  gender: "man",
});

const showStateRules = {
  age: (record) => record.gender !== "other",
};

const readonlyStateRules = {
  age: (record) => record.gender === "man",
};

const disableStateRules = {
  age: (record) => record.gender === "woman",
};
</script>

<style scoped></style>
