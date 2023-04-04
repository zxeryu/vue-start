import { defineComponent, reactive } from "vue";
import { columns } from "@/common/columns";
import { CurdAction, ProCurdModal, ProCurdModalFormConnect, useProCurd } from "@vue-start/pro";

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

  const opeItems = [
    { label: CurdAction.ADD, value: CurdAction.ADD, onClick: () => handleClick(CurdAction.ADD) },
    { label: CurdAction.EDIT, value: CurdAction.EDIT, onClick: () => handleClick(CurdAction.EDIT) },
    { label: CurdAction.DETAIL, value: CurdAction.DETAIL, onClick: () => handleClick(CurdAction.DETAIL) },
    { label: "自定义mode", value: SelfMode, onClick: () => handleClick(SelfMode) },
  ];

  return () => {
    return (
      <>
        <pro-operate items={opeItems} />
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
