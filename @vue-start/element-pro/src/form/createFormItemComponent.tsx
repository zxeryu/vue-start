import { computed, defineComponent, ExtractPropTypes } from "vue";
import { TValueType } from "../../types";
import { useProForm, useProFormList } from "./ctx";
import { get, isBoolean, keys, omit, set } from "lodash";
import { ProFormItem, ProFormItemProps } from "./Form";
import { convertPathToList } from "@vue-start/pro";

const proFormItemProps = () => ({
  readonly: { type: Boolean, default: undefined },
  fieldProps: { type: Object },
  showProps: { type: Object },
});

export type ProCreateFormItemProps = Partial<ExtractPropTypes<ReturnType<typeof proFormItemProps>>> &
  ProFormItemProps &
  Record<string, any>;

export const createFormItemComponent = ({
  InputComp,
  valueType,
  name,
}: {
  InputComp: any;
  valueType: TValueType;
  name: string;
}) =>
  defineComponent<ProCreateFormItemProps>({
    name,
    props: {
      ...ProFormItem.props,
      ...proFormItemProps(),
    },
    setup: (props, { slots }) => {
      const { formState, showState, readonlyState, disableState, readonly: formReadonly, elementMap } = useProForm();
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

      const nameList = convertPathToList(props.name)!;
      const path = formListCtx?.pathList ? [...formListCtx.pathList, ...nameList] : nameList;

      const invalidKeys = keys(proFormItemProps());

      return () => {
        const show = get(showState, props.name!);
        if (isBoolean(show) && !show) {
          return null;
        }

        const value = get(formState, path!);
        //valueType对应的展示组件
        const ShowComp: any = get(elementMap, valueType);

        return (
          <ProFormItem {...(omit(props, ...invalidKeys, "name") as any)} name={path as any}>
            {readonly.value ? (
              <>
                {ShowComp ? (
                  <ShowComp value={value} {...props.fieldProps} showProps={props.showProps} v-slots={slots} />
                ) : (
                  <span>{value}</span>
                )}
              </>
            ) : (
              <InputComp
                modelValue={value}
                onUpdate:modelValue={(v: any) => {
                  set(formState, path, v);
                }}
                clearable
                disabled={get(disableState, props.name!)}
                {...props.fieldProps}
                v-slots={slots}
              />
            )}
          </ProFormItem>
        );
      };
    },
  });
