<template>
  hooks
  <div>
    useBoolean
    {{ state }}
    <button @click="setTrue">setTrue</button>
    <button @click="setFalse">setFalse</button>
    <button @click="toggle()">toggle</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToggle, useBoolean } from "@vue-start/hooks";

export default defineComponent({
  name: "Hooks",
  setup() {
    const [state, { setTrue, setFalse, toggle }] = useBoolean();

    return {
      state,
      setTrue,
      setFalse,
      toggle,
    };
  },
});
</script>

<style scoped></style>
