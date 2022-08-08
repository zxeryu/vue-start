import { computed, defineComponent, ExtractPropTypes, PropType, reactive, ref, toRaw } from "vue";
import { ElForm, FormInstance, FormProps, ElFormItem, FormItemProps } from "element-plus";
import { forEach, keys, omit } from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { DefineComponent } from "@vue/runtime-core";
import { BooleanObjType, BooleanRulesObjType } from "../../types";
import { useEffect } from "@vue-start/hooks";
import { provideProForm } from "./ctx";
import { getValidValues } from "../util";

const proFormItemProps = () => ({
  name: { type: [String, Array] as PropType<string | (string | number)[]> },
});

export type ProFormItemProps = Partial<ExtractPropTypes<ReturnType<typeof proFormItemProps>>> & FormItemProps;

export const ProFormItem = defineComponent<ProFormItemProps>({
  props: {
    ...ElFormItem.props,
    ...proFormItemProps(),
  },
  setup: (props, { slots }) => {
    const invalidKeys = keys(proFormItemProps());

    return () => {
      return (
        <ElFormItem
          {...omit(props, ...invalidKeys, "name", "prop")}
          prop={props.prop || (props.name as any)}
          v-slots={slots}
        />
      );
    };
  },
});

const proFormProps = () => ({
  /**
   *  表单提交回调
   */
  onFinish: { type: Function as PropType<(showValues: any, values: any) => void> },
  /**
   *  子组件是否只读样式
   */
  readonly: { type: Boolean, default: undefined },
  /**
   *  FormComponent 根据此项来确定组件是否显示
   *  rules 根据rules中方法生成showState对象
   */
  showState: { type: Object as PropType<UnwrapNestedRefs<BooleanObjType>> },
  showStateRules: { type: Object as PropType<BooleanRulesObjType> },
  /**
   * 是否只读
   */
  readonlyState: { type: Object as PropType<UnwrapNestedRefs<BooleanObjType>> },
  readonlyStateRules: { type: Object as PropType<BooleanRulesObjType> },
  /**
   * 是否disabled
   */
  disableState: { type: Object as PropType<UnwrapNestedRefs<BooleanObjType>> },
  disableStateRules: { type: Object as PropType<BooleanRulesObjType> },
  /**
   * 展示控件集合，readonly模式下使用这些组件渲染
   */
  elementMap: { type: Object as PropType<{ [key: string]: DefineComponent }> },
  /**
   * provide传递
   */
  provideExtra: { type: Object as PropType<{ [key: string]: any }> },
});

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>> & FormProps & Record<string, any>;

export const ProForm = defineComponent({
  props: {
    ...ElForm.props,
    ...proFormProps(),
  },
  setup: (props, { slots, expose, emit }) => {
    const form = ref();

    const formState = props.model || reactive({});
    //组件状态相关
    const showState = props.showState || reactive({});
    const readonlyState = props.readonlyState || reactive({});
    const disableState = props.disableState || reactive({});

    //formState改变情况下，更新 showState，readonlyState，disableState状态
    useEffect(() => {
      if (props.showStateRules) {
        forEach(props.showStateRules, (fn, key) => {
          showState[key] = fn(formState);
        });
      }
      if (props.readonlyStateRules) {
        forEach(props.readonlyStateRules, (fn, key) => {
          readonlyState[key] = fn(formState);
        });
      }
      if (props.disableStateRules) {
        forEach(props.disableStateRules, (fn, key) => {
          disableState[key] = fn(formState);
        });
      }
    }, formState);

    //转换为ref对象
    const readonly = computed(() => props.readonly);

    provideProForm({
      formRef: form,
      formState,
      showState,
      readonlyState,
      disableState,
      //
      elementMap: props.elementMap,
      //
      readonly,
      //
      ...props.provideExtra,
    });

    const formRef = (el: FormInstance) => {
      const nexEl = {
        ...el,
        submit: () => {
          el.validate?.((isValid, invalidFields) => {
            if (isValid) {
              //验证成功
              //删除不显示的值再触发事件
              const showValues = getValidValues(formState, showState, props.showStateRules);
              emit("finish", showValues, toRaw(formState));
            } else {
              emit("finishFailed", invalidFields);
            }
          });
        },
      };
      expose(nexEl);
      form.value = nexEl;
    };

    const invalidKeys = keys(proFormProps());

    return () => {
      return (
        <ElForm ref={formRef as any} {...omit(props, ...invalidKeys, "model")} model={formState} v-slots={slots} />
      );
    };
  },
});
