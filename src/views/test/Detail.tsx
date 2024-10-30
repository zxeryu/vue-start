import { defineComponent, reactive, ref } from "vue";
import { css } from "@emotion/css";
import { useProRouter } from "@vue-start/pro";

export default defineComponent(() => {
  const { router } = useProRouter();

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
              router.back();
            }}>
            返回（tabs模式下 关闭 tab）
          </div>
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
            ]}
            sub
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
