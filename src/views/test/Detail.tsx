import { defineComponent, reactive, ref } from "vue";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const state = reactive({
    detail: false,
  });

  return () => {
    return (
      <>
        <pro-page showBack title={"Detail"} subTitle={"sub title"}>
          Detail
          <div
            onClick={() => {
              state.detail = !state.detail;
            }}>
            {state.detail ? "close" : "open"}
          </div>
        </pro-page>
        {state.detail && (
          <pro-page
            class={[
              css({
                backgroundColor: "pink",
              }),
              "pro-page-sub",
            ]}
            showBack
            title={"啦啦啦啦啦"}
            onBackClick={() => {
              state.detail = false;
            }}>
            <div>start</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div class={css({ lineHeight: "80px" })}>sub content</div>
            <div>end</div>
          </pro-page>
        )}
      </>
    );
  };
});
