import { defineComponent, reactive } from "vue";
import { columns } from "@/common/columns";
import { CurdAction, ProCurdModal, ProCurdModalFormConnect, useProCurd } from "@vue-start/pro";
import { map } from "lodash";

const SelfMode = "SelfMode";

const SelfChild = defineComponent(() => {
  const { curdState } = useProCurd();
  return () => {
    return (
      <ProCurdModal validMode={[SelfMode]} title={"自定义mode"}>
        <div>自定义内容</div>
        <div>名称：{curdState.detailData?.name}</div>
      </ProCurdModal>
    );
  };
});

export default defineComponent(() => {
  const curdState = reactive({
    mode: "",
    detailData: {},
  });

  const handleClick = (action: string) => {
    curdState.mode = action;
    curdState.detailData = {
      id: "1",
      name: "aaa",
      age: 18,
      gender: "man",
      treeOperate: "v-1-1",
      birthday: "2020-01-01",
      checkbox: ["man", "other"],
      radio: "other",
      digitRange: [1, 10],
    };
  };

  const actions = [CurdAction.ADD, CurdAction.EDIT, CurdAction.DETAIL];

  return () => {
    return (
      <>
        {map(actions, (item) => {
          return <el-button onClick={() => handleClick(item)}>{item}</el-button>;
        })}
        <el-button onClick={() => handleClick(SelfMode)}>自定义mode</el-button>
        <pro-curd curdState={curdState} columns={columns}>
          {/*内置 mode*/}
          <ProCurdModalFormConnect />
          {/*自定义 mode*/}
          <SelfChild />
        </pro-curd>
      </>
    );
  };
});
