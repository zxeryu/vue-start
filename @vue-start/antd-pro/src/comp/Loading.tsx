import { defineComponent } from "vue";
import { Spin, SpinProps } from "ant-design-vue";
import { omit } from "lodash";

export type ProLoadingProps = Omit<SpinProps, "spinning"> & { loading?: boolean };

export const Loading = defineComponent<ProLoadingProps>({
  props: {
    loading: Boolean,
    ...Spin.props,
  },
  setup: (props, { slots }) => {
    return () => {
      return <Spin spinning={props.loading} {...omit(props, "loading", "spinning")} v-slots={slots} />;
    };
  },
});
