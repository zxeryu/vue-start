import { defineComponent, ExtractPropTypes } from "vue";

const proPageHeaderProps = () => ({
  title: { type: String },
  subTitle: { type: String },
});

export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof proPageHeaderProps>>>;

export const PageHeader = defineComponent({
  props: {
    ...proPageHeaderProps(),
  },
  setup: (props, { slots, emit }) => {
    return () => {
      return (
        <div class={"pro-page-header"}>
          <div
            class={"pro-page-header-back"}
            onClick={() => {
              emit("back");
            }}>
            {slots.backIcon?.()}
          </div>
          <div class={"pro-page-header-title"}>{slots.title ? slots.title() : props.title}</div>
          <div class={"pro-page-header-sub-title"}>{slots.subTitle ? slots.subTitle() : props.subTitle}</div>
          <div class={"pro-page-header-space"}>{slots.space?.()}</div>
          <div class={"pro-page-header-extra"}>{slots.extra?.()}</div>
        </div>
      );
    };
  },
});

export const Page = defineComponent({
  props: {},
  setup: (props, { slots, emit }) => {
    return () => {
      return <div></div>;
    };
  },
});
