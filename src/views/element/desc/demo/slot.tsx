/*---
title: slots方式重写
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";

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

  return () => {
    return (
      <pro-desc
        model={data}
        columns={columns}
        v-slots={{
          label: (item: any) => {
            if (item.dataIndex === "name") {
              return <span style="color:red">重写：{item.title}</span>;
            }
            return item.title;
          },
          value: (value: any, item: any) => {
            if (item.dataIndex === "name") {
              return <span style="color:red">重写：{value}</span>;
            }
            return value;
          },
        }}
      />
    );
  };
});
