/*---
title: FormList
desc: 钩子函数、插槽
---*/

import { defineComponent } from "vue";
import { get, take } from "lodash";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  const handleFinish = (values: Record<string, any>) => {
    console.log("values", values);
  };
  const baseColumns = take(columns, 3);

  const onPreAdd = () => {
    //返回true，将终止按钮事件
    // return true;
  };
  const onAdd = (originFun: () => void) => {
    originFun();
  };
  const onPreRemove = () => {
    //返回true，将终止按钮事件
    // return true;
  };
  const onRemove = (originFun: () => void) => {
    originFun();
  };

  return () => {
    return (
      <pro-form columns={baseColumns} operate={{}} onFinish={handleFinish}>
        <pro-form-list
          name={"list"}
          label={"List"}
          columns={baseColumns}
          onPreAdd={onPreAdd}
          onAdd={onAdd}
          onPreRemove={onPreRemove}
          onRemove={onRemove}
          v-slots={{
            itemMinus: () => <div>remove</div>,
            add: () => <div>添加一项</div>,
            age: ({ item, formState, pathList }: any) => {
              const record = get(formState, pathList);
              //如果gender选择man，禁用age
              const gender = get(formState, [...pathList, "gender"]);
              return (
                <pro-form-item label={"age"} name={[...pathList, item.dataIndex]} rules={[{ required: true }]}>
                  <pro-input-number v-model={record[item.dataIndex]} disabled={gender === "man"} />
                </pro-form-item>
              );
            },
          }}
        />
      </pro-form>
    );
  };
});
