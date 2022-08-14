import { computed, defineComponent, ExtractPropTypes } from "vue";
import { TValueType } from "../types";
import { useProForm } from "./Form";
import { useProFormList } from "./FormList";
import { get, isBoolean, keys, omit, set } from "lodash";
import { convertPathToList } from "../util";

export interface FormItemProps {
  name?: string | number | (string | number)[];
}

const proFormItemProps = () => ({
  readonly: { type: Boolean, default: undefined },
  fieldProps: { type: Object },
  showProps: { type: Object },
  slots: { type: Object },
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

        const setValue = (v: any) => {
          set(formState, path, v);
        };

        const invalidKeys = keys(proFormItemProps());

        return () => {
          const show = get(showState, path);
          if (isBoolean(show) && !show) {
            return null;
          }

          const value = get(formState, path);
          //valueType对应的展示组件
          const ShowComp: any = get(elementMap, valueType);

          return (
            <FormItem {...omit(props, ...invalidKeys, "name", "slots")} name={path} v-slots={props.slots}>
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
                  {...convertInputCompProps(value, setValue, get(disableState, path))}
                  {...props.fieldProps}
                  v-slots={slots}
                />
              )}
            </FormItem>
          );
        };
      },
    });
  };
};
