import { computed, defineComponent } from "vue";
import { Typography } from "./Typography";
import { get, isArray, join, map } from "lodash";
import { listToOptionsMap } from "@vue-start/hooks";

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
    options: Array,
  },
  setup: (props) => {
    const optionsMap = computed(() => {
      return listToOptionsMap(props.options, { value: "value", label: "label" });
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
