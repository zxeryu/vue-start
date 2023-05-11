/*---
title: 基础使用
---*/
import { defineComponent, ref } from "vue";
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";

export default defineComponent(() => {
  const searchInTableRef = ref(false);

  const searchColumns = take(columns, 3);

  const handleSearch = (values: Record<string, any>) => {
    console.log("values", values);
  };

  const handleChange = () => {
    searchInTableRef.value = !searchInTableRef.value;
  };

  return () => {
    return (
      <>
        <button onClick={handleChange}>search in table</button>
        <pro-list
          searchInTable={searchInTableRef.value}
          searchProps={{ columns: searchColumns }}
          tableProps={{ columns, dataSource, toolbar: { columnSetting: {} } }}
          paginationProps={{ total: size(dataSource) }}
          onSearch={handleSearch}
        />
      </>
    );
  };
});
