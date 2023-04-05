import { defineComponent, ExtractPropTypes, PropType, reactive, ref } from "vue";
import { clone, debounce, filter, get, keys, map, omit, size, some } from "lodash";
import { useEffect, useWatch } from "@vue-start/hooks";
import { getColumnFormItemName, getColumnValueType } from "../../core";
import { createExpose } from "../../util";
import { ProFormProps } from "./Form";
import { ElementKeys, useGetCompByKey } from "../comp";

export enum SearchMode {
  //自动触发搜索
  AUTO = "AUTO",
  //手动触发搜索
  MANUAL = "MANUAL",
}

export type ISearchMode = keyof typeof SearchMode;

const proSearchFormProps = () => ({
  /**
   * class
   */
  clsName: { type: String, default: "pro-search-form" },
  /**
   * 初始化触发 onFinish
   */
  initEmit: { type: Boolean, default: true },
  /**
   *  模式 自动触发或者手动触发 onFinish
   */
  searchMode: { type: String as PropType<ISearchMode>, default: SearchMode.AUTO },
  /**
   * 需要debounce处理的字段
   */
  debounceKeys: { type: Array as PropType<string[]> },
  //默认 valueType 为 text 的控件会debounce处理
  debounceTypes: { type: Array as PropType<string[]>, default: ["text"] },
  debounceTime: { type: Number, default: 800 },
});

export type ProSearchFormProps = Partial<ExtractPropTypes<ReturnType<typeof proSearchFormProps>>> & ProFormProps;

export const ProSearchForm = defineComponent<ProSearchFormProps>({
  props: {
    ...proSearchFormProps(),
    needRules: { type: Boolean, default: false },
  } as any,
  setup: (props, { slots, expose }) => {
    const getComp = useGetCompByKey();
    const Form = getComp(ElementKeys.ProFormKey);

    const formState = props.model || reactive({});

    const valueTypeSet = new Set(props.debounceTypes);
    //根据column valueType 算出默认需要debounce处理的属性集合
    const defaultDebounceKeys = map(
      filter(props.columns, (column) => {
        const valueType = getColumnValueType(column);
        //默认input组件的触发事件需要debounce处理
        return valueTypeSet.has(valueType);
      }),
      (column) => {
        return getColumnFormItemName(column);
      },
    );

    const formRef = ref();
    const formMethods = props.formMethods || [];
    expose(createExpose(formMethods, formRef));

    const handleFinish = () => {
      formRef.value?.submit();
    };

    const debounceFinish = debounce(() => {
      handleFinish();
    }, props.debounceTime);

    //初始化
    useEffect(() => {
      if (props.initEmit) {
        handleFinish();
      }
    }, []);

    const isDebounceDataChange = (
      state: Record<string, any>,
      prevState: Record<string, any>,
      debounceKeys: string[],
    ) => {
      return some(debounceKeys, (key) => get(state, key) !== get(prevState, key));
    };

    //监听
    useWatch(
      (state, prevState) => {
        if (props.searchMode !== SearchMode.AUTO) {
          return;
        }
        //如果改变的值中包括debounceKeys中注册的 延时触发
        const debounceKeys = size(props.debounceKeys) > 0 ? props.debounceKeys : defaultDebounceKeys;
        if (size(debounceKeys) > 0 && isDebounceDataChange(state, prevState, debounceKeys as string[])) {
          debounceFinish();
          return;
        }
        handleFinish();
      },
      () => clone(formState),
    );

    const invalidKeys = keys(omit(proSearchFormProps(), "clsName", "columns"));

    return () => {
      if (!Form) {
        return null;
      }
      return <Form ref={formRef} {...omit(props, invalidKeys)} model={formState} v-slots={slots} />;
    };
  },
});
