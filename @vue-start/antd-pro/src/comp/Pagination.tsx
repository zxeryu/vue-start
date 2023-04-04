import { defineComponent, ref } from "vue";
import { Pagination as PaginationOrigin } from "ant-design-vue";
import { useWatch } from "@vue-start/hooks";
import { debounce, omit } from "lodash";

export const Pagination = defineComponent({
  props: {
    ...PaginationOrigin.props,
    page: { type: Number, default: 1 },
  },
  setup: (props, { slots, emit }) => {
    const current = ref(props.page);
    const pageSize = ref(props.pageSize);

    //同步page
    useWatch(
      () => {
        if (current.value !== props.page) {
          current.value = props.page;
        }
      },
      () => props.page,
    );
    //同步pageSize
    useWatch(
      () => {
        if (pageSize.value !== props.pageSize) {
          pageSize.value = props.pageSize;
        }
      },
      () => props.pageSize,
    );

    const debounceChange = debounce(() => {
      emit("composeChange", current.value, pageSize.value);
    }, 300);

    const handleChange = () => {
      debounceChange();
      emit("update:page", current.value);
    };
    const handleSizeChange = () => {
      debounceChange();
      emit("update:pageSize", pageSize.value);
    };

    return () => {
      return (
        <PaginationOrigin
          v-model:current={current.value}
          v-model:pageSize={pageSize.value}
          onChange={handleChange}
          onShowSizeChange={handleSizeChange}
          {...omit(props, "current", "pageSize")}
          v-slots={slots}
        />
      );
    };
  },
});
