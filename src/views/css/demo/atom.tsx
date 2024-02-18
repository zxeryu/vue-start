/*---
title: 原子 cls
---*/
import { defineComponent } from "vue";

export default defineComponent(() => {
  return () => {
    return (
      <>
        flex
        <br />
        <div class={"flex justify-between"} css={{ fontSize: 16 }}>
          <div>item-1</div>
          <div>item-2</div>
          <div>item-3</div>
        </div>
        <br />
        grid
        <br />
        <div
          class={"grid"}
          css={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", "& > *": { textAlign: "center", fontSize: 16 } }}>
          <div>item-1</div>
          <div>item-2</div>
          <div>item-3</div>
        </div>
      </>
    );
  };
});
