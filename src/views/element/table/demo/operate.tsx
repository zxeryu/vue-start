/*---
title: 操作按钮
desc: element方法可以重写dom；\nshow：boolean/()=>boolean，可以隐藏dom；
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const operate = {
    column: { minWidth: 150 },
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
        value: "DELETE",
        label: "删除",
        disabled: (record: any) => record.id === "2", //第二条数据禁用删除
        onClick: (record: Record<string, any>) => {
          console.log("DELETE", record);
        },
      },
      {
        show: true,
        value: "custom",
        label: "自定义",
        //重写按钮
        //id为1 禁用删除按钮
        element: (record: Record<string, any>, item: Record<string, any>) => {
          return (
            <span
              class={css({ color: "green", cursor: "pointer", marginLeft: 12 })}
              onClick={() => {
                console.log(item.value, record);
              }}>
              {item.label}
            </span>
          );
        },
      },
    ],
  };

  return () => {
    return <pro-table columns={columns} dataSource={dataSource} operate={operate} />;
  };
});
