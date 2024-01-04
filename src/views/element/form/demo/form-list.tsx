/*---
title: FormList
---*/

import { defineComponent } from "vue";
import { take } from "lodash";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  const handleFinish = (values: Record<string, any>) => {
    console.log("values", values);
  };
  const baseColumns = take(columns, 3);

  return () => {
    return (
      <pro-form columns={baseColumns} operate={{}} onFinish={handleFinish}>
        <pro-form-list
          name={"list"}
          label={"List"}
          columns={baseColumns}
          v-slots={{
            itemMinus: () => <div>remove</div>,
            add: () => <div>添加一项</div>,
          }}
        />
      </pro-form>
    );
  };
});
