/*---
title: 其他
desc: 序号(serialNumber)、 空字符占位(columnEmptyText)、列设置
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  return () => {
    return (
      <pro-table
        serialNumber
        columnEmptyText={"--"}
        columns={columns}
        dataSource={dataSource}
        toolbar={{ columnSetting: {} }}
      />
    );
  };
});
