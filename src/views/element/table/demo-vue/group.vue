<template>
  <pro-table :columns="columns" :dataSource="dataSource" />
</template>

<script setup>
import { dataSource, options, treeOptions } from "@/common/columns";

const columns = [
  {
    title: "第一部分",
    dataIndex: "aaa",
    children: [
      {
        title: "name",
        dataIndex: "name",
        formItemProps: {
          rules: [{ required: true, message: "请输入name" }],
        },
        formFieldProps: {},
        search: true,
        formExtra: true,
      },
      {
        title: "age",
        dataIndex: "age",
        valueType: "digit",
        formItemProps: {
          rules: [{ required: true, message: "请输入年龄" }],
        },
        formFieldProps: {},
      },
      {
        title: "checkbox",
        dataIndex: "checkbox",
        valueType: "checkbox",
        formFieldProps: {
          options,
        },
      },
    ],
  },
  {
    title: "treeSelect",
    dataIndex: "treeOperate",
    valueType: "treeSelect",
    formFieldProps: {
      data: treeOptions,
    },
  },
  {
    title: "gender",
    dataIndex: "gender",
    valueType: "select",
    formFieldProps: {
      options,
    },
    search: true,
  },
];
</script>
