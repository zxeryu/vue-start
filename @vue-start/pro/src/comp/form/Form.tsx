import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, reactive, ref } from "vue";
import { BooleanObjType, BooleanRulesObjType, TColumns, TElementMap } from "../../types";
import { useEffect } from "@vue-start/hooks";
import { forEach, get, has, keys, map, omit, size } from "lodash";
import { getColumnFormItemName, getFormItemEl, proBaseProps, ProBaseProps, useProConfig } from "../../core";
import { createExpose, getValidValues, mergeStateToList } from "../../util";
import { ProGridProps, Operate, ProGrid, ProOperateProps } from "../index";
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
  operate: { type: Object as PropType<ProOperateProps> },
  submitLoading: { type: Boolean },

  /**
   * ref 默认中转方法
   */
  formMethods: { type: Array as PropType<string[]> },
});

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>> &
  ProBaseProps &
  Omit<ProGridProps, "items">;

export const ProForm = defineComponent<ProFormProps>({
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
    const formMethods = props.formMethods || [];
    expose(createExpose(formMethods, formRef));

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

    //默认处理 reset submit方法，submit dom 赋值loading
    const operateItems = computed(() => {
      return map(props.operate?.items, (item) => {
        if (!item.onClick) {
          if (item.value === "reset") {
            item.onClick = () => formRef.value?.resetFields();
          } else if (item.value === "submit") {
            item.onClick = () => formRef.value?.submit();
          }
        }
        if (item.value === "submit" && !has(item, "loading")) {
          item.loading = props.submitLoading;
        }
        return item;
      });
    });

    //为了不warning ...
    provideProFormList({} as any);

    const invalidKeys = keys(proFormProps());
    const gridKeys = keys(omit(ProGrid.props, "items"));

    const Form = get(elementMapP, ProFormKey);

    return () => {
      if (!Form) {
        return null;
      }
      return (
        <Form
          ref={formRef}
          class={props.clsName}
          {...omit(attrs, "onFinish")}
          {...omit(props, ...invalidKeys, ...gridKeys, "onFinish")}
          model={formState}
          onFinish={handleFinish}
          v-slots={omit(slots, "default")}>
          {slots.start?.()}

          {formElementMap && size(columns.value) > 0 && (
            <>
              {props.row ? (
                <ProGrid
                  row={props.row}
                  col={props.col}
                  items={map(columns.value, (item) => ({
                    rowKey: getColumnFormItemName(item),
                    vNode: getFormItemEl(formElementMap, item, props.needRules)!,
                    col: get(item, ["extra", "col"]),
                  }))}
                />
              ) : (
                map(columns.value, (item) => getFormItemEl(formElementMap, item, props.needRules))
              )}
            </>
          )}

          {slots.default?.()}

          {props.operate && (
            <Operate clsName={"pro-form-operate"} items={operateItems.value} {...omit(props.operate, "items")} />
          )}

          {slots.end?.()}
        </Form>
      );
    };
  },
});
