import { defineComponent } from "vue";
import { useCheng } from "./ctx";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";

export const Header = defineComponent(() => {
  const { chengState } = useCheng();

  const columns = [
    { title: "组件", dataIndex: "showElements", valueType: "switch" },
    { title: "图层", dataIndex: "showTree", valueType: "switch" },
    { title: "设置", dataIndex: "showSet", valueType: "switch" },
  ];

  const getComp = useGetCompByKey();
  const Form = getComp(ElementKeys.ProFormKey);

  return () => {
    return (
      <div class={"pro-cheng-header"}>
        <Form model={chengState} columns={columns} inline />
      </div>
    );
  };
});
