/*---
title: 基础使用
---*/
import { defineComponent } from "vue";
import { createStateUse } from "@vue-start/store";

//全局状态，建议放到 src/store/StoreCurrent 文件中
const useLocalConfigStore = createStateUse("local-config", { theme: "light", layout: "compose" }, true);

export default defineComponent(() => {
  const [localConfig, setLocalConfig] = useLocalConfigStore();

  const handleClick = () => {
    setLocalConfig((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  return () => {
    return (
      <div>
        <div>local-config：{JSON.stringify(localConfig)}</div>

        <button onClick={handleClick}>改变 theme</button>
      </div>
    );
  };
});
