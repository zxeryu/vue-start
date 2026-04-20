/*---
title: 基础使用
---*/
import { defineComponent, reactive } from "vue";
import { TagsTrigger } from "@vue-start/element-pro";

export default defineComponent(() => {
  const state = reactive({
    value: ["1", "2"] as string[],
  });

  return () => {
    return (
      <>
        <h3>基础使用</h3>
        <TagsTrigger
          options={[
            { label: "选项1", value: "1" },
            { label: "选项2", value: "2" },
            { label: "选项3", value: "3" },
          ]}
          onRemove={(val) => {
            state.value = state.value.filter((v) => v !== val);
          }}
          placeholder="请选择"
        />

        <h3>禁用状态</h3>
        <TagsTrigger
          disabled
          options={[
            { label: "选项1", value: "1" },
            { label: "选项2", value: "2" },
          ]}
          placeholder="禁用状态"
        />

        <h3>折叠标签</h3>
        <TagsTrigger
          options={[
            { label: "选项1", value: "1" },
            { label: "选项2", value: "2" },
            { label: "选项3", value: "3" },
            { label: "选项4", value: "4" },
            { label: "选项5", value: "5" },
          ]}
          onRemove={(val) => {
            state.value = state.value.filter((v) => v !== val);
          }}
          collapseTags
          collapseTagsTooltip
          maxCollapseTags={2}
          placeholder="折叠标签"
        />

        <h3>可清除</h3>
        <TagsTrigger
          options={[
            { label: "选项1", value: "1" },
            { label: "选项2", value: "2" },
          ]}
          onRemove={(val) => {
            state.value = state.value.filter((v) => v !== val);
          }}
          onClear={() => {
            state.value = [];
          }}
          clearable
          placeholder="可清除"
        />
      </>
    );
  };
});
