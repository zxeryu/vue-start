/*---
title: 基础使用
---*/
import { defineComponent, ref } from "vue";
import { columns } from "@el/common/columns";

export default defineComponent(() => {
  const formRef = ref();

  return () => (
    <>
      <pro-form
        ref={formRef}
        columns={columns}
        labelWidth={80}
        onFinish={(values: Record<string, any>) => {
          console.log("values", values);
        }}
      />
      <el-button onClick={() => formRef.value?.resetFields()}>重置</el-button>
      <el-button type={"primary"} onClick={() => formRef.value?.submit()}>
        提交
      </el-button>
    </>
  );
});
