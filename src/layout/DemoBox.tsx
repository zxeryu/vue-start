import { defineComponent, reactive } from "vue";

const ToolActions = defineComponent({
  props: {
    codeExpand: Boolean,
  },
  setup: (props, { emit }) => {
    const handleCodeExpand = () => {
      emit("update:codeExpand", !props.codeExpand);
    };

    return () => {
      return (
        <div style="display:flex;justify-content:center;border-top:1px dashed #f0f0f0;padding:12px 0">
          <span style="cursor:pointer" onClick={handleCodeExpand}>
            <img
              src={
                props.codeExpand
                  ? "https://gw.alipayobjects.com/zos/antfincdn/4zAaozCvUH/unexpand.svg"
                  : "https://gw.alipayobjects.com/zos/antfincdn/Z5c7kzvi30/expand.svg"
              }
              width={16}
              height={16}
            />
          </span>
        </div>
      );
    };
  },
});

export const DemoBox = defineComponent({
  props: {
    title: String,
    desc: String,
  },
  setup: (props, { slots }) => {
    const state = reactive({
      codeExpand: false,
    });

    return () => {
      return (
        <div style={"border:1px solid #f0f0f0;margin-bottom:20px"}>
          <div style={"padding:40px 20px"}>{slots.default?.()}</div>
          <div style={"padding:0 20px;line-height:2"}>
            <div style={""}>{props.title}</div>
            <div style={"white-space:pre-wrap"}>{props.desc}</div>
          </div>
          <ToolActions v-model:codeExpand={state.codeExpand} />
          {state.codeExpand && <div style={"padding:0 20px"}>{slots.codeStr?.()}</div>}
        </div>
      );
    };
  },
});
