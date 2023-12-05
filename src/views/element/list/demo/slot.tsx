/*---
title: 插槽
desc: start、divide、divide2、end 这几个插槽支持props
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";
import { size, take } from "lodash";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const searchColumns = take(columns, 3);

  const divide2 = () => {
    return (
      <div class={css({ background: "pink", height: 100 })}>"start、divide、divide2、end" 同时支持 props 和 slot</div>
    );
  };

  return () => {
    return (
      <pro-list
        searchProps={{ columns: searchColumns }}
        tableProps={{ columns, dataSource }}
        paginationProps={{ total: size(dataSource) }}
        divide2={divide2}
        v-slots={{
          start: () => <div style="color:red">插槽：start</div>,
          // search: () => <div>重写search</div>,
          divide: () => <div style="color:red">插槽：divide</div>,
          // table: () => <div>重写table</div>,
          // divide2: () => <div style="color:red">插槽：divide2</div>,
          // pagination: () => <div>重写pagination</div>,
          end: () => <div style="color:red">插槽：end</div>,
        }}
      />
    );
  };
});
