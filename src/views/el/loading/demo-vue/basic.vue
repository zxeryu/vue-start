<template>
  <pro-operate :items="opeItems" />
  <pro-loading :loading="valueRef">
    <div style="height: 10vh; background-color: pink">content</div>
  </pro-loading>
</template>

<script setup>
import { ref } from "vue";

const valueRef = ref(true);

const handleClick = () => {
  valueRef.value = !valueRef.value;
};

const opeItems = [{ value: "value", label: "set loading state", onClick: handleClick }];
</script>
