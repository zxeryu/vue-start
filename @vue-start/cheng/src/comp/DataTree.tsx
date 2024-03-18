import { computed, defineComponent } from "vue";
import { useCheng } from "../Cheng";
import { IElementConfig, useGetCompByKey } from "@vue-start/pro";
import { isArray } from "lodash";
import { findTreeItem } from "@vue-start/hooks";

export const DataTree = defineComponent((props, { slots }) => {
  const { pageRef, elementRef } = useCheng();

  const treeData = computed(() => {
    const data = pageRef?.value?.configData?.elementConfigs;
    if (!data) return [];
    return isArray(data) ? data : [data];
  });

  const handleNodeClick = (data: any) => {
    const node = findTreeItem(treeData.value, (item) => item.elementId === data.elementId).target;
    elementRef.value = node as IElementConfig;
  };


  const getComp = useGetCompByKey();
  const Tree = getComp("Tree$");

  return () => {
    return (
      <div>
        <Tree
          data={treeData.value}
          props={{ label: "elementType", children: "children" }}
          default-expand-all
          expand-on-click-node={false}
          highlight-current
          draggable
          onNodeClick={handleNodeClick}
        />
      </div>
    );
  };
});
