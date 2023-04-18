/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { treeOptions } from "@/common/columns";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const activeRef = ref("v-2-1");

  const handleItemClick = (item: any) => {
    console.log(item);
  };

  return () => {
    return (
      <pro-menus
        class={css({ width: 300 })}
        uniqueOpened
        activeKey={activeRef.value}
        options={treeOptions}
        onMenuItemClick={handleItemClick}
      />
    );
  };
});
