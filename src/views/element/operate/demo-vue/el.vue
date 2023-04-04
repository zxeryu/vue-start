<template>
  <div>此处使用'ProConfig'仅为举例，正常情况应注册到全局'ProConfig'中</div>
  <ProConfig :elementMap="{ 'my-operate-key': TableOperateItem }">
    <pro-operate :items="items" elementKey="my-operate-key" />
  </ProConfig>
</template>

<script setup>
import { ProConfig } from "@vue-start/pro";
import { TableOperateItem } from "@/component/Table";

const items = [
  { label: "详情", value: "detail" },
  { label: "编辑", value: "edit" },
  { label: "删除", value: "delete" },
];
</script>
