/*---
title: 布局自定义
desc: 本质上还是对Form的布局
---*/
import { defineComponent, ref } from "vue";
import { columns } from "@/common/columns";
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
      initEmit={false}
      inline={false}
      columns={columns}
      labelWidth={80}
      row={{ gutter: 30 }}
      col={{ span: 8 }}
      onFinish={handleSubmit}>
      <div style={"display:flex;justify-content:center"}>
        <el-button onClick={() => formRef.value?.resetFields()}>重置</el-button>
        <el-button type={"primary"} onClick={() => formRef.value?.submit()}>
          提交
        </el-button>
      </div>
    </pro-search-form>
  );
});
