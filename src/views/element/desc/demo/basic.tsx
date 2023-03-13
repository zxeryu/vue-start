/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { map } from "lodash";

export default defineComponent(() => {
  const data = {
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

  const reColumns = map(columns, (item, index) => {
    if (index === 0) {
      return {
        ...item,
        extra: {
          //自定义 pro-desc-item 属性
          desc: { span: 3 },
        },
      };
    }
    return item;
  });

  return () => {
    return <pro-desc model={data} columns={reColumns} />;
  };
});
