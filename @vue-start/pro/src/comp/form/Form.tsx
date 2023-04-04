import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, reactive, ref } from "vue";
import { BooleanObjType, BooleanRulesObjType, TColumn, TColumns, TElementMap } from "../../types";
import { useEffect, useRuleState } from "@vue-start/hooks";
import { forEach, get, has, keys, map, omit, size } from "lodash";
import { getColumnFormItemName, getFormItemEl, proBaseProps, ProBaseProps, useProConfig } from "../../core";
import { createExpose, getValidValues, mergeStateToList } from "../../util";
import { ProGridProps, ProOperate, ProGrid, ProOperateProps, IOpeItem, ElementKeys } from "../index";
import { provideProFormList } from "./FormList";

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
  columns: Ref<TColumns>;
}

export const useProForm = (): IProFormProvide => inject(ProFormKey) as IProFormProvide;

const provideProForm = (ctx: IProFormProvide) => {
  provide(ProFormKey, ctx);
};

export enum FormAction {
  RESET = "RESET",
  SUBMIT = "SUBMIT",
  CONTINUE = "CONTINUE",
}

export type TProFormOperate = ProOperateProps & {
  onReset?: () => void;
  onSubmit?: () => void;
  onContinue?: () => void;
};

const proFormProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-form" },
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
   * 是否启用rules验证
   */
  needRules: { type: Boolean, default: true },
  /**
   * provide传递
   */
  provideExtra: { type: Object as PropType<IProFormProvideExtra> },
  /**
   * 操作按钮
   */
  operate: { type: Object as PropType<TProFormOperate> },
  submitLoading: { type: Boolean },

  /**
   * ref 默认中转方法
   */
  formMethods: { type: Array as PropType<string[]> },
});

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>> &
  ProBaseProps &
  Omit<ProGridProps, "items"> & {
    onFinish?: (showValues?: Record<string, any>, values?: Record<string, any>) => void;
    onFinishFailed?: (errs: any) => void;
  };

export const ProForm = defineComponent<ProFormProps>({
  inheritAttrs: false,
  props: {
    ...proBaseProps,
    ...proFormProps(),
    ...omit(ProGrid.props, "items"),
  } as any,
  setup: (props, { slots, emit, expose, attrs }) => {
    const { elementMap: elementMapP, formElementMap: formElementMapP } = useProConfig();

    const elementMap = props.elementMap || elementMapP;
    const formElementMap = props.formElementMap || formElementMapP;

    const formState = props.model || reactive({});
    //组件状态相关
    const showState = useRuleState(formState, props.showStateRules!, props.showState);
    const readonlyState = useRuleState(formState, props.readonlyStateRules!, props.readonlyState);
    const disableState = useRuleState(formState, props.disableStateRules!, props.disableState);

    //readonly
    const readonly = computed(() => props.readonly);

    //columns合并
    const columns = computed(() =>
      mergeStateToList(props.columns!, props.columnState!, (item) => getColumnFormItemName(item)!),
    );

    const handleFinish = (values: Record<string, any>) => {
      //删除不显示的值再触发事件
      const showValues = getValidValues(values, showState, props.showStateRules);
      emit("finish", showValues, values);
    };

    const formRef = ref();
    expose(createExpose(props.formMethods || [], formRef));

    provideProForm({
      formState,
      showState,
      readonlyState,
      disableState,
      //
      elementMap,
      formElementMap,
      //
      readonly: readonly as any,
      //
      columns: columns as any,
      //
      formRef,
      //
      ...props.provideExtra,
    });

    const defaultOpeItems = [
      { value: FormAction.RESET, label: "重置" },
      { value: FormAction.SUBMIT, label: "提交", extraProps: { type: "primary" } },
    ];

    //默认处理 reset submit方法，submit dom 赋值loading
    const operateItems = computed(() => {
      const operate = props.operate;
      const items: IOpeItem[] = operate?.items || defaultOpeItems;
      return map(items, (item) => {
        //没有onClick
        if (!item.onClick && !get(operate?.itemState, [item.value, "onClick"])) {
          if (item.value === FormAction.RESET) {
            item.onClick = () => {
              //如果注册了onReset方法，优先执行onReset
              if (operate?.onReset) {
                operate.onReset();
                return;
              }
              formRef.value?.resetFields();
            };
          } else if (item.value === FormAction.SUBMIT) {
            item.onClick = () => {
              if (operate?.onSubmit) {
                operate.onSubmit();
                return;
              }
              formRef.value?.submit();
            };
          } else if (item.value === FormAction.CONTINUE && operate?.onContinue) {
            item.onClick = () => {
              operate.onContinue!();
            };
          }
        }
        if (item.value === FormAction.SUBMIT && !has(item, "loading")) {
          item.loading = props.submitLoading;
        }
        return item;
      });
    });

    //item render
    const renderItem = (item: TColumn) => {
      const rowKey = getColumnFormItemName(item);
      //插槽优先
      if (rowKey && slots[rowKey]) {
        return slots[rowKey]!(item, formState);
      }
      return getFormItemEl(formElementMap, item, props.needRules)!;
    };

    //为了不warning ...
    provideProFormList({} as any);

    const invalidKeys = keys(proFormProps());
    const gridKeys = keys(omit(ProGrid.props, "items"));

    const Form = get(elementMapP, ElementKeys.FormKey);

    return () => {
      if (!Form) {
        return null;
      }
      return (
        <Form
          ref={formRef}
          class={props.clsName}
          {...omit(attrs, "onFinish")}
          {...omit(props, ...invalidKeys, ...gridKeys, "onFinish", "operate")}
          model={formState}
          onFinish={handleFinish}>
          {slots.start?.()}

          {formElementMap && size(columns.value) > 0 && (
            <>
              {props.row ? (
                <ProGrid
                  row={props.row}
                  col={props.col}
                  items={map(columns.value, (item) => ({
                    rowKey: getColumnFormItemName(item),
                    vNode: renderItem(item) as any,
                    col: get(item, ["extra", "col"]),
                  }))}
                />
              ) : (
                map(columns.value, (item) => renderItem(item))
              )}
            </>
          )}

          {slots.default?.()}

          {props.operate && (
            <ProOperate
              clsName={"pro-form-operate"}
              items={operateItems.value}
              {...omit(props.operate, "items", "onReset", "onSubmit", "onContinue")}
            />
          )}

          {slots.end?.()}
        </Form>
      );
    };
  },
});
