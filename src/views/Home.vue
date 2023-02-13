<template>
  <div>Home</div>
  {{ config }}
  <pro-form :columns="columns" @finish="handleSubmit" :operate="{}" />
  <PPForm ref="formRef" @finish="handleSubmit">
    <el-form-item label="aaaa">
      <el-input />
    </el-form-item>
  </PPForm>
  <el-button @click="handleClick">submit</el-button>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useConfig } from "@vue-start/config";
import { ProForm as PPForm } from "@vue-start/element-pro";

const config = useConfig();

const formRef = ref();

const handleSubmit = (values) => {
  console.log("##########", values);
};

const handleClick = () => {
  formRef.value?.submit();
};

const columns = [
  { title: "111", dataIndex: "111" },
  { title: "222", dataIndex: "222" },
];
</script>
