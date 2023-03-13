<template>
  <pro-operate :items="items" />
</template>

<script setup>
const items = [
  {
    label: "详情",
    value: "detail",
    onClick: () => {
      console.log("detail");
    },
  },
  { label: "编辑", value: "edit" },
  { label: "删除", value: "delete" },
];
</script>
