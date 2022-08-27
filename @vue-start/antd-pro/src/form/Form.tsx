import { defineComponent, reactive, ref, toRaw } from "vue";
import { Form, FormProps } from "ant-design-vue";
import { get, keys, map, omit, pick, size } from "lodash";

import {
  getColumnFormItemName,
  getFormItemEl,
  getValidValues,
  ProForm as ProFormOrigin,
  ProFormProps as ProFormPropsOrigin,
  useProForm,
} from "@vue-start/pro";
import { ProGrid } from "../comp";

const Content = defineComponent({
  props: {
    ...ProGrid.props,
    needRules: { type: Boolean },
  },
  setup: (props) => {
    const { formElementMap, columns } = useProForm();
    return () => {
      if (!formElementMap || size(columns.value) <= 0) {
        return null;
      }
      if (!props.row) {
        return map(columns.value, (item) => getFormItemEl(formElementMap, item, props.needRules));
      }
      return (
        <ProGrid
          row={props.row}
          col={props.col}
          items={map(columns.value, (item) => ({
            rowKey: getColumnFormItemName(item),
            vNode: getFormItemEl(formElementMap, item, props.needRules)!,
            col: get(item, ["extra", "col"]),
          }))}
        />
      );
    };
  },
});

export type ProFormProps = ProFormPropsOrigin & FormProps;

export const ProForm = defineComponent<ProFormProps>({
  inheritAttrs: false,
  props: {
    ...Form.props,
    ...omit(ProFormOrigin.props, "model"),
    ...omit(ProGrid.props, "items"),
  },
  setup: (props, { slots, expose, emit, attrs }) => {
    const formRef = ref();

    const formState = props.model || reactive({});
    const showState = props.showState || reactive({});

    //删除不显示的值再触发事件
    const handleFinish = (values: Record<string, any>) => {
      const showValues = getValidValues(values, showState, props.showStateRules);
      emit("finish", showValues, values);
    };

    const handleRef = (el: any) => {
      if (el) {
        //为form对象注入submit方法
        el.submit = () => {
          el.validate().then(() => {
            handleFinish(toRaw(formState));
          });
        };
      }
      //对外提供form methods
      expose(el);
    };

    const originKeys = keys(omit(ProFormOrigin.props, "model"));
    const gridKeys = keys(ProGrid.props);

    return () => {
      return (
        <ProFormOrigin
          {...pick(props, ...originKeys, "provideExtra")}
          model={formState}
          showState={showState}
          provideExtra={{ formRef, ...props.provideExtra }}>
          <Form
            ref={handleRef as any}
            {...omit(attrs, "finish", "onFinish")}
            {...omit(props, ...originKeys, "model", ...gridKeys)}
            model={formState}
            onFinish={handleFinish}>
            {slots.top?.()}
            <Content {...pick(props, gridKeys)} needRules={props.needRules} />
            {slots.default?.()}
          </Form>
        </ProFormOrigin>
      );
    };
  },
});
