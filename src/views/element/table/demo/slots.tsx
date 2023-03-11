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
          name: ({ row }: { row: Record<string, any> }) => <div style={"color:red"}>重写：{row.name}</div>,
          "name-header": () => <span style={"color:red"}>重写：名称</span>,
        }}
      />
    );
  };
});
