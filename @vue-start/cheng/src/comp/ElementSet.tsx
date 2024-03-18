import { computed, defineComponent, PropType, reactive, ref, VNode } from "vue";
import { useCheng } from "../Cheng";
import { useGetCompByKey, ElementKeys } from "@vue-start/pro";
import { get, isArray, isObject, map, set } from "lodash";
import { ISetPropGroup, ISetPropItem } from "../types";
import { useEffect, useWatch } from "@vue-start/hooks";

export const SetProp = defineComponent({
  props: {
    item: { type: Object as PropType<ISetPropGroup | ISetPropItem> },
    path: { type: Array as PropType<(string | number)[]>, default: [] },
  },
  setup: (props) => {
    const { elementRef } = useCheng();

    const visibleRef = ref(false);

    const path = [...props.path, props.item!.name];

    const setValue = (v: any) => {
      set(elementRef.value!.elementProps!, path, v);
    };

    //初始化，如果 array、object类型未赋值 []、{}
    useEffect(() => {
      const groupItem = props.item! as ISetPropGroup;

      if (!groupItem.groupType) return;

      const target = get(elementRef.value!.elementProps, path);
      if (groupItem.groupType === "array") {
        if (!isArray(target)) {
          setValue([]);
        }
      } else if (groupItem.groupType === "object") {
        if (!target) {
          setValue({});
        }
      }
    }, []);

    const handleOpen = () => {
      visibleRef.value = true;
    };

    const handleClose = () => {
      visibleRef.value = false;
    };

    const handleAddItem = () => {
      const target = get(elementRef.value!.elementProps, path);
      if (isArray(target)) {
        target.push({});
      }
    };

    /**************************** dom *****************************/

    const renderItem = (name: string, node: VNode) => {
      return (
        <div class={"set-item"}>
          <div class={"title"}>{name}</div>
          <div class={"element"}>{node}</div>
        </div>
      );
    };

    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);

    const Input = getComp("Input$");
    const Switch = getComp("Switch$");
    const Select = getComp("Select$");
    const InputNumber = getComp("InputNumber$");

    return () => {
      const modelValue = get(elementRef.value!.elementProps, path);

      const groupItem = props.item! as ISetPropGroup;
      if (groupItem.groupType === "array") {
        return renderItem(
          `${groupItem.name}（数组）`,
          <div>
            <div onClick={handleOpen}>设置</div>
            <Modal visible={visibleRef.value} title={groupItem.name} onCancel={handleClose}>
              {map(modelValue, (_, index) => {
                return (
                  <>
                    <div>删除什么的</div>
                    {map(groupItem.setProps, (item) => {
                      return <SetProp item={item} path={[...path, index]} />;
                    })}
                  </>
                );
              })}
              <div onClick={handleAddItem}>添加一项</div>
            </Modal>
          </div>,
        );
      } else if (groupItem.groupType === "object") {
        return renderItem(`${groupItem.name}（对象）`, <div>object</div>);
      }

      const item = props.item! as ISetPropItem;

      const opts = { modelValue, "onUpdate:modelValue": setValue };

      if (item.elementType === "select") {
        const options = map(item.options, (i) => ({ value: i, label: i }));
        return renderItem(item.name, <Select {...opts} options={options} clearable />);
      } else if (item.elementType === "switch") {
        return renderItem(item.name, <Switch {...opts} />);
      } else if (item.elementType === "digit") {
        return renderItem(item.name, <InputNumber {...opts} />);
      }

      return renderItem(item.name, <Input {...opts} />);
    };
  },
});

const JsonSet = defineComponent({
  props: {
    title: String,
    target: [Object, String],
  },
  setup: (props, { emit }) => {
    const initValue = isObject(props.target) ? JSON.stringify(props.target, null, " ") : props.target;
    const valueRef = ref(initValue || "");

    const handleSuccess = () => {
      const target = isObject(props.target) ? JSON.parse(valueRef.value) : valueRef.value;
      emit("success", target);
    };

    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);
    const Input = getComp("Input$");

    return () => {
      return (
        <Modal title={props.title || "json"} maskClosable={false} onOk={handleSuccess}>
          <Input v-model={valueRef.value} type={"textarea"} rows={5} />
        </Modal>
      );
    };
  },
});

const JsonSetDom = defineComponent({
  props: {
    ...JsonSet.props,
  },
  setup: (props, { slots }) => {
    const visibleRef = ref(false);

    const handleOpen = () => {
      visibleRef.value = true;
    };

    const handleSuccess = (target:any) => {
      console.log('###########tttt=====',target)
    };

    const handleClose = () => {
      visibleRef.value = false;
    };

    return () => {
      return (
        <>
          <div onClick={handleOpen}>{slots.default?.() || <span>json</span>}</div>
          {visibleRef.value && (
            <JsonSet
              // @ts-ignore
              visible
              title={props.title}
              target={props.target}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          )}
        </>
      );
    };
  },
});

export const ElementSet = defineComponent({
  props: {} as any,
  setup: () => {
    const { elementRef, elementsMap } = useCheng();

    const TabOptions = [
      { label: "属性", value: "prop" },
      { label: "样式", value: "style" },
    ];

    const state = reactive<{
      tab: "prop" | "style" | string;
    }>({ tab: TabOptions[0].value });

    const setProps = computed(() => {
      if (!elementRef.value) return [];
      const element = elementsMap[elementRef.value.elementType];
      return element?.setProps || [];
    });

    useWatch(
      () => {
        //保存操作
        console.log("##########$$$$", elementRef.value?.elementProps);
      },
      elementRef,
      { deep: true },
    );

    const getComp = useGetCompByKey();
    const Tabs = getComp("Tabs$");

    return () => {
      if (!elementRef.value) {
        return null;
      }
      return (
        <div class={"cheng-element-set"}>
          <Tabs v-model={state.tab} options={TabOptions} />
          {state.tab === "prop" && (
            <>
              <JsonSetDom title={"json"} target={elementRef.value!.elementProps} />
              {map(setProps.value, (item) => {
                return <SetProp item={item} />;
              })}
            </>
          )}
        </div>
      );
    };
  },
});
