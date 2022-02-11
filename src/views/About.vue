<template>
  <div>About</div>
  <div>{{ state.age }}</div>
  <button @click="onChange">change</button>
</template>
<script>
import { defineComponent } from "vue";
import { useState } from "@vue-start/hooks";

export default defineComponent(() => {
  const [state] = useState({ age: 0 });

  const onChange = () => {
    state.age++;
  };

  return {
    state,
    onChange,
  };
});
</script>
