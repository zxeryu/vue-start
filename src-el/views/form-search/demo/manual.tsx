/*---
title: 手动触发
desc: 提交按钮触发 onFinish
---*/
import { defineComponent, ref } from "vue";
import { columns } from "@el/common/columns";
import { SearchMode } from "@vue-start/pro";

export default defineComponent(() => {
  const formRef = ref();

  const handleSubmit = (values: Record<string, any>) => {
    console.log("values", values);
  };

  return () => (
    <pro-search-form
      ref={formRef}
      searchMode={SearchMode.MANUAL}
      columns={columns}
      labelWidth={80}
      onFinish={handleSubmit}>
      <div style={'display:inline-flex;vertical-align:middle;margin-bottom:18px'}>
        <el-button onClick={() => formRef.value?.resetFields()}>重置</el-button>
        <el-button type={"primary"} onClick={() => formRef.value?.submit()}>
          提交
        </el-button>
      </div>
    </pro-search-form>
  );
});
