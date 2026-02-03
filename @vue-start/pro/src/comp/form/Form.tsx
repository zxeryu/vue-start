import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, reactive, ref } from "vue";
import { BooleanObjType, BooleanRulesObjType, TColumn, TColumns, TElementMap } from "../../types";
import { findValueLabel, findValueRecord, TLabelOpts, useRuleState } from "@vue-start/hooks";
import { get, keys, map, omit, size, debounce, filter, forEach, set } from "lodash";
import {
  getColumnFormInputProps,
  getColumnFormItemName,
  getColumnsOpts,
  isValidNode,
  mergeState,
  proBaseProps,
  ProBaseProps,
  renderInputColumn,
  useGetMetaStoreName,
  useProConfig,
  useRegisterMetas,
  useRegisterStores,
} from "../../core";
import { createExpose, getValidValues } from "../../util";
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
  //记录用户是否操作
  userOpe: Ref<boolean>;
  //记录正在进行的异步任务，比如：上传
  asyncNum: Ref<number>;
}

export const useProForm = (): IProFormProvide => inject(ProFormKey) as IProFormProvide;

export const useFormSubmit = (cb: (...e: any[]) => void, wait = 300, options?: Record<string, any>) => {
  return debounce(cb, wait, options);
};

const provideProForm = (ctx: IProFormProvide) => {
  provide(ProFormKey, ctx);
};

export enum FormAction {
  RESET = "RESET",
  SUBMIT = "SUBMIT",
  CONTINUE = "CONTINUE",
}

export type TProFormOperate = ProOperateProps & {
  onReset?: ({ form }: { form: any }) => void;
  onSubmit?: ({ form }: { form: any }) => void;
  onContinue?: ({ form }: { form: any }) => void;
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
   * provide传递
   */
  provideExtra: { type: Object as PropType<IProFormProvideExtra> },
  /**
   * 操作按钮
   */
  operate: { type: Object as PropType<TProFormOperate> },
  opeItems: { type: Function as PropType<() => IOpeItem[]> },
  submitLoading: { type: Boolean },
  /**
   * ref 默认中转方法
   */
  formMethods: { type: Array as PropType<string[]> },
  /**
   * 防抖提交
   */
  debounceSubmit: {
    type: [Number, Object] as PropType<number | { wait: number; options?: Record<string, any> }>,
    default: undefined,
  },
  /**
   * submit触发前hook，返回true，表示消费了此事件，不执行finish回掉
   */
  onPreFinish: {
    type: Function as PropType<(...e: any[]) => boolean | undefined>,
    default: undefined,
  },
  /**
   * onFinish 中加入额外的值
   */
  onGetExtraValues: {
    type: Function as PropType<(opts?: any) => Record<string, any> | undefined>,
    default: undefined,
  },
});

