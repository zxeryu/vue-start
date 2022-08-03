import { computed, defineComponent, DefineComponent, ExtractPropTypes } from "vue";
import { FormItem, FormItemProps } from "ant-design-vue";
import { TValueType } from "../../types";
import { useProForm } from "./ctx";
import { get, isBoolean, keys, omit, set } from "lodash";
import { convertPathToList } from "../util";

const proFormItemProps = () => ({
  readonly: { type: Boolean, default: undefined },
  fieldProps: { type: Object },
  showProps: { type: Object },
});

export type ProFormItemProps = Partial<ExtractPropTypes<ReturnType<typeof proFormItemProps>>> & FormItemProps;

export const createFormItemComponent = ({
  InputComp,
  valueType,
  name,
}: {
  InputComp: DefineComponent | any;
  valueType: TValueType;
  name: string;
}) =>
  defineComponent<ProFormItemProps>({
    name,
    props: {
      ...FormItem.props,
      ...proFormItemProps(),
    },
    setup: (props, { slots }) => {
      const { formState, showState, readonlyState, disableState, readonly: formReadonly, elementMap } = useProForm();

      //优先级 props.readonly > readonlyState > formContext.readonly
      const readonly = computed(() => {
        if (isBoolean(props.readonly)) {
          return props.readonly;
        } else if (isBoolean(readonlyState[props.name as string])) {
          return readonlyState[props.name as string];
        }
        return formReadonly.value;
      });

      const path = convertPathToList(props.name)!;

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
          <FormItem {...omit(props, invalidKeys)}>
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
                value={value}
                onUpdate:value={(v: any) => {
                  set(formState, path, v);
                }}
                allowClear
                disabled={get(disableState, props.name!)}
                {...props.fieldProps}
                v-slots={slots}
              />
            )}
          </FormItem>
        );
      };
    },
  });
