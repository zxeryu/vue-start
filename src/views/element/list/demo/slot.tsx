/*---
title: 插槽
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);

  return () => {
    return (
      <pro-list
        searchProps={{ columns: searchColumns }}
        tableProps={{ columns, dataSource }}
        paginationProps={{ total: size(dataSource) }}
        v-slots={{
          start: () => <div style="color:red">插槽：start</div>,
          // search: () => <div>重写search</div>,
          divide: () => <div style="color:red">插槽：divide</div>,
          // table: () => <div>重写table</div>,
          divide2: () => <div style="color:red">插槽：divide2</div>,
          // pagination: () => <div>重写pagination</div>,
          end: () => <div style="color:red">插槽：end</div>,
        }}
      />
    );
  };
});
