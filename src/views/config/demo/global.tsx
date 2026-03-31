/*---
title: 全局配置初始化
---*/
import { defineComponent } from "vue";
import { init, getConfig, useConfig } from "@vue-start/config";

export default defineComponent(() => {
  const handleInit = () => {
    // 初始化全局配置（通常在项目入口处调用，传入解密后的配置）
    init({
      API_KEY: "decrypted-api-key-123",
      SECRET: "decrypted-secret-456",
      CUSTOM_VAR: "custom-value",
    });
  };

  const handleGetConfig = () => {
    // getConfig 会优先使用全局配置
    const config = getConfig();
    console.log("getConfig:", config);
    alert(`getConfig: ${JSON.stringify(config)}`);
  };

  return () => {
    const config = useConfig();
    return (
      <div>
        <h3>当前注入的配置 (useConfig)</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
        <br />
        <pro-operate
          items={[
            { value: "init", label: "初始化全局配置", onClick: handleInit },
            { value: "get", label: "调用getConfig", onClick: handleGetConfig },
          ]}
        />
      </div>
    );
  };
});
