import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, dropdownProps, dropdownItemProps } from "element-plus";
import { TOption } from "../../types";
import { createExposeObj } from "@vue-start/pro";
import { keys, map, omit } from "lodash";

const proDropdownProps = () => ({
  options: Array as PropType<(TOption & typeof dropdownItemProps)[]>,
});

export type ProDropdownProps = Partial<ExtractPropTypes<ReturnType<typeof proDropdownProps>>> & typeof dropdownProps;

export const ProDropdown = defineComponent<ProDropdownProps>({
  props: {
    ...ElDropdown.props,
    ...proDropdownProps(),
  } as any,
  setup: (props, { slots, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const invalidKeys = keys(proDropdownProps());
    return () => {
      return (
        <ElDropdown
          ref={originRef}
          {...(omit(props, invalidKeys) as any)}
          v-slots={{
            dropdown: () => {
              return (
                <ElDropdownMenu>
                  {map(props.options, (item) => {
                    //插槽重写label
                    const labelEl = slots.label?.(item);

                    return (
                      <ElDropdownItem command={item.value} {...(omit(item, "value", "label") as any)}>
                        {labelEl || item.label}
                      </ElDropdownItem>
                    );
                  })}
                </ElDropdownMenu>
              );
            },
            ...slots,
          }}
        />
      );
    };
  },
});
