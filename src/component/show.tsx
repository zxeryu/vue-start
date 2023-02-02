import { computed, defineComponent } from "vue";
import { Typography } from "./Typography";
import { ElInput, ElInputNumber } from "element-plus";
import { ProSelect } from "@vue-start/element-pro";
import { get, isArray, join, map, reduce } from "lodash";

export const BaseShow = defineComponent({
  props: {
    value: [String, Number, Boolean, Array, Object],
    showProps: Object,
  },
  setup: (props) => {
    return () => {
      return <Typography {...props.showProps}>{props.value}</Typography>;
    };
  },
});

export const TextShow = defineComponent({
  props: {
    ...BaseShow.props,
    ...ElInput.props,
  },
  setup: (props) => {
    return () => {
      return <BaseShow value={props.value} showProps={props.showProps} />;
    };
  },
});

export const TextNumberShow = defineComponent({
  props: {
    ...BaseShow.props,
    ...ElInputNumber.props,
  },
  setup: (props) => {
    return () => {
      return <BaseShow value={props.value} showProps={props.showProps} />;
    };
  },
});

export const SelectShow = defineComponent({
  props: {
    ...BaseShow.props,
    ...ProSelect.props,
  },
  setup: (props) => {
    const optionsMap = computed(() => {
      return reduce(props.options, (pair, item) => ({ ...pair, [item.value]: item.label }), {});
    });

    const valueStr = computed(() => {
      if (isArray(props.value)) {
        return join(
          map(props.value, (item) => get(optionsMap.value, item)),
          ",",
        );
      }
      return get(optionsMap.value, props.value);
    });

    return () => {
      return <BaseShow value={valueStr.value} showProps={props.showProps} />;
    };
  },
});
