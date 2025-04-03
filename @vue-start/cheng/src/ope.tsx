import { defineComponent, reactive } from "vue";
import { css } from "@emotion/css";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { Atom } from "./comp/atom";
import { LeftRuler, TopRuler } from "./comp/ruler";

export const Ope = defineComponent(() => {
  const state = reactive({
    enable: true,
  });

  const getComp = useGetCompByKey();
  const Scroll = getComp(ElementKeys.ScrollKey);

  return () => {
    return (
      <Scroll class={"pro-cheng-ope"}>
        <div class={"pro-cheng-screen"}>
          <TopRuler class={"ruler top-ruler"} width={1920} height={20} />
          <LeftRuler class={"ruler left-ruler"} width={20} height={1080} />
          <button
            onClick={() => {
              state.enable = !state.enable;
            }}>
            change
          </button>

          <Atom class={css({ width: 100, height: 100, backgroundColor: "beige" })} id={"test2"} enable={state.enable}>
            <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本</div>
          </Atom>
        </div>
      </Scroll>
    );
  };
});
