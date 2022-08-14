import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, reactive, VNode } from "vue";
import { BooleanObjType, BooleanRulesObjType, TColumns, TElementMap } from "../types";
import { useEffect } from "@vue-start/hooks";
import { forEach, map, size } from "lodash";
import { getFormItemEl } from "../core";

const ProFormKey = Symbol("pro-form");

export interface IProFormProvideExtra extends Record<string, any> {}

interface IProFormProvide extends IProFormProvideExtra {
  formState: UnwrapNestedRefs<Record<string, any>>;
  showState: UnwrapNestedRefs<Record<string, any>>;
  readonlyState: UnwrapNestedRefs<Record<string, any>>;
  disableState: UnwrapNestedRefs<Record<string, any>>;
  readonly: Ref<boolean | undefined>;
  //
  elementMap?: TElementMap;
  formElementMap?: TElementMap;
  //
  formItemVNodes: Ref<(VNode | null)[]>;
}

export const useProForm = (): IProFormProvide => inject(ProFormKey) as IProFormProvide;

const provideProForm = (ctx: IProFormProvide) => {
  provide(ProFormKey, ctx);
};

const proFormProps = () => ({
  /**
   * 同 antd 或 element  form中的model
   */
  model: { type: Object as PropType<UnwrapNestedRefs<Record<string, any>>> },
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
   *
   */
  columns: { type: Array as PropType<TColumns> },
  /**
   * 展示控件集合，readonly模式下使用这些组件渲染
   */
  elementMap: { type: Object as PropType<TElementMap> },
  /**
   * 录入控件集合
   */
  formElementMap: { type: Object as PropType<TElementMap> },
  /**
   * 是否启用rules验证
   */
  needRules: { type: Boolean, default: true },
  /**
   * provide传递
   */
  provideExtra: { type: Object as PropType<IProFormProvideExtra> },
});

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>>;

export const ProForm = defineComponent({
  props: {
    ...proFormProps(),
  },
  setup: (props, { slots }) => {
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

    /**
     * 将columns 转化为FormItem VNode对象
     */
    const formItemVNodes = computed(() => {
      if (size(props.formElementMap) <= 0) {
        return [];
      }
      return map(props.columns, (item) => {
        return getFormItemEl(props.formElementMap, item, props.needRules);
      });
    });

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
      formItemVNodes,
      //
      ...props.provideExtra,
    });

    return () => {
      return slots.default?.();
    };
  },
});
