/*---
title: 其他
desc: 序号(serialNumber)、 空字符占位(columnEmptyText)、列设置、居中
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return (
      <pro-table
        serialNumber
        columnEmptyText={"--"}
        column={{ align: "center" }}
        columns={columns}
        dataSource={dataSource}
        toolbar={{ columnSetting: {} }}
        v-slots={{
          "columnSetting-default": () => <span style={"color:red"}>自定义图标</span>,
        }}
      />
    );
  };
});
