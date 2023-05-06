/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { Map } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const handleClick = (e: any) => {
    console.log("map click", e);
  };

  const events = [{ type: "click", handler: handleClick }] as any;

  return () => {
    return <Map class={css({ height: 400 })} events={events} />;
  };
});
