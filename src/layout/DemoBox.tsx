import { defineComponent, reactive } from "vue";

const ToolActions = defineComponent({
  props: {
    codeExpand: Boolean,
    codeExpandVue: Boolean,
  },
  setup: (props, { emit }) => {
    const handleCodeExpand = () => {
      const flag = !props.codeExpand;
      emit("update:codeExpand", flag);
      if (flag) {
        emit("update:codeExpandVue", false);
      }
    };

    const handleCodeExpandVue = () => {
      const flag = !props.codeExpandVue;
      emit("update:codeExpandVue", flag);
      if (flag) {
        emit("update:codeExpand", false);
      }
    };

    return () => {
      return (
        <div class={"flex justify-center"} style="border-top:1px dashed #f0f0f0;padding:12px 0">
          <div class="flex items-center cursor-pointer" onClick={handleCodeExpand}>
            <img
              src={
                props.codeExpand
                  ? "https://gw.alipayobjects.com/zos/antfincdn/4zAaozCvUH/unexpand.svg"
                  : "https://gw.alipayobjects.com/zos/antfincdn/Z5c7kzvi30/expand.svg"
              }
              width={16}
              height={16}
            />
            &nbsp;
            <span>jsx</span>
          </div>

          <div class="flex items-center ml-4 cursor-pointer" onClick={handleCodeExpandVue}>
            <img
              src={
                props.codeExpandVue
                  ? "https://gw.alipayobjects.com/zos/antfincdn/4zAaozCvUH/unexpand.svg"
                  : "https://gw.alipayobjects.com/zos/antfincdn/Z5c7kzvi30/expand.svg"
              }
              width={16}
              height={16}
            />
            &nbsp;
            <span>vue</span>
          </div>
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
      codeExpandVue: false,
    });

    return () => {
      return (
        <div style={"border:1px solid #f0f0f0;margin-bottom:20px"}>
          <div style={"padding:40px 20px"}>{slots.default?.()}</div>
          <div style={"padding:0 20px;line-height:2"}>
            <div style={""}>{props.title}</div>
            <div style={"white-space:pre-wrap"}>{props.desc}</div>
          </div>
          <ToolActions v-model:codeExpand={state.codeExpand} v-model:codeExpandVue={state.codeExpandVue} />
          {state.codeExpand && <div style={"padding:0 20px"}>{slots.codeStr?.()}</div>}
          {state.codeExpandVue && <div style={"padding:0 20px"}>{slots.codeStrVue?.()}</div>}
        </div>
      );
    };
  },
});
