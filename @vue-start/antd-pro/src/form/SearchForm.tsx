import { defineComponent, ExtractPropTypes, PropType, reactive, toRaw } from "vue";
import { keys, omit, clone, size, some, debounce, get } from "lodash";
import { useEffect } from "@vue-start/hooks";
import { getValidValues } from "../util";
import { ProSchemaForm, ProSchemaFormProps } from "./SchemaForm";

export enum SearchMode {
  //自动触发搜索
  AUTO = "AUTO",
  //手动触发搜索
  MANUAL = "MANUAL",
}

export type ISearchMode = keyof typeof SearchMode;

const proSearchFormProps = () => ({
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
  debounceTime: { type: Number, default: 800 },
});

export type ProSearchFormProps = Partial<ExtractPropTypes<ReturnType<typeof proSearchFormProps>>> & ProSchemaFormProps;

export const ProSearchForm = defineComponent<ProSearchFormProps>({
  name: "PSearchForm",
  props: {
    ...ProSchemaForm.props,
    ...proSearchFormProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const formState = props.model || reactive({});

    const handleFinish = () => {
      const values = toRaw(formState);
      const showValues = getValidValues(values, props.showState, props.showStateRules);
      emit("finish", showValues, values);
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
      return some(debounceKeys, (key) => {
        return get(state, key) !== get(prevState, key);
      });
    };

    //监听
    useEffect(
      (state, prevState) => {
        if (props.searchMode !== SearchMode.AUTO) {
          return;
        }
        //如果改变的值中包括debounceKeys中注册的 延时触发
        if (
          props.debounceKeys &&
          size(props.debounceKeys) > 0 &&
          isDebounceDataChange(state, prevState, props.debounceKeys)
        ) {
          debounceFinish();
          return;
        }
        handleFinish();
      },
      () => clone(formState),
    );

    const invalidKeys = keys(proSearchFormProps());

    return () => {
      return (
        <ProSchemaForm
          ref={(el: any) => expose({ ...el })}
          layout={"inline"}
          {...omit(props, ...invalidKeys, "model")}
          needRules={false}
          model={formState}
          v-slots={slots}
        />
      );
    };
  },
});
