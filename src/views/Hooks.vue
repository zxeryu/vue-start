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
  <div>
    <div>useSet</div>
    {{ set }}
    <button @click="add('world')">add world</button>
    <button @click="add('hello')">add hello</button>
    <button @click="remove('hello')">remove hello</button>
    <button @click="reset()">reset</button>
    <button @click="has('hello')">has hello</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBoolean, useStorageState, useSet } from "@vue-start/hooks";

export default defineComponent({
  name: "Hooks",
  setup() {
    const [state, { setTrue, setFalse, toggle }] = useBoolean();
    const [message, setMessage] = useStorageState("message", "message");
    const [set, { add, remove, reset, has }] = useSet(["hello"]);

    return {
      //
      state,
      setTrue,
      setFalse,
      toggle,
      //
      message,
      setMessage,
      //
      set,
      add,
      remove,
      reset,
      has,
    };
  },
});
</script>

<style scoped></style>
