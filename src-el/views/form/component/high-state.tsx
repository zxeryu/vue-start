import { defineComponent, reactive } from "vue";
import { take } from "lodash";
import { columns } from "@el/common/columns";

export default defineComponent(() => {
  const formState = reactive({
    name: "aaa",
    age: 18,
    gender: "man",
    treeOperate: "v-1-1",
  });

  return () => {
    return (
      <>
        <div>
          <p>gender === man，age只读</p>
          <p>gender === woman，age禁用</p>
          <p>
            gender === other，age不渲染&nbsp;
            <span style={"color:red;font-size:12px"}>finish事件第一个参数不包含隐藏组件的值</span>
          </p>
        </div>
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
          labelWidth={80}
        />
      </>
    );
  };
});
