<template>
  hooks
  <div>
    <div>useBoolean</div>
    {{ state }}
    <button @click="setTrue">setTrue</button>
    <button @click="setFalse">setFalse</button>
    <button @click="toggle()">toggle</button>
  </div>
  <div>
    <div>useStorageState</div>
    {{ message }}
    <button @click="setMessage('hello')">set hello</button>
    <button @click="setMessage('world')">set world</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBoolean, useStorageState } from "@vue-start/hooks";

export default defineComponent({
  name: "Hooks",
  setup() {
    const [state, { setTrue, setFalse, toggle }] = useBoolean();
    const [message, setMessage] = useStorageState("message", "message");

    return {
      state,
      setTrue,
      setFalse,
      toggle,
      message,
      setMessage,
    };
  },
});
</script>

<style scoped></style>
