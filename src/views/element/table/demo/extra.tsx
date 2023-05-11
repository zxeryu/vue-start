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
        serialNumber //序号
        columnEmptyText={"--"} //空字符占位
        column={{ align: "center" }} //居中
        columns={columns}
        dataSource={dataSource}
        toolbar={{ columnSetting: {} }} //列设置
      />
    );
  };
});
