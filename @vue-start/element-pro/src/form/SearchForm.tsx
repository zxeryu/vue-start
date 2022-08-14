import { defineComponent, reactive, ref } from "vue";
import { keys, omit, pick } from "lodash";
import { ProSearchForm as ProSearchFormOrigin, ProSearchFormProps as ProSearchFormPropsOrigin } from "@vue-start/pro";
import { ProForm, ProFormProps } from "./Form";

export type ProSearchFormProps = ProSearchFormPropsOrigin &
  Omit<ProFormProps, "inline"> & {
    inline?: boolean;
  };

export const ProSearchForm = defineComponent<ProSearchFormProps>({
  inheritAttrs: false,
  props: {
    ...omit(ProForm.props, "inline"),
    ...omit(ProSearchFormOrigin.props, "model", "columns"),
    inline: { type: Boolean, default: true },
  } as any,
  setup: (props, { slots, attrs }) => {
    const formRef = ref();

    const formState = props.model || reactive({});

    const originKeys = keys(omit(ProSearchFormOrigin.props, "model", "columns"));

    return () => {
      return (
        <>
          <ProForm
            ref={formRef}
            {...attrs}
            {...omit(props, ...originKeys, "needRules", "model")}
            model={formState}
            needRules={false}
            v-slots={slots}
          />
          <ProSearchFormOrigin
            {...pick(props, originKeys)}
            model={formState}
            columns={props.columns}
            //@ts-ignore
            onFinish={() => {
              formRef.value?.submit();
            }}
          />
        </>
      );
    };
  },
});
