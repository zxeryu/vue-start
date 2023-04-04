/*---
title: 自定义item组件
---*/
import { defineComponent } from "vue";
import { ProConfig } from "@vue-start/pro";
import { TableOperateItem } from "@/component/Table";

export default defineComponent(() => {
  const items = [
    { label: "详情", value: "detail" },
    { label: "编辑", value: "edit" },
    { label: "删除", value: "delete" },
  ];

  return () => {
    return (
      <>
        <div>此处使用'ProConfig'仅为举例，正常情况应注册到全局'ProConfig'中</div>
        <br />
        <ProConfig elementMap={{ "my-operate-key": TableOperateItem }}>
          <pro-operate items={items} elementKey={"my-operate-key"} />
        </ProConfig>
      </>
    );
  };
});
