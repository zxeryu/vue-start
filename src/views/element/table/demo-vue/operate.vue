<template>
  <pro-table :columns="columns" :dataSource="dataSource" :operate="operate">
    <template #operate-delete="record, item">
      <el-button type="danger" link :disabled="record.id === '1'" @click="handleDelete(item)">
        {{ item.label }}
      </el-button>
    </template>
  </pro-table>
</template>

<script setup>
import { columns, dataSource } from "@/common/columns";

const operate = {
  column: { minWidth: 140 },
  items: [
    {
      show: true,
      value: "detail",
      label: "详情",
      onClick: (record) => {
        console.log("detail", record);
      },
    },
    {
      //id为1 显示编辑按钮
      show: (record) => record.id === "1",
      value: "edit",
      label: "编辑",
      onClick: (record) => {
        console.log("edit", record);
      },
    },
    {
      show: true,
      value: "delete",
      label: "删除",
      //重写按钮
      //id为1 禁用删除按钮
    },
  ],
};

const handleDelete = (record) => {
  console.log("########", record);
};
</script>
