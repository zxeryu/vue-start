/*---
title: 操作按钮
desc: element方法可以重写dom；\nshow：boolean/()=>boolean，可以隐藏dom；
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";

export default defineComponent(() => {
  const operate = {
    column: { minWidth: 140 },
    items: [
      {
        show: true,
        value: "detail",
        label: "详情",
        onClick: (record: Record<string, any>) => {
          console.log("detail", record);
        },
      },
      {
        //id为1 显示编辑按钮
        show: (record: Record<string, any>) => record.id === "1",
        value: "edit",
        label: "编辑",
        onClick: (record: Record<string, any>) => {
          console.log("edit", record);
        },
      },
      {
        show: true,
        value: "delete",
        label: "删除",
        //重写按钮
        //id为1 禁用删除按钮
        element: (record: Record<string, any>, item: Record<string, any>) => {
          return (
            <el-button
              type={"danger"}
              link
              disabled={record.id === "1"}
              onClick={() => {
                console.log(item.value, record);
              }}>
              {item.label}
            </el-button>
          );
        },
      },
    ],
  };

  return () => {
    return <pro-table columns={columns} dataSource={dataSource} operate={operate} />;
  };
});
