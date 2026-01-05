import { computed, defineComponent, ExtractPropTypes } from "vue";
import { TValueType } from "../../types";
import { useProForm } from "./Form";
import { useProFormList } from "./FormList";
import { get, isBoolean, keys, map, omit, set } from "lodash";
import { convertPathToList } from "../../util";
import { useProConfig } from "../../core";
import { ProTip } from "../Tip";

export interface FormItemProps {
  name?: string | number | (string | number)[];
}

const proFormItemProps = () => ({
  readonly: { type: Boolean, default: undefined },
  fieldProps: { type: Object },
  showProps: { type: Object },
  slots: { type: Object },
  //
  tip: { type: [String, Object] },
  tipProps: { type: Object },
});

export type ProFormItemProps = Partial<ExtractPropTypes<ReturnType<typeof proFormItemProps>>> & Record<string, any>;

export const createFormItemCompFn = <T extends FormItemProps>(
  FormItem: any,
  convertInputCompProps: (value: any, setValue: (v: any) => void, disabled: boolean | undefined) => Record<string, any>,
) => {
  return ({ InputComp, valueType, name }: { InputComp: any; valueType: TValueType; name?: string }) => {
    return defineComponent<T & ProFormItemProps>({
      name,
      props: {
        ...FormItem.props,
        ...proFormItemProps(),
      },
      setup: (props, { slots }) => {
        const { formExtraMap, elementMap, t } = useProConfig();
        const { formState, readonlyState, disableState, readonly: formReadonly, userOpe } = useProForm();
        const formListCtx = useProFormList();

        //优先级 props.readonly > readonlyState > formContext.readonly
        const readonly = computed(() => {
          if (isBoolean(props.readonly)) {
            return props.readonly;
          } else if (isBoolean(readonlyState[props.name as string])) {
            return readonlyState[props.name as string];
          }
          return formReadonly.value;
        });

        const combineRuleMessage = () => {
          const prefix = get(formExtraMap!.value?.rulePrefixMap, valueType);
          return `${prefix || t.value("pleaseEnter")}${props.label || ""}`;
        };

        //补充required message
        const rules = computed(() => {
          if (!formExtraMap!.value?.rulePrefixMap) {
            return props.rules;
          }
          if (props.required === true && !props.rules) {
            return [{ required: true, message: combineRuleMessage() }];
          }
          if (!props.rules) {
            return props.rules;
          }
          return map(props.rules, (item) => {
            if (item.required && !item.message) {
              item.message = combineRuleMessage();
            }
            return item;
          });
        });

        const nameList = convertPathToList(props.name)!;
        const path = formListCtx?.pathList ? [...formListCtx.pathList, ...nameList] : nameList;

        const setValue = (v: any) => {
          //标记用户操作过
          userOpe.value = true;
          set(formState, path, v);
        };

        const invalidKeys = keys(proFormItemProps());

        /************************/
        const renderShow = () => {
          const value = get(formState, path);
          //插槽优先
          if (slots.renderShow) {
            return slots.renderShow({ value, record: formState, path });
          }
          //valueType对应的展示组件
          const ShowComp: any = get(elementMap, valueType);
          if (ShowComp) {
            return <ShowComp value={value} {...props.fieldProps} showProps={props.showProps} v-slots={slots} />;
          }
          //最后逻辑
          return <span>{value}</span>;
        };

        const renderInput = () => {
          const value = get(formState, path);
          const disabled = get(disableState, path);
          //插槽优先
          if (slots.renderInput) {
            return slots.renderInput({ value, setValue, disabled, record: formState, path });
          }
          return (
            <InputComp {...convertInputCompProps(value, setValue, disabled)} {...props.fieldProps} v-slots={slots} />
          );
        };

        const renderLabel = () => {
          return (
            <>
              {props.label}
              {props.tip && <ProTip content={props.tip} title={props.tip} {...props.tipProps} />}
            </>
          );
        };

        return () => {
          return (
            <FormItem
              class={"pro-form-item"}
              {...omit(props, ...invalidKeys, "name", "rules")}
              name={path}
              rules={rules.value}
              v-slots={{
                label: props.label || props.tip ? renderLabel : undefined,
                ...props.slots,
              }}>
              {readonly.value ? renderShow() : renderInput()}
            </FormItem>
          );
        };
      },
    });
  };
};
