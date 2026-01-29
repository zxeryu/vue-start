import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElTree } from "element-plus";
import { TreeComponentProps } from "element-plus/es/components/tree/src/tree.type";
import { isBoolean, keys, omit } from "lodash";

export const TreeMethods = [
  "filter",
  "updateKeyChildren",
  "getCheckedNodes",
  "setCheckedNodes",
  "getCheckedKeys",
  "setCheckedKeys",
  "setChecked",
  "getHalfCheckedNodes",
  "getHalfCheckedKeys",
  "getCurrentKey",
  "getCurrentNode",
  "setCurrentKey",
  "setCurrentNode",
  "getNode",
  "remove",
  "append",
  "insertBefore",
  "insertAfter",
];

type TFieldNames = {
  key?: string;
  children?: string;
  title?: string;
  disabled?: string;
  isLeaf?: string;
  class?: string;
};

const proTreeProps = () => ({
  //to：data
  treeData: { type: Array as PropType<Record<string, any>> },
  //to: props node-key
  fieldNames: { type: Object as PropType<TFieldNames> },
  //to show-checkbox
  selectable: { type: Boolean, default: undefined },
  //to default-expanded-keys
  expandedKeys: { type: Array as PropType<string[]> },
  //to default-checked-keys
  checkedKeys: { type: Array as PropType<string[]> },
});

export type ProTreeProps = Partial<ExtractPropTypes<ReturnType<typeof proTreeProps>>> & TreeComponentProps;

export const ProTree = defineComponent<ProTreeProps>({
  props: {
    ...ElTree.props,
    ...proTreeProps(),
  } as any,
  setup: (props, { slots }) => {
    const ignoreKeys = keys(proTreeProps());

    const createFieldNames = () => {
      const fieldNames = props.fieldNames;
      if (!fieldNames) return undefined;
      return {
        label: fieldNames.title,
        children: fieldNames.children,
        disabled: fieldNames.disabled,
        isLeaf: fieldNames.isLeaf,
        class: fieldNames.class,
      } as ProTreeProps["props"];
    };

    const fieldNames = createFieldNames();

    return () => {
      return (
        <ElTree
          {...omit(props, ignoreKeys)}
          data={(props.treeData as any) || props.data}
          props={fieldNames || props.props}
          nodeKey={props.fieldNames?.key || props.nodeKey}
          showCheckbox={isBoolean(props.selectable) ? props.selectable : props.showCheckbox}
          defaultExpandedKeys={props.expandedKeys || props.defaultExpandedKeys}
          defaultCheckedKeys={props.checkedKeys || props.checkedKeys}
          v-slots={slots}
        />
      );
    };
  },
});
