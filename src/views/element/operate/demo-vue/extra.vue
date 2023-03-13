<template>
  编辑-隐藏；删除-禁用
  <pro-operate :items="items" />
</template>

<script setup>
const items = [
  { label: "详情", value: "detail" },
  { label: "编辑", value: "edit", show: false },
  { label: "删除", value: "delete", disabled: true },
];
</script>
