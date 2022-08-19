import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { useEffect } from "@vue-start/hooks";
import { generateId } from "@vue-start/pro";
import { ElLoading } from "element-plus";
import { isString } from "lodash";

export const createLoadingId = (prefix = "comp") => {
  return prefix + "-" + generateId();
};

const proLoadingProps = () => ({
  loading: { type: Boolean },
  target: { type: [String, Object] as PropType<string | HTMLElement> },
  body: { type: Boolean },
  fullscreen: { type: Boolean },
  lock: { type: Boolean },
  text: { type: String },
  spinner: { type: String },
  background: { type: String },
  customClass: { type: String },
});

export type ProLoadingProps = Partial<ExtractPropTypes<ReturnType<typeof proLoadingProps>>>;

export const ProLoading = defineComponent<ProLoadingProps>({
  props: {
    ...proLoadingProps(),
  } as any,
  setup: (props, { slots }) => {
    const id = createLoadingId();

    useEffect(
      () => {
        if (!props.loading) {
          return;
        }

        let element: any = props.target;

        if (!slots.default) {
          //监听
          if (props.target && isString(props.target)) {
            element = document.querySelector("#" + props.target);
          }
        } else {
          //包裹
          element = document.getElementById(id);
        }

        if (!element) {
          return;
        }
        const instance = ElLoading.service({
          target: element,
          body: props.body,
          fullscreen: props.fullscreen,
          lock: props.lock,
          text: props.text,
          spinner: props.spinner,
          background: props.background,
          customClass: props.customClass,
        });
        return () => {
          instance && instance.close();
        };
      },
      () => props.loading,
    );

    return () => {
      if (!slots.default) {
        return null;
      }
      return <div id={id}>{slots.default()}</div>;
    };
  },
});
