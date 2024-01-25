/*---
title: 行、列合并
---*/

import { defineComponent } from "vue";
import { getNameMapByMergeOpts } from "@vue-start/hooks";

export default defineComponent(() => {
  const list = [
    { year: 2020, month: 1, day: "01", "A-1": 1, "A-2": 2, "A-3": 3, "A-total": 6 },
    { year: 2021, month: 1, day: "01", "A-1": 1, "A-2": 2, "A-3": 3, "A-total": 6 },
    { year: 2021, month: 1, day: "02", "A-1": 1, "A-2": 2, "A-3": 3, "A-total": 6 },
    { year: 2021, month: 1, day: "03", "A-1": 1, "A-2": 2, "A-3": 3, "A-total": 6 },
    { year: 2021, month: 2, day: "01", "A-1": 1, "A-2": 2, "A-3": 3, "A-total": 6 },
    { year: "--", month: "--", day: "--", "A-1": "A2", "A-2": "A2", "A-3": "A", "A-total": 6 },
  ];

  const mergeOpts = {
    rowNames: ["year", ["year", "month"]],
    colNames: [
      ["year", "month", "day"],
      ["A-1", "A-2", "A-3"],
    ],
  };

  /****** antd方式 ******/

  const nameMap = getNameMapByMergeOpts(mergeOpts);
  const customCell = (record: any, index: any, column: any) => {
    const name = column.dataIndex;
    if (nameMap[name]) {
      const rs = record[nameMap[name] as string];
      const cs = record[name + "-colspan"];
      return { rowSpan: rs, colSpan: cs };
    }
  };

  const columns = [
    { title: "年份", dataIndex: "year", customCell: customCell },
    { title: "月份", dataIndex: "month", customCell: customCell },
    { title: "天", dataIndex: "day", customCell: customCell },
    { title: "A-1", dataIndex: "A-1", customCell: customCell },
    { title: "A-2", dataIndex: "A-2", customCell: customCell },
    { title: "A-3", dataIndex: "A-3", customCell: customCell },
    { title: "A-total", dataIndex: "A-total" },
  ];

  return () => {
    return <pro-table border bordered columns={columns} dataSource={list} mergeOpts={mergeOpts} />;
  };
});
