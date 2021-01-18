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
  <div>
    <div>useClickAway</div>
    <div ref="refDom" style="padding: 10px; background-color: aqua">box （点击box之外的区域）</div>
  </div>
  <div>
    <div>useEventListener</div>
    <div ref="clickRefDom" style="padding: 10px; background-color: aqua">box2</div>
  </div>
  <div>
    <div>useHover</div>
    <div ref="hoverDomRef" style="padding: 10px; background-color: aqua">box3 isHover:{{ isHover }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import {
  useBoolean,
  useStorageState,
  useSet,
  useClickAway,
  useEventListener,
  useDocumentVisibility,
  useHover,
} from "@vue-start/hooks";

export default defineComponent({
  name: "Hooks",
  setup() {
    const [state, { setTrue, setFalse, toggle }] = useBoolean();
    const [message, setMessage] = useStorageState("message", "message");
    const [set, { add, remove, reset, has }] = useSet(["hello"]);

    const refDom = ref();
    useClickAway(() => {
      console.log(" outside ...");
    }, refDom);

    const clickRefDom = ref();
    useEventListener(
      "click",
      () => {
        console.log(" click ...");
      },
      { target: clickRefDom },
    );

    const visibility = useDocumentVisibility();

    watchEffect(() => {
      console.log("@@@@@@@@@@@@@visibility=", visibility.value);
    });

    const hoverDomRef = ref();
    const isHover = useHover(hoverDomRef);

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
      //
      refDom,
      //
      clickRefDom,
      //
      hoverDomRef,
      isHover,
    };
  },
});
</script>

<style scoped></style>
