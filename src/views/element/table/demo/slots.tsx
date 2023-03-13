/*---
title: 插槽
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return (
      <pro-table
        columns={columns}
        dataSource={dataSource}
        v-slots={{
          bodyCell: ({ value, column }: any) => {
            if (column.dataIndex === "name") {
              return <span style={"color:red"}>重写：{value}</span>;
            }
            return undefined;
          },
          headerCell: ({ title, column }: any) => {
            if (column.dataIndex === "name") {
              return <span style={"color:red"}>重写：{title}</span>;
            }
            return title;
          },
        }}
      />
    );
  };
});
