import { defineComponent } from "vue";
import { css } from "@emotion/css";
import { useProCurd, ProCurdList } from "@vue-start/pro";
import { get, omit } from "lodash";

export const CurdListPage = defineComponent({
  props: {} as any,
  setup: () => {
    const { listProps } = useProCurd();

    return () => {
      return (
        <pro-page
          class={css({
            ".pro-page-content": {
              height: "100%",
              boxSizing: "border-box",
            },
            ".pro-curd-list": {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
            ".pro-table": {
              overflow: "hidden",
              ".el-table": {
                height: "calc(100% - var(--pro-table-toolbar-hei))",
              },
            },
          })}
          as={"div"}>
          <ProCurdList
            {...omit(listProps!.value, "slots")}
            v-slots={{
              divide2: () => <div class={css({ flexGrow: 1 })} />,
              ...get(listProps?.value, "slots"),
            }}
          />
        </pro-page>
      );
    };
  },
});
