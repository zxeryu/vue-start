import { computed, defineComponent, ExtractPropTypes } from "vue";
import { ProDesc, ProDescProps } from "../../comp";
import { useProCurd } from "../ctx";
import { get, omit } from "lodash";
import { ProBaseProps } from "../../core";

const proCurdDescProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-curd-desc" },
  //标记名称 对应columns中的配置名称
  signName: { type: String },
});

export type ProCurdDescProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdDescProps>>> &
  ProBaseProps &
  ProDescProps;

export const ProCurdDesc = defineComponent<ProCurdDescProps>({
  props: {
    ...ProDesc.props,
    ...proCurdDescProps(),
  },
  setup: (props, { slots }) => {
    const { curdState, descColumns, getSignColumns } = useProCurd();

    const columns = computed(() => {
      if (props.signName) {
        return getSignColumns(props.signName);
      }
      return descColumns.value;
    });

    return () => {
      return (
        <ProDesc
          {...omit(props, "signName", "model", "columns")}
          model={props.model || curdState.detailData}
          columns={columns.value}
          v-slots={slots}
        />
      );
    };
  },
});

export const ProCurdDescConnect = defineComponent(() => {
  const { descProps } = useProCurd();
  return () => {
    return <ProCurdDesc {...omit(descProps?.value, "slots")} v-slots={get(descProps?.value, "slots")} />;
  };
});