export type ProFormProps = Partial<ExtractPropTypes<ReturnType<typeof proFormProps>>> &
  ProBaseProps &
  Omit<ProGridProps, "items"> & {
    onFinish?: (
      showValues?: Record<string, any>,
      values?: Record<string, any>,
      opts?: Pick<IProFormProvide, "userOpe" | "asyncNum">,
    ) => void;
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
    const { elementMap: elementMapP, formElementMap: formElementMapP, t } = useProConfig();

    const elementMap = props.elementMap || elementMapP;
    const formElementMap = props.formElementMap || formElementMapP;

    const formState = props.model || reactive({});
    //组件状态相关
    const showState = useRuleState(formState, props.showStateRules!, props.showState);
    const readonlyState = useRuleState(formState, props.readonlyStateRules!, props.readonlyState);
    const disableState = useRuleState(formState, props.disableStateRules!, props.disableState);

    //readonly
    const readonly = computed(() => props.readonly);

    const getMetaStoreName = useGetMetaStoreName();

    const { storeKeys, metaKeys } = getColumnsOpts(props.columns || []);
    const stores = useRegisterStores(storeKeys || []);
    const metas = useRegisterMetas(metaKeys || []);

    //columns合并
    const columns = computed<TColumns>(() => {
      return mergeState(props.columns!, props.columnState, props.columnState2, {
        stores,
        metas,
        getMetaStoreName,
        convertColumnPre: props.convertColumnPre,
        convertColumn: props.convertColumn,
      });
    });

    /*************** form extra **************/

    const getExtraLabelOpts = () => {
      const recordOpts = {};
      const labelOpts = {};
      const labelColumns = filter(columns.value, (item) => !!item.formExtra?.label?.name);
      forEach(labelColumns, (item) => {
        const name = getColumnFormItemName(item);
        const value = get(formState, name!);
        const fieldProps = getColumnFormInputProps(item);
        const opts: TLabelOpts = {
          options: fieldProps?.options || fieldProps?.data,
          fieldNames: fieldProps?.fieldNames,
          multiple: fieldProps?.multiple,
          allPath: fieldProps?.emitPath,
          separator: fieldProps?.separator$,
          itemSeparator: fieldProps?.itemSeparator$,
          ...item.formExtra?.label?.opts,
        };
        const records = findValueRecord(value, opts);
        const labels = findValueLabel(records, opts);

        const propName = item.formExtra?.label?.name!;
        set(recordOpts, propName, records);
        set(labelOpts, propName, labels);
      });

      return { recordOpts, labelOpts };
    };

    //
    const userOpe = ref(false);
    //
    const asyncNum = ref(0);

    /*************** finish **************/
    const emitFinish = (...e: any[]) => {
      // @ts-ignore
      const flag = props.onPreFinish?.(...e);
      if (flag === true) {
        return;
      }
      emit("finish", ...e, { userOpe, asyncNum });
    };

    const dOpts = props.debounceSubmit;
    const wait = (typeof dOpts === "object" ? dOpts.wait : dOpts) || 300;
    const debounceFinish = useFormSubmit((...e: any[]) => emitFinish(...e), wait, (dOpts as any)?.options);

    const handleFinish = (values: Record<string, any>) => {
      const { recordOpts, labelOpts } = getExtraLabelOpts();
      const reValues = { ...values, ...labelOpts, ...props.onGetExtraValues?.({ recordOpts, labelOpts }) };
      //删除不显示的值再触发事件
      const showValues = getValidValues(reValues, showState, props.showStateRules);
      if (dOpts !== undefined) {
        debounceFinish(showValues, reValues);
      } else {
        emitFinish(showValues, reValues);
      }
    };

    const formRef = ref();
    expose({
      //form 原始方法
      ...createExpose(props.formMethods || [], formRef),
      //
      userOpe,
      asyncNum,
    });

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
      userOpe: userOpe as any,
      asyncNum: asyncNum as any,
      //
      ...props.provideExtra,
    });

    //为了不warning ...
    provideProFormList({} as any);

    /************************************** operate 按钮 ******************************************/

    const defaultOpeItems = computed(() => {
      return [
        { value: FormAction.RESET, label: t.value("reset") },
        { value: FormAction.SUBMIT, label: t.value("submit"), extraProps: { type: "primary" } },
      ];
    });

    const handleReset = () => {
      //如果注册了onReset方法，优先执行onReset
      if (props.operate?.onReset) {
        props.operate.onReset({ form: formRef.value });
        return;
      }
      formRef.value?.resetFields();
    };

    const handleSubmit = () => {
      if (props.operate?.onSubmit) {
        props.operate.onSubmit({ form: formRef.value });
        return;
      }
      formRef.value?.submit();
    };

    const handleContinue = () => {
      props.operate?.onContinue?.({ form: formRef.value });
    };

    const actionClickMap = {
      [FormAction.RESET]: handleReset,
      [FormAction.SUBMIT]: handleSubmit,
      [FormAction.CONTINUE]: handleContinue,
    };

    //默认处理 reset submit方法
    const operateItems = computed(() => {
      const operate = props.operate;
      const items: IOpeItem[] = operate?.items || props.opeItems?.() || defaultOpeItems.value;
      return map(items, (item) => {
        //没有onClick
        if (!item.onClick && !get(operate?.itemState, [item.value, "onClick"])) {
          return { ...item, onClick: get(actionClickMap, item.value) };
        }
        return item;
      });
    });
    // submit dom 赋值loading
    const operateItemState = computed(() => ({
      [FormAction.SUBMIT]: { value: FormAction.SUBMIT, loading: props.submitLoading },
      ...props.operate?.itemState,
    }));

    /************************************** render ******************************************/

    const renderItem = (item: TColumn) => {
      const rowKey = getColumnFormItemName(item);
      //插槽优先
      if (rowKey && slots[rowKey]) {
        return slots[rowKey]!(item, formState);
      }
      return renderInputColumn(elementMap, formElementMap, item)!;
    };

    const items = computed(() => {
      //根据showState filter columns
      const showColumns = filter(columns.value, (item) => {
        const name = getColumnFormItemName(item);
        if (!get(showState, name!, true)) return false;
        return true;
      });

      if (!props.row) {
        return map(showColumns, (item) => renderItem(item));
      }
      return map(showColumns, (item) => ({
        rowKey: getColumnFormItemName(item),
        vNode: renderItem(item) as any,
        col: get(item, ["extra", "col"]),
      }));
    });

    const invalidKeys = [...keys(proFormProps()), ...keys(proBaseProps)];
    const gridKeys = keys(omit(ProGrid.props, "items"));

    const Form = get(elementMapP, ElementKeys.FormKey);

    return () => {
      if (!Form) {
        return null;
      }

      const start = slots.start?.();
      const content = slots.default?.();
      const end = slots.end?.();

      const cls = [props.clsName];
      //空，无自组件
      const isEmpty = size(items.value) <= 0 && !isValidNode(start) && !isValidNode(content);
      if (isEmpty) {
        cls.push("is-empty");
      }

      return (
        <Form
          ref={formRef}
          class={cls}
          {...omit(attrs, "onFinish")}
          {...omit(props, ...invalidKeys, ...gridKeys, "onFinish", "operate")}
          model={formState}
          onFinish={handleFinish}>
          {start}

          {formElementMap && size(columns.value) > 0 && (
            <>{props.row ? <ProGrid row={props.row} col={props.col} items={items.value as any} /> : items.value}</>
          )}

          {content}

          {props.operate && !isEmpty && (
            <ProOperate
              class={`${props.clsName}-operate`}
              {...omit(props.operate, "items", "itemState", "onReset", "onSubmit", "onContinue")}
              items={operateItems.value}
              itemState={operateItemState.value}
            />
          )}

          {end}
        </Form>
      );
    };
  },
});

export const FormRulePrefixMap = {
  text: "请输入",
  digit: "请输入",
  select: "请选择",
  treeSelect: "请选择",
  cascader: "请选择",
  checkbox: "请选择",
  radio: "请选择",
  switch: "请选择",
  date: "请选择",
  time: "请选择",
};
