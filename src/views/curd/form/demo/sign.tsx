/*---
title: 指定 signName 、 排序
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { ProCurdForm } from "@vue-start/pro";
import { get, map } from "lodash";

export default defineComponent(() => {
  //覆盖columns中的值
  const reState = {
    name: { signFlag: true, signFlagSort: 3 },
    age: { signFlag: true, signFlagSort: 2 },
    gender: { signFlag: true, signFlagSort: 1 },
  };

  //columns中的前3项目标记 form
  const reColumns = map(columns, (item) => {
    return { ...item, ...get(reState, item.dataIndex) };
  });

  const handleFinish = (values: Record<string, any>) => {
    console.log(values);
  };

  return () => {
    return (
      <pro-curd columns={reColumns}>
        <ProCurdForm
          signName={"signFlag"}
          operate={{}}
          // @ts-ignore
          onFinish={handleFinish}
        />
      </pro-curd>
    );
  };
});
