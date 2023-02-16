import { defineComponent, reactive } from "vue";
import { columns } from "@/common/columns";
import { CurdAction, ProCurdModal } from "@vue-start/pro";
import { map } from "lodash";

const SelfMode = "SelfMode";

export default defineComponent(() => {
  const curdState = reactive({
    mode: "",
    detailData: {
      id: "1",
      name: "aaa",
      age: 18,
      gender: "man",
      treeOperate: "v-1-1",
      birthday: "2020-01-01",
      checkbox: ["man", "other"],
      radio: "other",
      digitRange: [1, 10],
    },
  });

  const handleClick = (action: string) => {
    curdState.mode = action;
  };

  const actions = [CurdAction.ADD, CurdAction.EDIT, CurdAction.DETAIL, SelfMode];

  return () => {
    return (
      <>
        {map(actions, (item) => {
          return <el-button onClick={() => handleClick(item)}>{item}</el-button>;
        })}
        <pro-curd curdState={curdState} columns={columns}>
          <ProCurdModal />
          <ProCurdModal validMode={[SelfMode]} title={"自定义mode"}>
            <div>自定义内容</div>
          </ProCurdModal>
        </pro-curd>
      </>
    );
  };
});
