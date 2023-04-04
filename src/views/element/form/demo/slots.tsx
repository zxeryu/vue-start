/*---
title: 插槽
---*/
import { defineComponent } from "vue";
import { columns } from "@/common/columns";
import { take } from "lodash";
import { TColumn } from "@vue-start/pro";

export default defineComponent(() => {
  const handleFinish = (values: Record<string, any>) => {
    console.log("values", values);
  };

  return () => {
    return (
      <pro-form
        columns={take(columns, 3)}
        labelWidth={80}
        operate={{}}
        onFinish={handleFinish}
        v-slots={{
          age: (column: TColumn, state: any) => {
            return (
              <pro-form-item name={column.dataIndex} label={column.title} {...column.formItemProps}>
                <pro-input-number v-model={state[column.dataIndex!]} {...column.formFieldProps} />
              </pro-form-item>
            );
          },
          gender: () => {
            return <div>gender重写</div>;
          },
        }}
      />
    );
  };
});
