/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { useConfig } from "@vue-start/config";

export default defineComponent(() => {
  const config = useConfig();

  const handleClick = () => {
    console.log(config);
  };

  return () => {
    return (
      <div>
        {JSON.stringify(config)}
        <br />
        <br />
        <el-button onClick={handleClick}>变量</el-button>
      </div>
    );
  };
});
