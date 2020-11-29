<template>
  <div>
    <div>count:{{ count }}</div>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <div>age:{{ age }}</div>
    <button @click="add">add</button>
    <div>flag: {{ flag }}</div>
    <button @click="setFlag">setFlag</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, onUpdated } from "vue";
import { Actor, useStore, useStoreSelector } from "@vue-start/store";
import { useFlag } from "../store/StoreCurrent";

const useCount = () => {
  const count = ref(0);

  const increment = () => {
    count.value = count.value + 1;
  };
  const decrement = () => {
    count.value = count.value - 1;
  };

  return {
    count,
    increment,
    decrement,
  };
};

const testActor = Actor.of("test");

const ageAdd = testActor.named("$age").effectOn("$age", (state = 0) => {
  return state + 1;
});

export default defineComponent({
  name: "Counter",
  setup() {
    const { count, increment, decrement } = useCount();
    const age = useStoreSelector((state) => state.$age);
    const $store = useStore();

    const [flag, setFlag] = useFlag();

    return {
      count,
      increment,
      decrement,
      age,
      add: () => ageAdd.with({}).invoke($store),
      flag,
      setFlag: () => setFlag((prev) => !prev),
    };
  },
});
</script>

<style scoped></style>
