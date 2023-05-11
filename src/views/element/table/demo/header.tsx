/*---
title: header
---*/
import { defineComponent } from "vue";
import { columns, dataSource } from "@/common/columns";
import { take } from "lodash";

export default defineComponent(() => {
  return () => {
    return (
      <pro-table
        columns={columns}
        dataSource={dataSource}
        toolbar={{ columnSetting: {} }} //列设置
        v-slots={{
          toolbar: () => (
            <>
              <div>标题</div>
              <pro-search-form columns={take(columns, 2)} />
              <div>其他</div>
            </>
          ),
          toolbarExtra: (nodes: any) => (
            <>
              <span>新增</span>&nbsp;
              {nodes}
            </>
          ),
        }}
      />
    );
  };
});
