<template>
  <pro-operate :items="opeItems" />
  <pro-modal v-model:visible="valueRef" title="modal">
    <div>content</div>
  </pro-modal>
</template>

<script setup>
import { ref } from "vue";

const valueRef = ref(false);

const handleClick = () => {
  valueRef.value = true;
};

const opeItems = [{ value: "value", label: "open modal", onClick: handleClick }];
</script>
