import { computed, defineComponent, ExtractPropTypes, PropType, reactive, toRaw } from "vue";
import { Form, FormProps } from "ant-design-vue";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { forEach, keys, omit } from "lodash";
import { DefineComponent } from "@vue/runtime-core";
import { provideProForm } from "./ctx";
import { useEffect } from "@vue-start/hooks";
import { BooleanObjType, BooleanRulesObjType } from "../../types";
import { getValidValues } from "../util";

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

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>> & Omit<FormProps, "onFinish">;

export const ProForm = defineComponent<ProFormProps>({
  name: "PForm",
  props: {
    ...Form.props,
    ...proFormProps(),
  },
  setup: (props, { emit, slots, expose }) => {
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

    //
    provideProForm({
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

    //删除不显示的值再触发事件
    const handleFinish = (values: Record<string, any>) => {
      const showValues = getValidValues(values, showState, props.showStateRules);
      emit("finish", showValues, values);
    };

    const formRef = (el: any) => {
      if (el) {
        //为form对象注入submit方法
        el.submit = () => {
          el.validate().then(() => {
            const values = toRaw(formState);
            handleFinish(values);
          });
        };
      }
      //对外提供form methods
      expose(el);
    };

    //pro-form 属性keys
    const invalidKeys = keys(proFormProps());

    return () => {
      return (
        <Form
          ref={formRef}
          {...omit(props, ...invalidKeys, "model")}
          model={formState}
          onFinish={handleFinish}
          v-slots={slots}
        />
      );
    };
  },
});
