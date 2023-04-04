/*---
title: showStateRules、readonlyStateRules、disableStateRules
desc: 根据不同的Rules，渲染不同的表单项状态
---*/
import { defineComponent, reactive } from "vue";
import { take } from "lodash";
import { columns } from "@/common/columns";

export default defineComponent(() => {
  const formState = reactive({
    name: "aaa",
    age: 18,
    gender: "man",
  });

  return () => {
    return (
      <>
        <div>
          <p>gender === man，age只读</p>
          <p>gender === woman，age禁用</p>
          <p>gender === other，age不渲染</p>
        </div>
        <br />
        <pro-form
          model={formState}
          columns={take(columns, 3)}
          showStateRules={{
            age: (record: Record<string, any>) => record.gender !== "other",
          }}
          readonlyStateRules={{
            age: (record: Record<string, any>) => record.gender === "man",
          }}
          disableStateRules={{
            age: (record: Record<string, any>) => record.gender === "woman",
          }}
        />
      </>
    );
  };
});
