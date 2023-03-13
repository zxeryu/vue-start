/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);

  const handleSearch = (values: Record<string, any>) => {
    console.log("values", values);
  };

  return () => {
    return (
      <pro-list
        searchProps={{ columns: searchColumns }}
        tableProps={{ columns, dataSource }}
        paginationProps={{ total: size(dataSource) }}
        onSearch={handleSearch}
      />
    );
  };
});
