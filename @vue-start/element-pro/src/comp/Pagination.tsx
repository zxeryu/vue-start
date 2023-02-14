import { defineComponent, ref } from "vue";
import { ElPagination } from "element-plus";
import { debounce, omit } from "lodash";
import { useWatch } from "@vue-start/hooks";

export const ProPagination = defineComponent({
  props: {
    ...ElPagination.props,
    page: { type: Number, default: 1 },
  },
  setup: (props, { slots, emit }) => {
    const currentPage = ref(props.page);
    const pageSize = ref(props.pageSize);

    //同步page
    useWatch(
      () => {
        if (currentPage.value !== props.page) {
          currentPage.value = props.page;
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
      emit("composeChange", currentPage.value, pageSize.value);
    }, 300);

    const handleCurrentChange = () => {
      debounceChange();
      emit("update:page", currentPage.value);
    };
    const handleSizeChange = () => {
      debounceChange();
      emit("update:pageSize", pageSize.value);
    };

    return () => {
      return (
        <ElPagination
          v-model:currentPage={currentPage.value}
          v-model:pageSize={pageSize.value}
          // @ts-ignore
          onCurrentChange={handleCurrentChange}
          onSizeChange={handleSizeChange}
          {...omit(props, "currentPage", "pageSize")}
          v-slots={slots}
        />
      );
    };
  },
});
